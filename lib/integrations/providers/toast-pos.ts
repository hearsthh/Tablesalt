import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class ToastPOSProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Toast POS",
      type: "pos",
      authType: "oauth2",
      baseUrl: "https://ws-api.toasttab.com",
      regions: ["US", "CA"],
      dataTypes: ["orders", "menu", "customers", "analytics", "payments"],
      rateLimits: {
        requestsPerMinute: 1000,
        requestsPerHour: 10000,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      const authUrl = `${this.config.baseUrl}/authentication/v1/authentication/login`

      const response = await this.makeRequest("POST", authUrl, {
        clientId: this.config.credentials.clientId,
        clientSecret: this.config.credentials.clientSecret,
        userAccessToken: this.config.credentials.userAccessToken,
      })

      if (response.token) {
        this.accessToken = response.token.accessToken
        this.tokenExpiry = new Date(Date.now() + response.token.expiresIn * 1000)
        return { success: true, token: response.token.accessToken }
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
    const restaurantGuid = this.config.credentials.restaurantGuid
    const response = await this.makeRequest(
      "GET",
      `/orders/v2/orders`,
      {
        restaurantGuid,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        pageSize: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformOrders(response || [])
  }

  private async fetchMenu(): Promise<any> {
    const restaurantGuid = this.config.credentials.restaurantGuid
    const response = await this.makeRequest(
      "GET",
      `/config/v2/restaurants/${restaurantGuid}/menus`,
      {},
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformMenu(response?.[0] || {})
  }

  private async fetchCustomers(): Promise<any> {
    const restaurantGuid = this.config.credentials.restaurantGuid
    const response = await this.makeRequest(
      "GET",
      `/customers/v1/customers`,
      {
        restaurantGuid,
        pageSize: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformCustomers(response || [])
  }

  private async fetchAnalytics(): Promise<any> {
    const restaurantGuid = this.config.credentials.restaurantGuid
    const response = await this.makeRequest(
      "GET",
      `/reporting/v1/reports`,
      {
        restaurantGuid,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformAnalytics(response)
  }

  private async fetchPayments(): Promise<any> {
    const orders = await this.fetchOrders()
    return this.extractPaymentsFromOrders(orders)
  }

  private transformOrders(orders: any[]): any[] {
    return orders.map((order) => ({
      id: order.guid,
      externalId: order.externalId,
      status: order.orderStatus,
      customerName: order.customer?.firstName + " " + order.customer?.lastName,
      customerPhone: order.customer?.phone,
      customerEmail: order.customer?.email,
      items:
        order.selections?.map((item) => ({
          name: item.item?.name,
          quantity: item.quantity,
          price: item.price / 100,
          modifiers: item.modifiers || [],
        })) || [],
      total: order.totalAmount / 100,
      tax: order.taxAmount / 100,
      tip: order.tipAmount / 100,
      orderTime: new Date(order.openedDate),
      closedTime: order.closedDate ? new Date(order.closedDate) : null,
      source: "toast-pos",
    }))
  }

  private transformMenu(menu: any): any {
    return {
      categories:
        menu.menuGroups?.map((group) => ({
          id: group.guid,
          name: group.name,
          description: group.description,
          items:
            group.menuItems?.map((item) => ({
              id: item.guid,
              name: item.name,
              description: item.description,
              price: item.price / 100,
              available: !item.deactivated,
              modifiers: item.modifierGroups || [],
            })) || [],
        })) || [],
      lastUpdated: new Date(),
      source: "toast-pos",
    }
  }

  private transformCustomers(customers: any[]): any[] {
    return customers.map((customer) => ({
      id: customer.guid,
      name: customer.firstName + " " + customer.lastName,
      email: customer.email,
      phone: customer.phone,
      totalOrders: customer.orderCount || 0,
      totalSpent: (customer.totalSpent || 0) / 100,
      lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate) : null,
      source: "toast-pos",
    }))
  }

  private transformAnalytics(data: any): any {
    return {
      totalOrders: data.orderCount || 0,
      totalRevenue: (data.netSales || 0) / 100,
      averageOrderValue: (data.averageCheck || 0) / 100,
      topItems: data.topItems || [],
      ordersByDay: data.dailyBreakdown || [],
      source: "toast-pos",
      period: {
        start: data.startDate,
        end: data.endDate,
      },
    }
  }

  private extractPaymentsFromOrders(orders: any[]): any[] {
    return orders.map((order) => ({
      id: order.id,
      amount: order.total,
      tax: order.tax,
      tip: order.tip,
      paymentMethod: "card", // Toast typically processes card payments
      timestamp: order.orderTime,
      source: "toast-pos",
    }))
  }
}
