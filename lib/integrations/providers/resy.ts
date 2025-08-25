import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class ResyProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Resy",
      type: "reservation",
      authType: "api_key",
      baseUrl: "https://api.resy.com",
      regions: ["US", "UK", "AU"],
      dataTypes: ["reservations", "customers", "analytics", "availability"],
      rateLimits: {
        requestsPerMinute: 500,
        requestsPerHour: 5000,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      if (!this.config.credentials.apiKey) {
        return { success: false, error: "API key required" }
      }

      // Test the API key with a simple request
      const response = await this.makeRequest(
        "GET",
        "/3/venue/me",
        {},
        {
          Authorization: `ResyAPI api_key="${this.config.credentials.apiKey}"`,
        },
      )

      if (response.venue) {
        this.accessToken = this.config.credentials.apiKey
        return { success: true, token: this.config.credentials.apiKey }
      }

      return { success: false, error: "Invalid API key" }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async fetchData(dataType: DataType): Promise<any> {
    await this.ensureAuthenticated()

    switch (dataType) {
      case "reservations":
        return this.fetchReservations()
      case "customers":
        return this.fetchCustomers()
      case "analytics":
        return this.fetchAnalytics()
      case "availability":
        return this.fetchAvailability()
      default:
        throw new Error(`Unsupported data type: ${dataType}`)
    }
  }

  private async fetchReservations(): Promise<any> {
    const venueId = this.config.credentials.venueId
    const response = await this.makeRequest(
      "GET",
      `/3/venue/${venueId}/reservations`,
      {
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
        limit: 100,
      },
      {
        Authorization: `ResyAPI api_key="${this.accessToken}"`,
      },
    )

    return this.transformReservations(response.reservations || [])
  }

  private async fetchCustomers(): Promise<any> {
    const venueId = this.config.credentials.venueId
    const response = await this.makeRequest(
      "GET",
      `/3/venue/${venueId}/customers`,
      {
        limit: 100,
      },
      {
        Authorization: `ResyAPI api_key="${this.accessToken}"`,
      },
    )

    return this.transformCustomers(response.customers || [])
  }

  private async fetchAnalytics(): Promise<any> {
    const venueId = this.config.credentials.venueId
    const response = await this.makeRequest(
      "GET",
      `/3/venue/${venueId}/analytics`,
      {
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
      },
      {
        Authorization: `ResyAPI api_key="${this.accessToken}"`,
      },
    )

    return this.transformAnalytics(response)
  }

  private async fetchAvailability(): Promise<any> {
    const venueId = this.config.credentials.venueId
    const response = await this.makeRequest(
      "GET",
      `/4/find`,
      {
        venue_id: venueId,
        day: new Date().toISOString().split("T")[0],
        party_size: 2,
      },
      {
        Authorization: `ResyAPI api_key="${this.accessToken}"`,
      },
    )

    return this.transformAvailability(response)
  }

  private transformReservations(reservations: any[]): any[] {
    return reservations.map((reservation) => ({
      id: reservation.id,
      externalId: reservation.resy_token,
      status: reservation.status,
      customerName: `${reservation.user.first_name} ${reservation.user.last_name}`,
      customerEmail: reservation.user.email,
      customerPhone: reservation.user.mobile_number,
      partySize: reservation.party_size,
      reservationTime: new Date(reservation.day + "T" + reservation.time_slot.start.time),
      tableNumber: reservation.table?.name,
      specialRequests: reservation.special_requests,
      createdAt: new Date(reservation.created_date),
      source: "resy",
    }))
  }

  private transformCustomers(customers: any[]): any[] {
    return customers.map((customer) => ({
      id: customer.id,
      name: `${customer.first_name} ${customer.last_name}`,
      email: customer.email,
      phone: customer.mobile_number,
      totalReservations: customer.reservation_count || 0,
      lastReservationDate: customer.last_reservation_date ? new Date(customer.last_reservation_date) : null,
      vipStatus: customer.is_vip || false,
      preferences: customer.dietary_restrictions || [],
      source: "resy",
    }))
  }

  private transformAnalytics(data: any): any {
    return {
      totalReservations: data.total_reservations || 0,
      totalCovers: data.total_covers || 0,
      averagePartySize: data.average_party_size || 0,
      noShowRate: data.no_show_rate || 0,
      cancellationRate: data.cancellation_rate || 0,
      peakHours: data.peak_times || [],
      popularDays: data.popular_days || [],
      source: "resy",
      period: {
        start: data.start_date,
        end: data.end_date,
      },
    }
  }

  private transformAvailability(data: any): any {
    return {
      date: data.day,
      availableSlots:
        data.results?.venues?.[0]?.slots?.map((slot) => ({
          time: slot.date.start,
          available: true,
          maxPartySize: slot.size.max,
        })) || [],
      source: "resy",
    }
  }
}
