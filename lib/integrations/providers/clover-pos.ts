import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class CloverPOSProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Clover POS",
      type: "pos",
      authType: "oauth2",
      baseUrl: "https://api.clover.com",
      regions: ["US", "CA"],
      dataTypes: ["orders", "menu", "customers", "analytics", "payments"],
      rateLimits: {
        requestsPerMinute: 1000,
        requestsPerHour: 5000,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      const authUrl = `${this.config.baseUrl}/oauth/token`

      const response = await this.makeRequest("POST", authUrl, {
        client_id: this.config.credentials.clientId,
        client_secret: this.config.credentials.clientSecret,
        code: this.config.credentials.authCode,
      })

      if (response.access_token) {
        this.accessToken = response.access_token
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
      case "orders":
        return this.fetchOrders()
      case "menu":
        return this.fetchMenu()
      case "customers":
        return this.fetchCustomers()
      case "analytics":
        return this.fetchAnalytics()
      case "payments":
        return this.fetchPayments()
      default:
        throw new Error(`Unsupported data type: ${dataType}`)
    }
  }

  private async fetchOrders(): Promise<any> {
    const merchantId = this.config.credentials.merchantId
    const response = await this.makeRequest(
      "GET",
      `/v3/merchants/${merchantId}/orders`,
      {
        limit: 100,
        filter: `createdTime>=${Date.now() - 30 * 24 * 60 * 60 * 1000}`,
        expand: "lineItems",
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformOrders(response.elements || [])
  }

  private async fetchMenu(): Promise<any> {
    const merchantId = this.config.credentials.merchantId
    const response = await this.makeRequest(
      "GET",
      `/v3/merchants/${merchantId}/categories`,
      {
        expand: "items",
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformMenu(response.elements || [])
  }

  private async fetchCustomers(): Promise<any> {
    const merchantId = this.config.credentials.merchantId
    const response = await this.makeRequest(
      "GET",
      `/v3/merchants/${merchantId}/customers`,
      {
        limit: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformCustomers(response.elements || [])
  }

  private async fetchAnalytics(): Promise<any> {
    const merchantId = this.config.credentials.merchantId
    const response = await this.makeRequest(
      "GET",
      `/v3/merchants/${merchantId}/orders`,
      {
        filter: `createdTime>=${Date.now() - 30 * 24 * 60 * 60 * 1000}`,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformAnalytics(response.elements || [])
  }

  private async fetchPayments(): Promise<any> {
    const merchantId = this.config.credentials.merchantId
    const response = await this.makeRequest(
      "GET",
      `/v3/merchants/${merchantId}/payments`,
      {
        limit: 100,
        filter: `createdTime>=${Date.now() - 30 * 24 * 60 * 60 * 1000}`,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformPayments(response.elements || [])
  }

  private transformOrders(orders: any[]): any[] {
    return orders.map((order) => ({
      id: order.id,
      externalId: order.id,
      status: order.state,
      customerName: order.customer?.firstName + " " + order.customer?.lastName,
      customerPhone: order.customer?.phoneNumber,
      customerEmail: order.customer?.emailAddress,
      items:
        order.lineItems?.elements?.map((item) => ({
          name: item.name,
          quantity: 1,
          price: item.price / 100,
          modifiers: item.modifications?.elements || [],
        })) || [],
      total: order.total / 100,
      tax: order.tax / 100,
      tip: order.tip / 100,
      orderTime: new Date(order.createdTime),
      source: "clover-pos",
    }))
  }

  private transformMenu(categories: any[]): any {
    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: "",
        items:
          category.items?.elements?.map((item) => ({
            id: item.id,
            name: item.name,
            description: "",
            price: item.price / 100,
            available: !item.hidden,
            modifiers: item.modifierGroups?.elements || [],
          })) || [],
      })),
      lastUpdated: new Date(),
      source: "clover-pos",
    }
  }

  private transformCustomers(customers: any[]): any[] {
    return customers.map((customer) => ({
      id: customer.id,
      name: customer.firstName + " " + customer.lastName,
      email: customer.emailAddress,
      phone: customer.phoneNumber,
      totalOrders: 0, // Clover doesn't provide this directly
      totalSpent: 0, // Would need to calculate from orders
      lastOrderDate: null,
      source: "clover-pos",
    }))
  }

  private transformAnalytics(orders: any[]): any {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0) / 100
    const totalOrders = orders.length

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      topItems: [], // Would need additional processing
      ordersByDay: [], // Would need additional processing
      source: "clover-pos",
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    }
  }

  private transformPayments(payments: any[]): any[] {
    return payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount / 100,
      tax: payment.taxAmount / 100,
      tip: payment.tipAmount / 100,
      paymentMethod: payment.cardTransaction?.type || "unknown",
      timestamp: new Date(payment.createdTime),
      source: "clover-pos",
    }))
  }
}
