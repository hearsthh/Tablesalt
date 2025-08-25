import type { IntegrationConfig, DataType } from "../types"
import { MockStripeProvider } from "./mock-providers/mock-stripe"
import { MockSquareProvider } from "./mock-providers/mock-square"

export class IntegrationTestUtils {
  static createMockConfig(providerName: string): IntegrationConfig {
    const baseConfig = {
      name: `Mock ${providerName}`,
      type: "test" as const,
      authType: "api_key" as const,
      baseUrl: `https://mock-${providerName.toLowerCase()}.com`,
      regions: ["US"],
      dataTypes: ["orders", "customers"] as DataType[],
      rateLimits: { requestsPerMinute: 1000, requestsPerHour: 10000 },
      credentials: {
        apiKey: "mock-api-key",
        clientId: "mock-client-id",
        clientSecret: "mock-client-secret",
      },
    }

    return baseConfig
  }

  static createMockProvider(providerName: string) {
    const config = this.createMockConfig(providerName)

    switch (providerName.toLowerCase()) {
      case "stripe":
        return new MockStripeProvider(config)
      case "square":
        return new MockSquareProvider(config)
      default:
        throw new Error(`Mock provider not implemented for: ${providerName}`)
    }
  }

  static generateMockOrderData(count = 10): any[] {
    const orders = []
    for (let i = 0; i < count; i++) {
      orders.push({
        id: `order_${i}`,
        status: Math.random() > 0.1 ? "completed" : "pending",
        total: Math.floor(Math.random() * 10000) / 100, // $0.00 to $100.00
        items: [
          {
            name: `Item ${i}`,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: Math.floor(Math.random() * 2000) / 100,
          },
        ],
        orderTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        customerName: `Customer ${i}`,
        customerEmail: `customer${i}@example.com`,
      })
    }
    return orders
  }

  static generateMockCustomerData(count = 10): any[] {
    const customers = []
    for (let i = 0; i < count; i++) {
      customers.push({
        id: `customer_${i}`,
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        totalOrders: Math.floor(Math.random() * 50),
        totalSpent: Math.floor(Math.random() * 100000) / 100,
        lastOrderDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      })
    }
    return customers
  }

  static async runIntegrationTest(
    provider: any,
    dataTypes: DataType[],
    options: {
      testAuth?: boolean
      testFailures?: boolean
      testPerformance?: boolean
    } = {},
  ): Promise<{
    success: boolean
    results: Record<string, any>
    errors: string[]
    performance: Record<string, number>
  }> {
    const results: Record<string, any> = {}
    const errors: string[] = []
    const performance: Record<string, number> = {}

    try {
      // Test authentication
      if (options.testAuth !== false) {
        const startTime = Date.now()
        const authResult = await provider.authenticate()
        performance.auth = Date.now() - startTime

        if (!authResult.success) {
          errors.push(`Authentication failed: ${authResult.error}`)
          return { success: false, results, errors, performance }
        }
        results.auth = authResult
      }

      // Test data fetching for each data type
      for (const dataType of dataTypes) {
        try {
          const startTime = Date.now()
          const data = await provider.fetchData(dataType)
          performance[dataType] = Date.now() - startTime

          results[dataType] = {
            count: Array.isArray(data) ? data.length : 1,
            sample: Array.isArray(data) ? data[0] : data,
          }
        } catch (error) {
          errors.push(`Failed to fetch ${dataType}: ${error.message}`)
        }
      }

      // Test failure scenarios
      if (options.testFailures) {
        provider.setAuthFailure(true)
        const failedAuth = await provider.authenticate()
        if (failedAuth.success) {
          errors.push("Expected authentication to fail but it succeeded")
        }
        provider.setAuthFailure(false)

        provider.setRequestFailure(true)
        try {
          await provider.fetchData(dataTypes[0])
          errors.push("Expected request to fail but it succeeded")
        } catch (error) {
          // Expected failure
        }
        provider.setRequestFailure(false)
      }

      // Test performance
      if (options.testPerformance) {
        const iterations = 5
        const performanceResults = []

        for (let i = 0; i < iterations; i++) {
          const startTime = Date.now()
          await provider.fetchData(dataTypes[0])
          performanceResults.push(Date.now() - startTime)
        }

        performance.averageResponseTime = performanceResults.reduce((sum, time) => sum + time, 0) / iterations
        performance.maxResponseTime = Math.max(...performanceResults)
        performance.minResponseTime = Math.min(...performanceResults)
      }

      return {
        success: errors.length === 0,
        results,
        errors,
        performance,
      }
    } catch (error) {
      errors.push(`Test execution failed: ${error.message}`)
      return { success: false, results, errors, performance }
    }
  }

  static async runHealthCheck(provider: any): Promise<{
    healthy: boolean
    responseTime: number
    error?: string
  }> {
    const startTime = Date.now()

    try {
      const authResult = await provider.authenticate()
      const responseTime = Date.now() - startTime

      return {
        healthy: authResult.success,
        responseTime,
        error: authResult.success ? undefined : authResult.error,
      }
    } catch (error) {
      return {
        healthy: false,
        responseTime: Date.now() - startTime,
        error: error.message,
      }
    }
  }
}
