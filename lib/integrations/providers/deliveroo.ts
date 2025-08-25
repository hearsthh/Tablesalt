import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class DeliverooProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Deliveroo",
      type: "delivery",
      authType: "api_key",
      baseUrl: "https://api.deliveroo.com",
      regions: ["UK", "FR", "DE", "IT", "ES", "NL", "BE", "IE", "AU", "SG", "HK"],
      dataTypes: ["orders", "menu", "analytics"],
      rateLimits: {
        requestsPerMinute: 300,
        requestsPerHour: 3000,
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
        "/v1/restaurants/me",
        {},
        {
          Authorization: `Bearer ${this.config.credentials.apiKey}`,
        },
      )

      if (response.id) {
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
      case "orders":
        return this.fetchOrders()
      case "menu":
        return this.fetchMenu()
      case "analytics":
        return this.fetchAnalytics()
      default:
        throw new Error(`Unsupported data type: ${dataType}`)
    }
  }

  private async fetchOrders(): Promise<any> {
    const response = await this.makeRequest(
      "GET",
      "/v1/orders",
      {
        limit: 100,
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString(),
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformOrders(response.orders || [])
  }

  private async fetchMenu(): Promise<any> {
    const response = await this.makeRequest(
      "GET",
      "/v1/restaurants/me/menu",
      {},
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformMenu(response)
  }

  private async fetchAnalytics(): Promise<any> {
    const response = await this.makeRequest(
      "GET",
      "/v1/analytics",
      {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        to: new Date().toISOString().split("T")[0],
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformAnalytics(response)
  }

  private transformOrders(orders: any[]): any[] {
    return orders.map((order) => ({
      id: order.id,
      externalId: order.external_id,
      status: order.status,
      customerName: order.customer?.name,
      customerPhone: order.customer?.phone,
      items:
        order.items?.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price / 100,
          modifiers: item.modifiers || [],
        })) || [],
      total: order.total_price / 100,
      tax: order.tax / 100,
      tip: order.tip / 100,
      deliveryFee: order.delivery_fee / 100,
      orderTime: new Date(order.created_at),
      deliveryTime: order.delivered_at ? new Date(order.delivered_at) : null,
      source: "deliveroo",
    }))
  }

  private transformMenu(menu: any): any {
    return {
      categories:
        menu.categories?.map((category) => ({
          id: category.id,
          name: category.name,
          description: category.description,
          items:
            category.items?.map((item) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price / 100,
              available: item.available,
              modifiers: item.modifier_groups || [],
            })) || [],
        })) || [],
      lastUpdated: new Date(),
      source: "deliveroo",
    }
  }

  private transformAnalytics(data: any): any {
    return {
      totalOrders: data.total_orders || 0,
      totalRevenue: (data.total_revenue || 0) / 100,
      averageOrderValue: (data.average_order_value || 0) / 100,
      topItems: data.popular_items || [],
      ordersByDay: data.daily_orders || [],
      source: "deliveroo",
      period: {
        start: data.from,
        end: data.to,
      },
    }
  }
}
