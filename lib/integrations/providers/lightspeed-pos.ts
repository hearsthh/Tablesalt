import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class LightspeedPOSProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Lightspeed POS",
      type: "pos",
      authType: "oauth2",
      baseUrl: "https://api.lightspeedhq.com",
      regions: ["US", "CA", "EU", "AU"],
      dataTypes: ["orders", "menu", "customers", "analytics", "payments"],
      rateLimits: {
        requestsPerMinute: 180,
        requestsPerHour: 3600,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      const authUrl = `${this.config.baseUrl}/oauth/access_token.php`

      const response = await this.makeRequest("POST", authUrl, {
        client_id: this.config.credentials.clientId,
        client_secret: this.config.credentials.clientSecret,
        code: this.config.credentials.authCode,
        grant_type: "authorization_code",
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
    const accountId = this.config.credentials.accountId
    const response = await this.makeRequest(
      "GET",
      `/API/Account/${accountId}/Sale.json`,
      {
        limit: 100,
        timeStamp: `>${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`,
        load_relations: '["SaleLines", "Customer"]',
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformOrders(response.Sale || [])
  }

  private async fetchMenu(): Promise<any> {
    const accountId = this.config.credentials.accountId
    const response = await this.makeRequest(
      "GET",
      `/API/Account/${accountId}/Category.json`,
      {
        load_relations: '["Items"]',
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformMenu(response.Category || [])
  }

  private async fetchCustomers(): Promise<any> {
    const accountId = this.config.credentials.accountId
    const response = await this.makeRequest(
      "GET",
      `/API/Account/${accountId}/Customer.json`,
      {
        limit: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformCustomers(response.Customer || [])
  }

  private async fetchAnalytics(): Promise<any> {
    const orders = await this.fetchOrders()
    return this.transformAnalytics(orders)
  }

  private async fetchPayments(): Promise<any> {
    const accountId = this.config.credentials.accountId
    const response = await this.makeRequest(
      "GET",
      `/API/Account/${accountId}/SalePayment.json`,
      {
        limit: 100,
        timeStamp: `>${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformPayments(response.SalePayment || [])
  }

  private transformOrders(orders: any[]): any[] {
    return orders.map((order) => ({
      id: order.saleID,
      externalId: order.ticketNumber,
      status: order.completed === "true" ? "completed" : "pending",
      customerName: order.Customer ? `${order.Customer.firstName} ${order.Customer.lastName}` : "",
      customerPhone: order.Customer?.Contact?.Phones?.ContactPhone?.[0]?.number,
      customerEmail: order.Customer?.Contact?.Emails?.ContactEmail?.[0]?.address,
      items:
        order.SaleLines?.SaleLine?.map((line) => ({
          name: line.Item?.description || "",
          quantity: Number.parseInt(line.unitQuantity) || 1,
          price: Number.parseFloat(line.unitPrice) || 0,
          modifiers: [],
        })) || [],
      total: Number.parseFloat(order.total) || 0,
      tax: Number.parseFloat(order.tax) || 0,
      tip: 0, // Lightspeed doesn't separate tips in basic API
      orderTime: new Date(order.timeStamp),
      source: "lightspeed-pos",
    }))
  }

  private transformMenu(categories: any[]): any {
    return {
      categories: categories.map((category) => ({
        id: category.categoryID,
        name: category.name,
        description: "",
        items:
          category.Items?.Item?.map((item) => ({
            id: item.itemID,
            name: item.description,
            description: item.longDescription || "",
            price: Number.parseFloat(item.Prices?.ItemPrice?.[0]?.amount) || 0,
            available: item.archived === "false",
            modifiers: [],
          })) || [],
      })),
      lastUpdated: new Date(),
      source: "lightspeed-pos",
    }
  }

  private transformCustomers(customers: any[]): any[] {
    return customers.map((customer) => ({
      id: customer.customerID,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.Contact?.Emails?.ContactEmail?.[0]?.address,
      phone: customer.Contact?.Phones?.ContactPhone?.[0]?.number,
      totalOrders: 0, // Would need additional API calls
      totalSpent: 0, // Would need additional API calls
      lastOrderDate: null,
      source: "lightspeed-pos",
    }))
  }

  private transformAnalytics(orders: any[]): any {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      topItems: [], // Would need additional processing
      ordersByDay: [], // Would need additional processing
      source: "lightspeed-pos",
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    }
  }

  private transformPayments(payments: any[]): any[] {
    return payments.map((payment) => ({
      id: payment.salePaymentID,
      amount: Number.parseFloat(payment.amount) || 0,
      tax: 0, // Not directly available
      tip: 0, // Not directly available
      paymentMethod: payment.PaymentType?.name || "unknown",
      timestamp: new Date(payment.timeStamp),
      source: "lightspeed-pos",
    }))
  }
}
