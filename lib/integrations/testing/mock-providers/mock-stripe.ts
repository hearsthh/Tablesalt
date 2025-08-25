import { BaseTestProvider } from "../base-test-provider"
import type { IntegrationConfig, DataType } from "../../types"

export class MockStripeProvider extends BaseTestProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Mock Stripe",
      type: "payment",
      authType: "api_key",
      baseUrl: "https://mock-api.stripe.com",
      regions: ["US", "EU", "Global"],
      dataTypes: ["payments", "customers", "analytics"],
      rateLimits: { requestsPerMinute: 1000, requestsPerHour: 10000 },
    })
  }

  protected initializeMockData(): void {
    this.mockData.set("payments", [
      {
        id: "ch_mock_1",
        amount: 2500,
        currency: "usd",
        status: "succeeded",
        customer: { name: "John Doe", email: "john@example.com" },
        payment_method_details: { type: "card", card: { brand: "visa", last4: "4242" } },
        created: Math.floor(Date.now() / 1000) - 86400,
      },
      {
        id: "ch_mock_2",
        amount: 1800,
        currency: "usd",
        status: "succeeded",
        customer: { name: "Jane Smith", email: "jane@example.com" },
        payment_method_details: { type: "card", card: { brand: "mastercard", last4: "5555" } },
        created: Math.floor(Date.now() / 1000) - 172800,
      },
    ])

    this.mockData.set("customers", [
      {
        id: "cus_mock_1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        created: Math.floor(Date.now() / 1000) - 2592000,
      },
      {
        id: "cus_mock_2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1987654321",
        created: Math.floor(Date.now() / 1000) - 1296000,
      },
    ])
  }

  protected getMockResponse(method: string, endpoint: string, data?: any): any {
    if (endpoint.includes("/charges")) {
      return { data: this.mockData.get("payments") || [] }
    }

    if (endpoint.includes("/customers")) {
      return { data: this.mockData.get("customers") || [] }
    }

    if (endpoint.includes("/account")) {
      return { id: "acct_mock_123", business_profile: { name: "Mock Restaurant" } }
    }

    return { data: [] }
  }

  async fetchData(dataType: DataType): Promise<any> {
    await this.ensureAuthenticated()

    switch (dataType) {
      case "payments":
        return this.transformPayments(this.mockData.get("payments") || [])
      case "customers":
        return this.transformCustomers(this.mockData.get("customers") || [])
      case "analytics":
        return this.transformAnalytics(this.mockData.get("payments") || [])
      default:
        throw new Error(`Unsupported data type: ${dataType}`)
    }
  }

  private transformPayments(payments: any[]): any[] {
    return payments.map((payment) => ({
      id: payment.id,
      status: payment.status,
      amount: payment.amount / 100,
      currency: payment.currency.toUpperCase(),
      customerName: payment.customer?.name,
      customerEmail: payment.customer?.email,
      paymentMethod: payment.payment_method_details?.type,
      cardBrand: payment.payment_method_details?.card?.brand,
      cardLast4: payment.payment_method_details?.card?.last4,
      createdAt: new Date(payment.created * 1000),
      source: "mock-stripe",
    }))
  }

  private transformCustomers(customers: any[]): any[] {
    return customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      createdAt: new Date(customer.created * 1000),
      source: "mock-stripe",
    }))
  }

  private transformAnalytics(payments: any[]): any {
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount / 100, 0)
    const successfulPayments = payments.filter((p) => p.status === "succeeded")

    return {
      totalPayments: payments.length,
      successfulPayments: successfulPayments.length,
      totalAmount,
      averageTransactionValue: payments.length > 0 ? totalAmount / payments.length : 0,
      successRate: payments.length > 0 ? (successfulPayments.length / payments.length) * 100 : 0,
      source: "mock-stripe",
    }
  }
}
