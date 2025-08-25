import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export abstract class BaseTestProvider extends BaseIntegrationProvider {
  protected mockData: Map<DataType, any[]> = new Map()
  protected shouldFailAuth = false
  protected shouldFailRequests = false
  protected requestDelay = 0

  constructor(config: IntegrationConfig) {
    super(config)
    this.initializeMockData()
  }

  // Test configuration methods
  setAuthFailure(shouldFail: boolean): void {
    this.shouldFailAuth = shouldFail
  }

  setRequestFailure(shouldFail: boolean): void {
    this.shouldFailRequests = shouldFail
  }

  setRequestDelay(delayMs: number): void {
    this.requestDelay = delayMs
  }

  setMockData(dataType: DataType, data: any[]): void {
    this.mockData.set(dataType, data)
  }

  // Override authentication for testing
  async authenticate(): Promise<AuthResult> {
    if (this.shouldFailAuth) {
      return { success: false, error: "Mock authentication failure" }
    }

    this.accessToken = "mock-token-" + Date.now()
    return { success: true, token: this.accessToken }
  }

  // Override makeRequest for testing
  protected async makeRequest(
    method: string,
    endpoint: string,
    data?: any,
    headers?: Record<string, string>,
    baseUrl?: string,
  ): Promise<any> {
    if (this.requestDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.requestDelay))
    }

    if (this.shouldFailRequests) {
      throw new Error("Mock request failure")
    }

    // Return mock response based on endpoint
    return this.getMockResponse(method, endpoint, data)
  }

  protected abstract getMockResponse(method: string, endpoint: string, data?: any): any
  protected abstract initializeMockData(): void

  // Test utilities
  getRequestHistory(): Array<{ method: string; endpoint: string; data: any; timestamp: Date }> {
    return [] // Override in specific test providers if needed
  }

  resetMocks(): void {
    this.shouldFailAuth = false
    this.shouldFailRequests = false
    this.requestDelay = 0
    this.mockData.clear()
    this.initializeMockData()
  }
}
