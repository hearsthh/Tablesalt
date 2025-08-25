import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class StripeProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Stripe",
      type: "payment",
      authType: "api_key",
      baseUrl: "https://api.stripe.com",
      regions: ["US", "CA", "EU", "UK", "AU", "JP", "SG", "IN", "BR", "MX"],
      dataTypes: ["payments", "customers", "analytics", "subscriptions", "disputes"],
      rateLimits: {
        requestsPerMinute: 1000,
        requestsPerHour: 10000,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      if (!this.config.credentials.secretKey) {
        return { success: false, error: "Secret key required" }
      }

      // Test the API key with a simple request
      const response = await this.makeRequest(
        "GET",
        "/v1/account",
        {},
        {
          Authorization: `Bearer ${this.config.credentials.secretKey}`,
        },
      )

      if (response.id) {
        this.accessToken = this.config.credentials.secretKey
        return { success: true, token: this.config.credentials.secretKey }
      }

      return { success: false, error: "Invalid secret key" }
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
    const response = await this.makeRequest(
      "GET",
      "/v1/charges",
      {
        limit: 100,
        created: {
          gte: Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000),
        },
        expand: ["data.customer", "data.payment_intent"],
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformPayments(response.data || [])
  }

  private async fetchCustomers(): Promise<any> {
    const response = await this.makeRequest(
      "GET",
      "/v1/customers",
      {
        limit: 100,
        created: {
          gte: Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000),
        },
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformCustomers(response.data || [])
  }

  private async fetchAnalytics(): Promise<any> {
    const payments = await this.fetchPayments()
    return this.transformAnalytics(payments)
  }

  private async fetchSubscriptions(): Promise<any> {
    const response = await this.makeRequest(
      "GET",
      "/v1/subscriptions",
      {
        limit: 100,
        status: "all",
        expand: ["data.customer"],
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformSubscriptions(response.data || [])
  }

  private async fetchDisputes(): Promise<any> {
    const response = await this.makeRequest(
      "GET",
      "/v1/disputes",
      {
        limit: 100,
        created: {
          gte: Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000),
        },
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
      },
    )

    return this.transformDisputes(response.data || [])
  }

  private transformPayments(payments: any[]): any[] {
    return payments.map((payment) => ({
      id: payment.id,
      externalId: payment.payment_intent?.id,
      status: payment.status,
      amount: payment.amount / 100, // Convert cents to dollars
      currency: payment.currency.toUpperCase(),
      customerName: payment.customer?.name || payment.billing_details?.name,
      customerEmail: payment.customer?.email || payment.billing_details?.email,
      paymentMethod: payment.payment_method_details?.type || "card",
      cardBrand: payment.payment_method_details?.card?.brand,
      cardLast4: payment.payment_method_details?.card?.last4,
      fee: payment.application_fee_amount ? payment.application_fee_amount / 100 : 0,
      netAmount: (payment.amount - (payment.application_fee_amount || 0)) / 100,
      refunded: payment.refunded,
      refundAmount: payment.amount_refunded / 100,
      createdAt: new Date(payment.created * 1000),
      source: "stripe",
    }))
  }

  private transformCustomers(customers: any[]): any[] {
    return customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      totalSpent: 0, // Would need to calculate from charges
      totalPayments: 0, // Would need to calculate from charges
      defaultPaymentMethod: customer.default_source || customer.invoice_settings?.default_payment_method,
      createdAt: new Date(customer.created * 1000),
      source: "stripe",
    }))
  }

  private transformAnalytics(payments: any[]): any {
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const totalFees = payments.reduce((sum, payment) => sum + payment.fee, 0)
    const totalRefunds = payments.reduce((sum, payment) => sum + payment.refundAmount, 0)
    const successfulPayments = payments.filter((p) => p.status === "succeeded")

    return {
      totalPayments: payments.length,
      successfulPayments: successfulPayments.length,
      totalAmount,
      totalFees,
      totalRefunds,
      netAmount: totalAmount - totalFees - totalRefunds,
      averageTransactionValue: payments.length > 0 ? totalAmount / payments.length : 0,
      successRate: payments.length > 0 ? (successfulPayments.length / payments.length) * 100 : 0,
      paymentMethods: this.getPaymentMethodBreakdown(payments),
      source: "stripe",
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    }
  }

  private transformSubscriptions(subscriptions: any[]): any[] {
    return subscriptions.map((subscription) => ({
      id: subscription.id,
      customerId: subscription.customer?.id,
      customerName: subscription.customer?.name,
      customerEmail: subscription.customer?.email,
      status: subscription.status,
      amount: subscription.items?.data?.[0]?.price?.unit_amount / 100,
      currency: subscription.currency?.toUpperCase(),
      interval: subscription.items?.data?.[0]?.price?.recurring?.interval,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      createdAt: new Date(subscription.created * 1000),
      source: "stripe",
    }))
  }

  private transformDisputes(disputes: any[]): any[] {
    return disputes.map((dispute) => ({
      id: dispute.id,
      chargeId: dispute.charge,
      amount: dispute.amount / 100,
      currency: dispute.currency.toUpperCase(),
      reason: dispute.reason,
      status: dispute.status,
      evidence: dispute.evidence,
      createdAt: new Date(dispute.created * 1000),
      source: "stripe",
    }))
  }

  private getPaymentMethodBreakdown(payments: any[]): any {
    const breakdown = {}
    payments.forEach((payment) => {
      const method = payment.paymentMethod
      breakdown[method] = (breakdown[method] || 0) + 1
    })
    return breakdown
  }
}
