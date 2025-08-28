export interface IntegrationCredentials {
  [key: string]: string
}

export interface IntegrationConfig {
  name: string
  type: string
  authType: "oauth2" | "api_key" | "basic_auth"
  requiredCredentials: string[]
  optionalCredentials?: string[]
  webhookSupport?: boolean
  rateLimits?: {
    requestsPerMinute: number
    requestsPerHour: number
  }
}

export interface IntegrationStatus {
  connected: boolean
  lastSync?: Date
  lastError?: string
  syncStatus: "idle" | "syncing" | "success" | "error"
}

export abstract class BaseIntegrationProvider {
  abstract name: string
  abstract type: string
  abstract authType: "oauth2" | "api_key" | "basic_auth"

  protected requiredCredentials: string[] = []
  protected optionalCredentials: string[] = []
  protected webhookSupport = false
  protected rateLimits?: {
    requestsPerMinute: number
    requestsPerHour: number
  }

  constructor() {
    // Initialize any common properties
  }

  /**
   * Authenticate with the integration provider
   */
  abstract authenticate(credentials: IntegrationCredentials): Promise<boolean>

  /**
   * Test the connection to the integration provider
   */
  async testConnection(credentials: IntegrationCredentials): Promise<boolean> {
    try {
      return await this.authenticate(credentials)
    } catch (error) {
      console.error(`Connection test failed for ${this.name}:`, error)
      return false
    }
  }

  /**
   * Validate that all required credentials are provided
   */
  validateCredentials(credentials: IntegrationCredentials): boolean {
    return this.requiredCredentials.every((key) => credentials[key] && credentials[key].trim() !== "")
  }

  /**
   * Get the configuration for this integration provider
   */
  getConfig(): IntegrationConfig {
    return {
      name: this.name,
      type: this.type,
      authType: this.authType,
      requiredCredentials: this.requiredCredentials,
      optionalCredentials: this.optionalCredentials,
      webhookSupport: this.webhookSupport,
      rateLimits: this.rateLimits,
    }
  }

  /**
   * Handle rate limiting
   */
  protected async handleRateLimit(requestCount: number): Promise<void> {
    if (!this.rateLimits) return

    // Simple rate limiting implementation
    if (requestCount > this.rateLimits.requestsPerMinute) {
      const delay = 60000 / this.rateLimits.requestsPerMinute
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  /**
   * Make an authenticated API request
   */
  protected async makeRequest(
    url: string,
    options: RequestInit,
    credentials: IntegrationCredentials,
  ): Promise<Response> {
    const headers = new Headers(options.headers)

    // Add authentication headers based on auth type
    switch (this.authType) {
      case "api_key":
        if (credentials.apiKey) {
          headers.set("Authorization", `Bearer ${credentials.apiKey}`)
        }
        break
      case "oauth2":
        if (credentials.accessToken) {
          headers.set("Authorization", `Bearer ${credentials.accessToken}`)
        }
        break
      case "basic_auth":
        if (credentials.username && credentials.password) {
          const auth = btoa(`${credentials.username}:${credentials.password}`)
          headers.set("Authorization", `Basic ${auth}`)
        }
        break
    }

    headers.set("Content-Type", "application/json")

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response
  }

  /**
   * Handle webhook verification (if supported)
   */
  verifyWebhook?(payload: string, signature: string, secret: string): boolean

  /**
   * Process webhook data (if supported)
   */
  processWebhook?(payload: any): Promise<void>

  /**
   * Sync data from the integration provider
   */
  syncData?(credentials: IntegrationCredentials, options?: any): Promise<any>

  /**
   * Get analytics data from the integration provider
   */
  getAnalytics?(credentials: IntegrationCredentials, options?: any): Promise<any>

  /**
   * Disconnect from the integration provider
   */
  async disconnect(credentials: IntegrationCredentials): Promise<boolean> {
    // Default implementation - can be overridden by specific providers
    return true
  }

  /**
   * Refresh authentication tokens (for OAuth2)
   */
  async refreshToken?(refreshToken: string): Promise<{
    accessToken: string
    refreshToken?: string
    expiresIn?: number
  }>
}

export default BaseIntegrationProvider
