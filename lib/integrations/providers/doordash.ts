import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class DoorDashProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "DoorDash",
      type: "delivery",
      authType: "oauth2",
      baseUrl: "https://openapi.doordash.com",
      regions: ["US", "CA", "AU"],
      dataTypes: ["orders", "menu", "analytics", "customers"],
      rateLimits: {
        requestsPerMinute: 1000,
        requestsPerHour: 10000,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      const authUrl = `${this.config.baseUrl}/developer/v1/auth/token`

      const response = await this.makeRequest("POST", authUrl, {
        grant_type: "client_credentials",
        client_id: this.config.credentials.clientId,
        client_secret: this.config.credentials.clientSecret,
        scope: "delivery:read menu:read analytics:read",
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
      case "orders":
        return this.fetchOrders()
      case "menu":
        return this.fetchMenu()
      case "analytics":
        return this.fetchAnalytics()
      case "customers":
        return this.fetchCustomers()
      default:
        throw new Error(`Unsupported data type: ${dataType}`)
    }
  }

  private async fetchOrders(): Promise<any> {
    const response = await this.makeRequest("GET", "/developer/v1/orders", {
      limit: 100,
      offset: 0,
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date().toISOString(),
    })

    return this.transformOrders(response.orders || [])
  }

  private async fetchMenu(): Promise<any> {
    const response = await this.makeRequest("GET", "/developer/v1/stores/menu")
    return this.transformMenu(response.menu || {})
  }

  private async fetchAnalytics(): Promise<any> {
    const response = await this.makeRequest("GET", "/developer/v1/analytics", {
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date().toISOString(),
    })

    return this.transformAnalytics(response)
  }

  private async fetchCustomers(): Promise<any> {
    const orders = await this.fetchOrders()
    return this.extractCustomersFromOrders(orders)
  }

  private transformOrders(orders: any[]): any[] {
    return orders.map((order) => ({
      id: order.id,
      externalId: order.external_delivery_id,
      status: order.order_status,
      customerName: order.delivery_address?.first_name + " " + order.delivery_address?.last_name,
      customerPhone: order.delivery_address?.phone_number,
      items:
        order.items?.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.unit_price / 100, // Convert cents to dollars
          modifiers: item.substitutions || [],
        })) || [],
      total: order.order_value / 100,
      tax: order.tax / 100,
      tip: order.tip / 100,
      deliveryFee: order.delivery_fee / 100,
      orderTime: new Date(order.created_at),
      deliveryTime: order.pickup_time ? new Date(order.pickup_time) : null,
      source: "doordash",
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
              available: item.is_available,
              modifiers: item.modifier_groups || [],
            })) || [],
        })) || [],
      lastUpdated: new Date(),
      source: "doordash",
    }
  }

  private transformAnalytics(data: any): any {
    return {
      totalOrders: data.total_orders || 0,
      totalRevenue: (data.total_revenue || 0) / 100,
      averageOrderValue: (data.average_order_value || 0) / 100,
      topItems: data.top_items || [],
      ordersByDay: data.orders_by_day || [],
      source: "doordash",
      period: {
        start: data.start_date,
        end: data.end_date,
      },
    }
  }

  private extractCustomersFromOrders(orders: any[]): any[] {
    const customerMap = new Map()

    orders.forEach((order) => {
      const key = order.customerPhone || order.customerName
      if (key && !customerMap.has(key)) {
        customerMap.set(key, {
          name: order.customerName,
          phone: order.customerPhone,
          totalOrders: 1,
          totalSpent: order.total,
          lastOrderDate: order.orderTime,
          source: "doordash",
        })
      } else if (key) {
        const customer = customerMap.get(key)
        customer.totalOrders++
        customer.totalSpent += order.total
        if (order.orderTime > customer.lastOrderDate) {
          customer.lastOrderDate = order.orderTime
        }
      }
    })

    return Array.from(customerMap.values())
  }
}
