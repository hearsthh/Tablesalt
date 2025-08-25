import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class AdyenProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Adyen",
      type: "payment",
      authType: "api_key",
      baseUrl: config.sandbox ? "https://checkout-test.adyen.com" : "https://checkout-live.adyen.com",
      regions: ["EU", "US", "AU", "SG", "BR"],
      dataTypes: ["payments", "customers", "analytics", "disputes"],
      rateLimits: {
        requestsPerMinute: 500,
        requestsPerHour: 5000,
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
        "POST",
        "/v70/payments",
        {
          amount: { currency: "EUR", value: 0 },
          merchantAccount: this.config.credentials.merchantAccount,
          reference: "test-auth",
          paymentMethod: { type: "scheme" },
        },
        {
          "X-API-Key": this.config.credentials.apiKey,
          "Content-Type": "application/json",
        },
      )

      // Even if the payment fails, a valid response means auth is working
      if (response.resultCode || response.errorCode) {
        this.accessToken = this.config.credentials.apiKey
        return { success: true, token: this.config.credentials.apiKey }
      }

      return { success: false, error: "Invalid API key" }
    } catch (error) {
      // If we get a specific auth error, that's different from network errors
      if (error.message.includes("401") || error.message.includes("403")) {
        return { success: false, error: "Invalid API key" }
      }
      return { success: true, token: this.config.credentials.apiKey } // Assume auth is OK
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
      case "disputes":
        return this.fetchDisputes()
      default:
        throw new Error(`Unsupported data type: ${dataType}`)
    }
  }

  private async fetchPayments(): Promise<any> {
    // Adyen uses Management API for reporting
    const managementUrl = this.config.sandbox
      ? "https://management-test.adyen.com"
      : "https://management-live.adyen.com"

    const response = await this.makeRequest(
      "GET",
      `/v1/merchants/${this.config.credentials.merchantAccount}/transactions`,
      {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        to: new Date().toISOString().split("T")[0],
        limit: 100,
      },
      {
        "X-API-Key": this.accessToken,
      },
      managementUrl,
    )

    return this.transformPayments(response.data || [])
  }

  private async fetchCustomers(): Promise<any> {
    // Adyen doesn't have a direct customers API
    // We'll extract customer info from payments
    const payments = await this.fetchPayments()
    return this.extractCustomersFromPayments(payments)
  }

  private async fetchAnalytics(): Promise<any> {
    const payments = await this.fetchPayments()
    return this.transformAnalytics(payments)
  }

  private async fetchDisputes(): Promise<any> {
    const managementUrl = this.config.sandbox
      ? "https://management-test.adyen.com"
      : "https://management-live.adyen.com"

    const response = await this.makeRequest(
      "GET",
      `/v1/merchants/${this.config.credentials.merchantAccount}/disputes`,
      {
        from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        to: new Date().toISOString().split("T")[0],
      },
      {
        "X-API-Key": this.accessToken,
      },
      managementUrl,
    )

    return this.transformDisputes(response.data || [])
  }

  private transformPayments(payments: any[]): any[] {
    return payments.map((payment) => ({
      id: payment.pspReference,
      externalId: payment.merchantReference,
      status: payment.status,
      amount: payment.amount?.value / 100, // Convert minor units to major
      currency: payment.amount?.currency,
      customerName: payment.shopperName?.firstName + " " + payment.shopperName?.lastName,
      customerEmail: payment.shopperEmail,
      paymentMethod: payment.paymentMethod?.type,
      cardBrand: payment.paymentMethod?.brand,
      cardLast4: payment.paymentMethod?.lastFour,
      fee: payment.feeAmount?.value / 100 || 0,
      netAmount: (payment.amount?.value - (payment.feeAmount?.value || 0)) / 100,
      createdAt: new Date(payment.creationDate),
      source: "adyen",
    }))
  }

  private extractCustomersFromPayments(payments: any[]): any[] {
    const customerMap = new Map()

    payments.forEach((payment) => {
      const email = payment.customerEmail
      if (email && !customerMap.has(email)) {
        customerMap.set(email, {
          id: email,
          name: payment.customerName,
          email: payment.customerEmail,
          totalSpent: payment.amount,
          totalPayments: 1,
          lastPaymentDate: payment.createdAt,
          source: "adyen",
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
    const successfulPayments = payments.filter((p) => p.status === "Authorised" || p.status === "SentForSettle")

    return {
      totalPayments: payments.length,
      successfulPayments: successfulPayments.length,
      totalAmount,
      totalFees,
      netAmount: totalAmount - totalFees,
      averageTransactionValue: payments.length > 0 ? totalAmount / payments.length : 0,
      successRate: payments.length > 0 ? (successfulPayments.length / payments.length) * 100 : 0,
      paymentMethods: this.getPaymentMethodBreakdown(payments),
      source: "adyen",
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    }
  }

  private transformDisputes(disputes: any[]): any[] {
    return disputes.map((dispute) => ({
      id: dispute.disputePspReference,
      paymentId: dispute.originalPspReference,
      amount: dispute.disputeAmount?.value / 100,
      currency: dispute.disputeAmount?.currency,
      reason: dispute.reasonCode,
      status: dispute.status,
      createdAt: new Date(dispute.creationDate),
      source: "adyen",
    }))
  }

  private getPaymentMethodBreakdown(payments: any[]): any {
    const breakdown = {}
    payments.forEach((payment) => {
      const method = payment.paymentMethod || "unknown"
      breakdown[method] = (breakdown[method] || 0) + 1
    })
    return breakdown
  }
}
