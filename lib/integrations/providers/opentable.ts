import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class OpenTableProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "OpenTable",
      type: "reservation",
      authType: "oauth2",
      baseUrl: "https://platform.opentable.com",
      regions: ["US", "CA", "UK", "DE", "AU", "JP", "MX"],
      dataTypes: ["reservations", "customers", "analytics", "availability"],
      rateLimits: {
        requestsPerMinute: 1000,
        requestsPerHour: 10000,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      const authUrl = `${this.config.baseUrl}/oauth/token`

      const response = await this.makeRequest("POST", authUrl, {
        grant_type: "client_credentials",
        client_id: this.config.credentials.clientId,
        client_secret: this.config.credentials.clientSecret,
        scope: "reservations:read customers:read analytics:read",
      })

      if (response.access_token) {
        this.accessToken = response.access_token
        this.tokenExpiry = new Date(Date.now() + response.expires_in * 1000)
        return { success: true, token: response.access_token }
      }

      return { success: false, error: "Authentication failed" }
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
    const restaurantId = this.config.credentials.restaurantId
    const response = await this.makeRequest(
      "GET",
      `/v1/restaurants/${restaurantId}/reservations`,
      {
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
        limit: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformReservations(response.reservations || [])
  }

  private async fetchCustomers(): Promise<any> {
    const restaurantId = this.config.credentials.restaurantId
    const response = await this.makeRequest(
      "GET",
      `/v1/restaurants/${restaurantId}/customers`,
      {
        limit: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformCustomers(response.customers || [])
  }

  private async fetchAnalytics(): Promise<any> {
    const restaurantId = this.config.credentials.restaurantId
    const response = await this.makeRequest(
      "GET",
      `/v1/restaurants/${restaurantId}/analytics`,
      {
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformAnalytics(response)
  }

  private async fetchAvailability(): Promise<any> {
    const restaurantId = this.config.credentials.restaurantId
    const response = await this.makeRequest(
      "GET",
      `/v1/restaurants/${restaurantId}/availability`,
      {
        date: new Date().toISOString().split("T")[0],
        party_size: 2,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformAvailability(response)
  }

  private transformReservations(reservations: any[]): any[] {
    return reservations.map((reservation) => ({
      id: reservation.id,
      externalId: reservation.confirmation_number,
      status: reservation.status,
      customerName: `${reservation.customer.first_name} ${reservation.customer.last_name}`,
      customerEmail: reservation.customer.email,
      customerPhone: reservation.customer.phone,
      partySize: reservation.party_size,
      reservationTime: new Date(reservation.reservation_time),
      tableNumber: reservation.table?.number,
      specialRequests: reservation.special_requests,
      createdAt: new Date(reservation.created_at),
      source: "opentable",
    }))
  }

  private transformCustomers(customers: any[]): any[] {
    return customers.map((customer) => ({
      id: customer.id,
      name: `${customer.first_name} ${customer.last_name}`,
      email: customer.email,
      phone: customer.phone,
      totalReservations: customer.reservation_count || 0,
      lastReservationDate: customer.last_reservation_date ? new Date(customer.last_reservation_date) : null,
      vipStatus: customer.vip_status || false,
      preferences: customer.preferences || [],
      source: "opentable",
    }))
  }

  private transformAnalytics(data: any): any {
    return {
      totalReservations: data.total_reservations || 0,
      totalCovers: data.total_covers || 0,
      averagePartySize: data.average_party_size || 0,
      noShowRate: data.no_show_rate || 0,
      cancellationRate: data.cancellation_rate || 0,
      peakHours: data.peak_hours || [],
      popularDays: data.popular_days || [],
      source: "opentable",
      period: {
        start: data.start_date,
        end: data.end_date,
      },
    }
  }

  private transformAvailability(data: any): any {
    return {
      date: data.date,
      availableSlots:
        data.slots?.map((slot) => ({
          time: slot.time,
          available: slot.available,
          maxPartySize: slot.max_party_size,
        })) || [],
      source: "opentable",
    }
  }
}
