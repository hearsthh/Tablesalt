import type {
  IntegrationProvider,
  IntegrationCredentials,
  SyncResult,
  DataType,
  IntegrationStatus,
  AuthType,
} from "./types"

export abstract class BaseIntegrationProvider implements IntegrationProvider {
  abstract id: string
  abstract name: string
  abstract category: "pos" | "reviews" | "delivery" | "marketing" | "social" | "payments" | "reservations"
  abstract regions: string[]
  abstract cities: string[]
  abstract authType: AuthType
  abstract apiVersion: string
  abstract baseUrl: string
  abstract rateLimit: { requests: number; window: number }

  protected credentials?: IntegrationCredentials
  protected rateLimitTracker: Map<string, number[]> = new Map()

  // Rate limiting helper
  protected async checkRateLimit(): Promise<boolean> {
    const now = Date.now()
    const windowStart = now - this.rateLimit.window * 1000
    const requests = this.rateLimitTracker.get(this.id) || []

    // Remove old requests outside the window
    const recentRequests = requests.filter((time) => time > windowStart)

    if (recentRequests.length >= this.rateLimit.requests) {
      return false // Rate limit exceeded
    }

    // Add current request
    recentRequests.push(now)
    this.rateLimitTracker.set(this.id, recentRequests)
    return true
  }

  // HTTP helper with rate limiting
  protected async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    if (!(await this.checkRateLimit())) {
      throw new Error(`Rate limit exceeded for ${this.name}`)
    }

    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response
  }

  // Abstract methods that must be implemented by each provider
  abstract authenticate(credentials: IntegrationCredentials): Promise<boolean>
  abstract fetchData(dataType: DataType, options?: any): Promise<any>
  abstract getAuthHeaders(): Record<string, string>

  // Default implementations
  async syncData(dataTypes: DataType[]): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      recordsProcessed: 0,
      errors: [],
      lastSyncAt: new Date(),
    }

    for (const dataType of dataTypes) {
      try {
        const data = await this.fetchData(dataType)
        // Process and store data here
        result.recordsProcessed += Array.isArray(data) ? data.length : 1
      } catch (error) {
        result.success = false
        result.errors.push(`Failed to sync ${dataType}: ${error.message}`)
      }
    }

    return result
  }

  async disconnect(): Promise<boolean> {
    this.credentials = undefined
    return true
  }

  async isHealthy(): Promise<boolean> {
    try {
      // Make a simple health check request
      await this.makeRequest("/health", { method: "GET" })
      return true
    } catch {
      return false
    }
  }

  async getStatus(): Promise<IntegrationStatus> {
    if (!this.credentials) return "disconnected"
    if (await this.isHealthy()) return "connected"
    return "error"
  }
}
