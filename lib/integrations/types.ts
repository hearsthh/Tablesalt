export type IntegrationStatus = "connected" | "disconnected" | "error" | "pending"
export type DataType = "restaurant_info" | "menu" | "orders" | "customers" | "reviews" | "marketing" | "analytics"
export type AuthType = "oauth2" | "api_key" | "basic_auth" | "webhook"

export interface IntegrationCredentials {
  apiKey?: string
  clientId?: string
  clientSecret?: string
  accessToken?: string
  refreshToken?: string
  webhookUrl?: string
  [key: string]: any
}

export interface SyncResult {
  success: boolean
  recordsProcessed: number
  errors: string[]
  lastSyncAt: Date
}

export interface IntegrationProvider {
  id: string
  name: string
  category: "pos" | "reviews" | "delivery" | "marketing" | "social" | "payments" | "reservations"
  regions: string[]
  cities: string[]
  authType: AuthType
  apiVersion: string
  baseUrl: string
  rateLimit: {
    requests: number
    window: number // in seconds
  }

  // Core methods
  authenticate(credentials: IntegrationCredentials): Promise<boolean>
  fetchData(dataType: DataType, options?: any): Promise<any>
  syncData(dataTypes: DataType[]): Promise<SyncResult>
  disconnect(): Promise<boolean>

  // Health check
  isHealthy(): Promise<boolean>
  getStatus(): Promise<IntegrationStatus>
}

export interface IntegrationConfig {
  provider: IntegrationProvider
  credentials: IntegrationCredentials
  status: IntegrationStatus
  lastSyncAt?: Date
  syncFrequency: number // in minutes
  enabledDataTypes: DataType[]
  customSettings: Record<string, any>
}
