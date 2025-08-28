import { BaseIntegrationProvider } from "./base"

interface Reservation {
  id: string
  restaurantId: string
  platform: string
  customerName: string
  customerEmail: string
  customerPhone: string
  partySize: number
  dateTime: Date
  status: "confirmed" | "pending" | "cancelled" | "seated" | "no_show"
  specialRequests?: string
  tableId?: string
}

interface ReservationAnalytics {
  totalReservations: number
  confirmedReservations: number
  cancelledReservations: number
  noShows: number
  averagePartySize: number
  peakHours: Array<{ hour: number; count: number }>
}

export class OpenTableProvider extends BaseIntegrationProvider {
  name = "OpenTable"
  type = "reservation"
  authType = "api_key" as const

  async authenticate(credentials: { apiKey: string; restaurantId: string }): Promise<boolean> {
    try {
      const response = await fetch(`https://platform.opentable.com/sync/v2/restaurants/${credentials.restaurantId}`, {
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      console.error("OpenTable auth error:", error)
      return false
    }
  }

  async fetchReservations(
    restaurantId: string,
    apiKey: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Reservation[]> {
    try {
      const params = new URLSearchParams({
        start_date: startDate?.toISOString() || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: endDate?.toISOString() || new Date().toISOString(),
      })

      const response = await fetch(
        `https://platform.opentable.com/sync/v2/restaurants/${restaurantId}/reservations?${params}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`OpenTable API error: ${response.status}`)
      }

      const data = await response.json()
      return data.reservations.map((reservation: any) => ({
        id: reservation.id,
        restaurantId,
        platform: "opentable",
        customerName: `${reservation.customer.first_name} ${reservation.customer.last_name}`,
        customerEmail: reservation.customer.email,
        customerPhone: reservation.customer.phone,
        partySize: reservation.party_size,
        dateTime: new Date(reservation.date_time),
        status: this.mapOpenTableStatus(reservation.status),
        specialRequests: reservation.special_requests,
        tableId: reservation.table_id,
      }))
    } catch (error) {
      console.error("OpenTable fetch reservations error:", error)
      return []
    }
  }

  private mapOpenTableStatus(status: string): Reservation["status"] {
    const statusMap: Record<string, Reservation["status"]> = {
      confirmed: "confirmed",
      pending: "pending",
      cancelled: "cancelled",
      seated: "seated",
      no_show: "no_show",
    }
    return statusMap[status] || "pending"
  }

  async createReservation(
    restaurantId: string,
    apiKey: string,
    reservation: Omit<Reservation, "id" | "restaurantId" | "platform">,
  ): Promise<string> {
    try {
      const response = await fetch(`https://platform.opentable.com/sync/v2/restaurants/${restaurantId}/reservations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            first_name: reservation.customerName.split(" ")[0],
            last_name: reservation.customerName.split(" ").slice(1).join(" "),
            email: reservation.customerEmail,
            phone: reservation.customerPhone,
          },
          party_size: reservation.partySize,
          date_time: reservation.dateTime.toISOString(),
          special_requests: reservation.specialRequests,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenTable create reservation error: ${response.status}`)
      }

      const data = await response.json()
      return data.reservation.id
    } catch (error) {
      console.error("OpenTable create reservation error:", error)
      throw error
    }
  }

  async getAnalytics(restaurantId: string, apiKey: string): Promise<ReservationAnalytics> {
    const reservations = await this.fetchReservations(restaurantId, apiKey)

    const peakHours = this.calculatePeakHours(reservations)

    return {
      totalReservations: reservations.length,
      confirmedReservations: reservations.filter((r) => r.status === "confirmed").length,
      cancelledReservations: reservations.filter((r) => r.status === "cancelled").length,
      noShows: reservations.filter((r) => r.status === "no_show").length,
      averagePartySize:
        reservations.length > 0 ? reservations.reduce((sum, r) => sum + r.partySize, 0) / reservations.length : 0,
      peakHours,
    }
  }

  private calculatePeakHours(reservations: Reservation[]): Array<{ hour: number; count: number }> {
    const hourCounts: Record<number, number> = {}

    reservations.forEach((reservation) => {
      const hour = reservation.dateTime.getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: Number.parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
  }
}

export class ResyProvider extends BaseIntegrationProvider {
  name = "Resy"
  type = "reservation"
  authType = "api_key" as const

  async authenticate(credentials: { apiKey: string; venueId: string }): Promise<boolean> {
    try {
      const response = await fetch(`https://api.resy.com/3/venue/${credentials.venueId}`, {
        headers: {
          Authorization: `ResyAPI api_key="${credentials.apiKey}"`,
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      console.error("Resy auth error:", error)
      return false
    }
  }

  async fetchReservations(venueId: string, apiKey: string, startDate?: Date, endDate?: Date): Promise<Reservation[]> {
    try {
      const params = new URLSearchParams({
        day: startDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
        party_size: "2", // Default party size for fetching availability
      })

      const response = await fetch(`https://api.resy.com/4/find?${params}&venue_id=${venueId}`, {
        headers: {
          Authorization: `ResyAPI api_key="${apiKey}"`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Resy API error: ${response.status}`)
      }

      const data = await response.json()
      // Note: Resy API structure may vary, this is a simplified implementation
      return (
        data.results?.venues?.[0]?.slots?.map((slot: any) => ({
          id: slot.config.token,
          restaurantId: venueId,
          platform: "resy",
          customerName: "N/A", // Resy doesn't provide customer details in availability endpoint
          customerEmail: "N/A",
          customerPhone: "N/A",
          partySize: slot.size.min,
          dateTime: new Date(slot.date.start),
          status: "confirmed" as const,
        })) || []
      )
    } catch (error) {
      console.error("Resy fetch reservations error:", error)
      return []
    }
  }

  async getAnalytics(venueId: string, apiKey: string): Promise<ReservationAnalytics> {
    const reservations = await this.fetchReservations(venueId, apiKey)

    return {
      totalReservations: reservations.length,
      confirmedReservations: reservations.filter((r) => r.status === "confirmed").length,
      cancelledReservations: reservations.filter((r) => r.status === "cancelled").length,
      noShows: reservations.filter((r) => r.status === "no_show").length,
      averagePartySize:
        reservations.length > 0 ? reservations.reduce((sum, r) => sum + r.partySize, 0) / reservations.length : 0,
      peakHours: this.calculatePeakHours(reservations),
    }
  }

  private calculatePeakHours(reservations: Reservation[]): Array<{ hour: number; count: number }> {
    const hourCounts: Record<number, number> = {}

    reservations.forEach((reservation) => {
      const hour = reservation.dateTime.getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: Number.parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
  }
}

export const reservationProviders = {
  opentable: new OpenTableProvider(),
  resy: new ResyProvider(),
}
