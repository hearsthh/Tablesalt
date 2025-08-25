import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class TouchBistroPOSProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "TouchBistro POS",
      type: "pos",
      authType: "api_key",
      baseUrl: "https://cloud.touchbistro.com/api",
      regions: ["US", "CA"],
      dataTypes: ["orders", "menu", "customers", "analytics"],
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
        "/v1/restaurants",
        {},
        {
          Authorization: `Bearer ${this.config.credentials.apiKey}`,
        },
      )

      if (response.restaurants) {
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
      case "customers":
        return this.fetchCustomers()
      case "analytics":
        return this.fetchAnalytics()
      default:
        throw new Error(`Unsupported data type: ${dataType}`)
    }
  }

  private async fetchOrders(): Promise<any> {
    const restaurantId = this.config.credentials.restaurantId
    const response = await this.makeRequest(
      "GET",
      `/v1/restaurants/${restaurantId}/orders`,
      {
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
        limit: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformOrders(response.orders || [])
  }

  private async fetchMenu(): Promise<any> {
    const restaurantId = this.config.credentials.restaurantId
    const response = await this.makeRequest(
      "GET",
      `/v1/restaurants/${restaurantId}/menu`,
      {},
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformMenu(response.menu || {})
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

  private transformOrders(orders: any[]): any[] {
    return orders.map((order) => ({
      id: order.id,
      externalId: order.order_number,
      status: order.status,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
      items:
        order.items?.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          modifiers: item.modifiers || [],
        })) || [],
      total: order.total,
      tax: order.tax,
      tip: order.tip,
      orderTime: new Date(order.created_at),
      source: "touchbistro-pos",
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
              price: item.price,
              available: item.available,
              modifiers: item.modifier_groups || [],
            })) || [],
        })) || [],
      lastUpdated: new Date(),
      source: "touchbistro-pos",
    }
  }

  private transformCustomers(customers: any[]): any[] {
    return customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      totalOrders: customer.total_orders || 0,
      totalSpent: customer.total_spent || 0,
      lastOrderDate: customer.last_order_date ? new Date(customer.last_order_date) : null,
      source: "touchbistro-pos",
    }))
  }

  private transformAnalytics(data: any): any {
    return {
      totalOrders: data.total_orders || 0,
      totalRevenue: data.total_revenue || 0,
      averageOrderValue: data.average_order_value || 0,
      topItems: data.top_items || [],
      ordersByDay: data.orders_by_day || [],
      source: "touchbistro-pos",
      period: {
        start: data.start_date,
        end: data.end_date,
      },
    }
  }
}
