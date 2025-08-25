import { IntegrationTestUtils } from "./test-utilities"
import type { DataType } from "../types"

export interface TestSuite {
  name: string
  provider: string
  dataTypes: DataType[]
  expectedResults: Record<string, any>
  performanceThresholds: Record<string, number>
}

export class IntegrationTestRunner {
  private testSuites: TestSuite[] = []

  addTestSuite(suite: TestSuite): void {
    this.testSuites.push(suite)
  }

  async runAllTests(): Promise<{
    passed: number
    failed: number
    results: Array<{
      suite: string
      success: boolean
      results: Record<string, any>
      errors: string[]
      performance: Record<string, number>
    }>
  }> {
    const results = []
    let passed = 0
    let failed = 0

    for (const suite of this.testSuites) {
      console.log(`Running test suite: ${suite.name}`)

      try {
        const provider = IntegrationTestUtils.createMockProvider(suite.provider)
        const testResult = await IntegrationTestUtils.runIntegrationTest(provider, suite.dataTypes, {
          testAuth: true,
          testFailures: true,
          testPerformance: true,
        })

        // Validate results against expectations
        const validationErrors = this.validateResults(testResult.results, suite.expectedResults)
        const performanceErrors = this.validatePerformance(testResult.performance, suite.performanceThresholds)

        const allErrors = [...testResult.errors, ...validationErrors, ...performanceErrors]
        const success = allErrors.length === 0

        results.push({
          suite: suite.name,
          success,
          results: testResult.results,
          errors: allErrors,
          performance: testResult.performance,
        })

        if (success) {
          passed++
          console.log(`✅ ${suite.name} passed`)
        } else {
          failed++
          console.log(`❌ ${suite.name} failed:`, allErrors)
        }
      } catch (error) {
        failed++
        results.push({
          suite: suite.name,
          success: false,
          results: {},
          errors: [`Test suite execution failed: ${error.message}`],
          performance: {},
        })
        console.log(`❌ ${suite.name} failed with exception:`, error.message)
      }
    }

    return { passed, failed, results }
  }

  async runHealthChecks(): Promise<
    Array<{
      provider: string
      healthy: boolean
      responseTime: number
      error?: string
    }>
  > {
    const healthResults = []

    for (const suite of this.testSuites) {
      try {
        const provider = IntegrationTestUtils.createMockProvider(suite.provider)
        const healthCheck = await IntegrationTestUtils.runHealthCheck(provider)

        healthResults.push({
          provider: suite.provider,
          ...healthCheck,
        })
      } catch (error) {
        healthResults.push({
          provider: suite.provider,
          healthy: false,
          responseTime: 0,
          error: error.message,
        })
      }
    }

    return healthResults
  }

  private validateResults(actual: Record<string, any>, expected: Record<string, any>): string[] {
    const errors = []

    for (const [key, expectedValue] of Object.entries(expected)) {
      if (!(key in actual)) {
        errors.push(`Missing expected result: ${key}`)
        continue
      }

      const actualValue = actual[key]

      if (typeof expectedValue === "object" && expectedValue.minCount !== undefined) {
        if (!actualValue.count || actualValue.count < expectedValue.minCount) {
          errors.push(`${key} count ${actualValue.count} is less than expected minimum ${expectedValue.minCount}`)
        }
      }

      if (typeof expectedValue === "object" && expectedValue.requiredFields !== undefined) {
        if (!actualValue.sample) {
          errors.push(`${key} missing sample data`)
          continue
        }

        for (const field of expectedValue.requiredFields) {
          if (!(field in actualValue.sample)) {
            errors.push(`${key} sample missing required field: ${field}`)
          }
        }
      }
    }

    return errors
  }

  private validatePerformance(actual: Record<string, number>, thresholds: Record<string, number>): string[] {
    const errors = []

    for (const [metric, threshold] of Object.entries(thresholds)) {
      if (metric in actual && actual[metric] > threshold) {
        errors.push(`Performance threshold exceeded: ${metric} (${actual[metric]}ms > ${threshold}ms)`)
      }
    }

    return errors
  }
}

// Example test suites
export const defaultTestSuites: TestSuite[] = [
  {
    name: "Stripe Payment Integration",
    provider: "stripe",
    dataTypes: ["payments", "customers", "analytics"],
    expectedResults: {
      payments: { minCount: 1, requiredFields: ["id", "amount", "status", "customerEmail"] },
      customers: { minCount: 1, requiredFields: ["id", "name", "email"] },
      analytics: { requiredFields: ["totalPayments", "totalAmount", "successRate"] },
    },
    performanceThresholds: {
      auth: 1000,
      payments: 2000,
      customers: 2000,
      analytics: 1500,
    },
  },
  {
    name: "Square POS Integration",
    provider: "square",
    dataTypes: ["orders", "menu", "customers"],
    expectedResults: {
      orders: { minCount: 1, requiredFields: ["id", "status", "total", "items"] },
      menu: { requiredFields: ["categories"] },
      customers: { minCount: 1, requiredFields: ["id", "name", "email"] },
    },
    performanceThresholds: {
      auth: 1000,
      orders: 2000,
      menu: 1500,
      customers: 2000,
    },
  },
]
