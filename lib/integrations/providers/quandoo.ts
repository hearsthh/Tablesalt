import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class QuandooProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Quandoo",
      type: "reservation",
      authType: "oauth2",
      baseUrl: "https://api.quandoo.com",
      regions: ["DE", "IT", "AT", "TR", "SG", "AU"],
      dataTypes: ["reservations", "customers", "analytics", "availability"],
      rateLimits: {
        requestsPerMinute: 300,
        requestsPerHour: 3000,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      const authUrl = `${this.config.baseUrl}/v1/oauth/token`

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
    const merchantId = this.config.credentials.merchantId
    const response = await this.makeRequest(
      "GET",
      `/v1/merchants/${merchantId}/reservations`,
      {
        from_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        to_date: new Date().toISOString().split("T")[0],
        limit: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformReservations(response.reservations || [])
  }

  private async fetchCustomers(): Promise<any> {
    const merchantId = this.config.credentials.merchantId
    const response = await this.makeRequest(
      "GET",
      `/v1/merchants/${merchantId}/customers`,
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
    const merchantId = this.config.credentials.merchantId
    const response = await this.makeRequest(
      "GET",
      `/v1/merchants/${merchantId}/analytics`,
      {
        from_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        to_date: new Date().toISOString().split("T")[0],
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformAnalytics(response)
  }

  private async fetchAvailability(): Promise<any> {
    const merchantId = this.config.credentials.merchantId
    const response = await this.makeRequest(
      "GET",
      `/v1/merchants/${merchantId}/availability`,
      {
        date: new Date().toISOString().split("T")[0],
        capacity: 2,
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
      externalId: reservation.number,
      status: reservation.status,
      customerName: `${reservation.customer.first_name} ${reservation.customer.last_name}`,
      customerEmail: reservation.customer.email,
      customerPhone: reservation.customer.phone_number,
      partySize: reservation.capacity,
      reservationTime: new Date(reservation.start_date_time),
      tableNumber: reservation.table?.number,
      specialRequests: reservation.extra_info,
      createdAt: new Date(reservation.created_at),
      source: "quandoo",
    }))
  }

  private transformCustomers(customers: any[]): any[] {
    return customers.map((customer) => ({
      id: customer.id,
      name: `${customer.first_name} ${customer.last_name}`,
      email: customer.email,
      phone: customer.phone_number,
      totalReservations: customer.reservation_count || 0,
      lastReservationDate: customer.last_reservation_date ? new Date(customer.last_reservation_date) : null,
      vipStatus: customer.is_vip || false,
      preferences: customer.preferences || [],
      source: "quandoo",
    }))
  }

  private transformAnalytics(data: any): any {
    return {
      totalReservations: data.total_reservations || 0,
      totalCovers: data.total_covers || 0,
      averagePartySize: data.average_capacity || 0,
      noShowRate: data.no_show_rate || 0,
      cancellationRate: data.cancellation_rate || 0,
      peakHours: data.peak_hours || [],
      popularDays: data.popular_days || [],
      source: "quandoo",
      period: {
        start: data.from_date,
        end: data.to_date,
      },
    }
  }

  private transformAvailability(data: any): any {
    return {
      date: data.date,
      availableSlots:
        data.time_slots?.map((slot) => ({
          time: slot.time,
          available: slot.available,
          maxPartySize: slot.max_capacity,
        })) || [],
      source: "quandoo",
    }
  }
}
