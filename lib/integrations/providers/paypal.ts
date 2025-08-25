import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class PayPalProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "PayPal",
      type: "payment",
      authType: "oauth2",
      baseUrl: config.sandbox ? "https://api.sandbox.paypal.com" : "https://api.paypal.com",
      regions: ["US", "CA", "EU", "UK", "AU", "JP", "IN", "BR", "MX"],
      dataTypes: ["payments", "customers", "analytics", "subscriptions", "disputes"],
      rateLimits: {
        requestsPerMinute: 300,
        requestsPerHour: 3000,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      const authUrl = `${this.config.baseUrl}/v1/oauth2/token`

      const credentials = Buffer.from(
        `${this.config.credentials.clientId}:${this.config.credentials.clientSecret}`,
      ).toString("base64")

      const response = await this.makeRequest("POST", authUrl, "grant_type=client_credentials", {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
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
      case "payments":
        return this.fetchPayments()
      case "customers":
        return this.fetchCustomers()
      case "analytics":
        return this.fetchAnalytics()
      case "subscriptions":
        return this.fetchSubscriptions()
      case "disputes":
        return this.fetchDisputes()
      default:
        throw new Error(`Unsupported data type: ${dataType}`)
    }
  }

  private async fetchPayments(): Promise<any> {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = new Date().toISOString()

    const response = await this.makeRequest(
      "GET",
      "/v1/payments/payment",
      {
        count: 100,
        start_time: startDate,
        end_time: endDate,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformPayments(response.payments || [])
  }

  private async fetchCustomers(): Promise<any> {
    // PayPal doesn't have a direct customers API like Stripe
    // We'll extract customer info from payments
    const payments = await this.fetchPayments()
    return this.extractCustomersFromPayments(payments)
  }

  private async fetchAnalytics(): Promise<any> {
    const payments = await this.fetchPayments()
    return this.transformAnalytics(payments)
  }

  private async fetchSubscriptions(): Promise<any> {
    const response = await this.makeRequest(
      "GET",
      "/v1/billing/subscriptions",
      {
        plan_id: this.config.credentials.planId,
        start_time: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date().toISOString(),
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformSubscriptions(response.subscriptions || [])
  }

  private async fetchDisputes(): Promise<any> {
    const response = await this.makeRequest(
      "GET",
      "/v1/customer/disputes",
      {
        start_time: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date().toISOString(),
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformDisputes(response.items || [])
  }

  private transformPayments(payments: any[]): any[] {
    return payments.map((payment) => ({
      id: payment.id,
      externalId: payment.id,
      status: payment.state,
      amount: Number.parseFloat(payment.transactions?.[0]?.amount?.total) || 0,
      currency: payment.transactions?.[0]?.amount?.currency,
      customerName: payment.payer?.payer_info?.first_name + " " + payment.payer?.payer_info?.last_name,
      customerEmail: payment.payer?.payer_info?.email,
      paymentMethod: payment.payer?.payment_method,
      fee: Number.parseFloat(payment.transactions?.[0]?.related_resources?.[0]?.sale?.transaction_fee?.value) || 0,
      netAmount:
        (Number.parseFloat(payment.transactions?.[0]?.amount?.total) || 0) -
        (Number.parseFloat(payment.transactions?.[0]?.related_resources?.[0]?.sale?.transaction_fee?.value) || 0),
      createdAt: new Date(payment.create_time),
      source: "paypal",
    }))
  }

  private extractCustomersFromPayments(payments: any[]): any[] {
    const customerMap = new Map()

    payments.forEach((payment) => {
      const email = payment.customerEmail
      if (email && !customerMap.has(email)) {
        customerMap.set(email, {
          id: email, // PayPal doesn't have customer IDs like Stripe
          name: payment.customerName,
          email: payment.customerEmail,
          totalSpent: payment.amount,
          totalPayments: 1,
          lastPaymentDate: payment.createdAt,
          source: "paypal",
        })
      } else if (email) {
        const customer = customerMap.get(email)
        customer.totalSpent += payment.amount
        customer.totalPayments++
        if (payment.createdAt > customer.lastPaymentDate) {
          customer.lastPaymentDate = payment.createdAt
        }
      }
    })

    return Array.from(customerMap.values())
  }

  private transformAnalytics(payments: any[]): any {
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const totalFees = payments.reduce((sum, payment) => sum + payment.fee, 0)
    const successfulPayments = payments.filter((p) => p.status === "approved")

    return {
      totalPayments: payments.length,
      successfulPayments: successfulPayments.length,
      totalAmount,
      totalFees,
      netAmount: totalAmount - totalFees,
      averageTransactionValue: payments.length > 0 ? totalAmount / payments.length : 0,
      successRate: payments.length > 0 ? (successfulPayments.length / payments.length) * 100 : 0,
      paymentMethods: this.getPaymentMethodBreakdown(payments),
      source: "paypal",
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    }
  }

  private transformSubscriptions(subscriptions: any[]): any[] {
    return subscriptions.map((subscription) => ({
      id: subscription.id,
      customerId: subscription.subscriber?.email_address,
      customerName: subscription.subscriber?.name?.given_name + " " + subscription.subscriber?.name?.surname,
      customerEmail: subscription.subscriber?.email_address,
      status: subscription.status,
      amount: Number.parseFloat(subscription.billing_info?.last_payment?.amount?.value) || 0,
      currency: subscription.billing_info?.last_payment?.amount?.currency_code,
      interval: subscription.plan?.billing_cycles?.[0]?.frequency?.interval_unit,
      createdAt: new Date(subscription.create_time),
      source: "paypal",
    }))
  }

  private transformDisputes(disputes: any[]): any[] {
    return disputes.map((dispute) => ({
      id: dispute.dispute_id,
      transactionId: dispute.disputed_transactions?.[0]?.seller_transaction_id,
      amount: Number.parseFloat(dispute.dispute_amount?.value) || 0,
      currency: dispute.dispute_amount?.currency_code,
      reason: dispute.reason,
      status: dispute.status,
      createdAt: new Date(dispute.create_time),
      source: "paypal",
    }))
  }

  private getPaymentMethodBreakdown(payments: any[]): any {
    const breakdown = {}
    payments.forEach((payment) => {
      const method = payment.paymentMethod || "paypal"
      breakdown[method] = (breakdown[method] || 0) + 1
    })
    return breakdown
  }
}
