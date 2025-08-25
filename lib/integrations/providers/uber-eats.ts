import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class UberEatsProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Uber Eats",
      type: "delivery",
      authType: "oauth2",
      baseUrl: "https://api.uber.com",
      regions: ["US", "CA", "EU", "AU", "IN", "BR"],
      dataTypes: ["orders", "menu", "analytics", "customers"],
      rateLimits: {
        requestsPerMinute: 500,
        requestsPerHour: 5000,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      const authUrl = `${this.config.baseUrl}/oauth/v2/token`

      const response = await this.makeRequest("POST", authUrl, {
        grant_type: "client_credentials",
        client_id: this.config.credentials.clientId,
        client_secret: this.config.credentials.clientSecret,
        scope: "eats.store eats.orders eats.report",
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
    const storeId = this.config.credentials.storeId
    const response = await this.makeRequest("GET", `/v1/eats/stores/${storeId}/orders`, {
      limit: 100,
      since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    })

    return this.transformOrders(response.orders || [])
  }

  private async fetchMenu(): Promise<any> {
    const storeId = this.config.credentials.storeId
    const response = await this.makeRequest("GET", `/v1/eats/stores/${storeId}/menus`)
    return this.transformMenu(response.menus?.[0] || {})
  }

  private async fetchAnalytics(): Promise<any> {
    const storeId = this.config.credentials.storeId
    const response = await this.makeRequest("GET", `/v1/eats/stores/${storeId}/reports`, {
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
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
      externalId: order.external_reference_id,
      status: order.current_state,
      customerName: order.eater?.first_name + " " + order.eater?.last_name,
      customerPhone: order.eater?.phone_number,
      items:
        order.cart?.items?.map((item) => ({
          name: item.title,
          quantity: item.quantity,
          price: item.price / 100,
          modifiers: item.customizations || [],
        })) || [],
      total: order.payment?.charges?.total / 100,
      tax: order.payment?.charges?.tax / 100,
      tip: order.payment?.charges?.tip / 100,
      deliveryFee: order.payment?.charges?.delivery_fee / 100,
      orderTime: new Date(order.placed_at),
      deliveryTime: order.estimated_ready_for_pickup_at ? new Date(order.estimated_ready_for_pickup_at) : null,
      source: "uber-eats",
    }))
  }

  private transformMenu(menu: any): any {
    return {
      categories:
        menu.categories?.map((category) => ({
          id: category.id,
          name: category.title,
          description: category.subtitle,
          items:
            category.items?.map((item) => ({
              id: item.id,
              name: item.title,
              description: item.description,
              price: item.price_info?.price / 100,
              available: !item.sold_out,
              modifiers: item.modifier_groups || [],
            })) || [],
        })) || [],
      lastUpdated: new Date(),
      source: "uber-eats",
    }
  }

  private transformAnalytics(data: any): any {
    return {
      totalOrders: data.total_orders || 0,
      totalRevenue: (data.gross_sales || 0) / 100,
      averageOrderValue: (data.average_order_value || 0) / 100,
      topItems: data.top_items || [],
      ordersByDay: data.daily_breakdown || [],
      source: "uber-eats",
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
          source: "uber-eats",
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
