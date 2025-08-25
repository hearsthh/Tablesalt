import type { IntegrationManager } from "../integration-manager"

export interface IntegrationHealth {
  providerId: string
  providerName: string
  status: "healthy" | "degraded" | "unhealthy" | "unknown"
  lastChecked: Date
  responseTime: number
  errorRate: number
  rateLimitUsage: number
  rateLimitRemaining: number
  lastError?: string
  uptime: number
  dataQuality: number
}

export interface IntegrationMetrics {
  providerId: string
  timestamp: Date
  requestCount: number
  errorCount: number
  averageResponseTime: number
  rateLimitHits: number
  dataPointsProcessed: number
  dataQualityScore: number
}

export interface AlertRule {
  id: string
  name: string
  condition: "error_rate" | "response_time" | "rate_limit" | "uptime" | "data_quality"
  threshold: number
  operator: ">" | "<" | ">=" | "<=" | "=="
  severity: "low" | "medium" | "high" | "critical"
  enabled: boolean
  cooldownMinutes: number
  lastTriggered?: Date
}

export interface Alert {
  id: string
  ruleId: string
  providerId: string
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: Date
  resolved: boolean
  resolvedAt?: Date
}

export class IntegrationMonitor {
  private healthStatus: Map<string, IntegrationHealth> = new Map()
  private metrics: Map<string, IntegrationMetrics[]> = new Map()
  private alertRules: Map<string, AlertRule> = new Map()
  private activeAlerts: Map<string, Alert> = new Map()
  private integrationManager: IntegrationManager
  private monitoringInterval?: NodeJS.Timeout
  private metricsRetentionDays = 30

  constructor(integrationManager: IntegrationManager) {
    this.integrationManager = integrationManager
    this.initializeDefaultAlertRules()
  }

  // Start monitoring all integrations
  startMonitoring(intervalMinutes = 5): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }

    this.monitoringInterval = setInterval(
      () => {
        this.runHealthChecks()
      },
      intervalMinutes * 60 * 1000,
    )

    // Run initial health check
    this.runHealthChecks()
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = undefined
    }
  }

  // Run health checks for all registered integrations
  async runHealthChecks(): Promise<void> {
    const providers = this.integrationManager.getRegisteredProviders()

    for (const providerId of providers) {
      try {
        await this.checkProviderHealth(providerId)
      } catch (error) {
        console.error(`Failed to check health for provider ${providerId}:`, error)
      }
    }

    // Clean up old metrics
    this.cleanupOldMetrics()

    // Check alert rules
    this.checkAlertRules()
  }

  // Check health of a specific provider
  async checkProviderHealth(providerId: string): Promise<IntegrationHealth> {
    const startTime = Date.now()
    let status: IntegrationHealth["status"] = "unknown"
    let errorRate = 0
    let lastError: string | undefined

    try {
      const provider = this.integrationManager.getProvider(providerId)
      if (!provider) {
        throw new Error("Provider not found")
      }

      // Test authentication
      const authResult = await provider.authenticate()
      const responseTime = Date.now() - startTime

      if (authResult.success) {
        status = responseTime < 2000 ? "healthy" : "degraded"
      } else {
        status = "unhealthy"
        lastError = authResult.error
        errorRate = 100
      }

      // Get rate limit info from provider
      const rateLimitInfo = this.getRateLimitInfo(provider)

      // Calculate uptime from historical data
      const uptime = this.calculateUptime(providerId)

      // Calculate data quality score
      const dataQuality = this.calculateDataQuality(providerId)

      const health: IntegrationHealth = {
        providerId,
        providerName: provider.config.name,
        status,
        lastChecked: new Date(),
        responseTime,
        errorRate,
        rateLimitUsage: rateLimitInfo.usage,
        rateLimitRemaining: rateLimitInfo.remaining,
        lastError,
        uptime,
        dataQuality,
      }

      this.healthStatus.set(providerId, health)

      // Record metrics
      this.recordMetrics(providerId, {
        providerId,
        timestamp: new Date(),
        requestCount: 1,
        errorCount: authResult.success ? 0 : 1,
        averageResponseTime: responseTime,
        rateLimitHits: rateLimitInfo.usage > 90 ? 1 : 0,
        dataPointsProcessed: 0,
        dataQualityScore: dataQuality,
      })

      return health
    } catch (error) {
      const health: IntegrationHealth = {
        providerId,
        providerName: providerId,
        status: "unhealthy",
        lastChecked: new Date(),
        responseTime: Date.now() - startTime,
        errorRate: 100,
        rateLimitUsage: 0,
        rateLimitRemaining: 100,
        lastError: error.message,
        uptime: this.calculateUptime(providerId),
        dataQuality: 0,
      }

      this.healthStatus.set(providerId, health)
      return health
    }
  }

  // Get current health status for all providers
  getHealthStatus(): IntegrationHealth[] {
    return Array.from(this.healthStatus.values())
  }

  // Get health status for a specific provider
  getProviderHealth(providerId: string): IntegrationHealth | undefined {
    return this.healthStatus.get(providerId)
  }

  // Get metrics for a provider within a time range
  getProviderMetrics(providerId: string, startDate: Date, endDate: Date): IntegrationMetrics[] {
    const providerMetrics = this.metrics.get(providerId) || []
    return providerMetrics.filter((metric) => metric.timestamp >= startDate && metric.timestamp <= endDate)
  }

  // Record metrics for a provider
  recordMetrics(providerId: string, metrics: IntegrationMetrics): void {
    if (!this.metrics.has(providerId)) {
      this.metrics.set(providerId, [])
    }

    const providerMetrics = this.metrics.get(providerId)!
    providerMetrics.push(metrics)

    // Keep only recent metrics
    const cutoffDate = new Date(Date.now() - this.metricsRetentionDays * 24 * 60 * 60 * 1000)
    const filteredMetrics = providerMetrics.filter((m) => m.timestamp >= cutoffDate)
    this.metrics.set(providerId, filteredMetrics)
  }

  // Alert rule management
  addAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, rule)
  }

  removeAlertRule(ruleId: string): void {
    this.alertRules.delete(ruleId)
  }

  getAlertRules(): AlertRule[] {
    return Array.from(this.alertRules.values())
  }

  // Get active alerts
  getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values()).filter((alert) => !alert.resolved)
  }

  // Get all alerts (including resolved)
  getAllAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values())
  }

  // Resolve an alert
  resolveAlert(alertId: string): void {
    const alert = this.activeAlerts.get(alertId)
    if (alert) {
      alert.resolved = true
      alert.resolvedAt = new Date()
    }
  }

  // Private helper methods
  private initializeDefaultAlertRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: "high-error-rate",
        name: "High Error Rate",
        condition: "error_rate",
        threshold: 10,
        operator: ">",
        severity: "high",
        enabled: true,
        cooldownMinutes: 15,
      },
      {
        id: "slow-response-time",
        name: "Slow Response Time",
        condition: "response_time",
        threshold: 5000,
        operator: ">",
        severity: "medium",
        enabled: true,
        cooldownMinutes: 10,
      },
      {
        id: "rate-limit-exceeded",
        name: "Rate Limit Exceeded",
        condition: "rate_limit",
        threshold: 90,
        operator: ">",
        severity: "medium",
        enabled: true,
        cooldownMinutes: 30,
      },
      {
        id: "low-uptime",
        name: "Low Uptime",
        condition: "uptime",
        threshold: 95,
        operator: "<",
        severity: "high",
        enabled: true,
        cooldownMinutes: 60,
      },
      {
        id: "poor-data-quality",
        name: "Poor Data Quality",
        condition: "data_quality",
        threshold: 80,
        operator: "<",
        severity: "medium",
        enabled: true,
        cooldownMinutes: 30,
      },
    ]

    defaultRules.forEach((rule) => this.addAlertRule(rule))
  }

  private getRateLimitInfo(provider: any): { usage: number; remaining: number } {
    // This would be implemented based on the provider's rate limit tracking
    // For now, return mock data
    return {
      usage: Math.floor(Math.random() * 100),
      remaining: Math.floor(Math.random() * 100),
    }
  }

  private calculateUptime(providerId: string): number {
    const providerMetrics = this.metrics.get(providerId) || []
    if (providerMetrics.length === 0) return 100

    const last24Hours = providerMetrics.filter((m) => m.timestamp >= new Date(Date.now() - 24 * 60 * 60 * 1000))

    if (last24Hours.length === 0) return 100

    const successfulRequests = last24Hours.reduce((sum, m) => sum + (m.requestCount - m.errorCount), 0)
    const totalRequests = last24Hours.reduce((sum, m) => sum + m.requestCount, 0)

    return totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100
  }

  private calculateDataQuality(providerId: string): number {
    const providerMetrics = this.metrics.get(providerId) || []
    if (providerMetrics.length === 0) return 100

    const recentMetrics = providerMetrics.slice(-10) // Last 10 data points
    const avgQuality = recentMetrics.reduce((sum, m) => sum + m.dataQualityScore, 0) / recentMetrics.length

    return avgQuality || 100
  }

  private cleanupOldMetrics(): void {
    const cutoffDate = new Date(Date.now() - this.metricsRetentionDays * 24 * 60 * 60 * 1000)

    for (const [providerId, metrics] of this.metrics.entries()) {
      const filteredMetrics = metrics.filter((m) => m.timestamp >= cutoffDate)
      this.metrics.set(providerId, filteredMetrics)
    }
  }

  private checkAlertRules(): void {
    for (const rule of this.alertRules.values()) {
      if (!rule.enabled) continue

      // Check cooldown
      if (rule.lastTriggered) {
        const cooldownEnd = new Date(rule.lastTriggered.getTime() + rule.cooldownMinutes * 60 * 1000)
        if (new Date() < cooldownEnd) continue
      }

      // Check each provider against this rule
      for (const health of this.healthStatus.values()) {
        if (this.shouldTriggerAlert(rule, health)) {
          this.triggerAlert(rule, health)
        }
      }
    }
  }

  private shouldTriggerAlert(rule: AlertRule, health: IntegrationHealth): boolean {
    let value: number

    switch (rule.condition) {
      case "error_rate":
        value = health.errorRate
        break
      case "response_time":
        value = health.responseTime
        break
      case "rate_limit":
        value = health.rateLimitUsage
        break
      case "uptime":
        value = health.uptime
        break
      case "data_quality":
        value = health.dataQuality
        break
      default:
        return false
    }

    switch (rule.operator) {
      case ">":
        return value > rule.threshold
      case "<":
        return value < rule.threshold
      case ">=":
        return value >= rule.threshold
      case "<=":
        return value <= rule.threshold
      case "==":
        return value === rule.threshold
      default:
        return false
    }
  }

  private triggerAlert(rule: AlertRule, health: IntegrationHealth): void {
    const alertId = `${rule.id}-${health.providerId}-${Date.now()}`

    const alert: Alert = {
      id: alertId,
      ruleId: rule.id,
      providerId: health.providerId,
      severity: rule.severity,
      message: this.generateAlertMessage(rule, health),
      timestamp: new Date(),
      resolved: false,
    }

    this.activeAlerts.set(alertId, alert)
    rule.lastTriggered = new Date()

    // Here you would typically send notifications (email, Slack, etc.)
    console.warn(`🚨 Alert triggered: ${alert.message}`)
  }

  private generateAlertMessage(rule: AlertRule, health: IntegrationHealth): string {
    const value = this.getHealthValue(rule.condition, health)
    return `${rule.name} for ${health.providerName}: ${rule.condition} is ${value} (threshold: ${rule.threshold})`
  }

  private getHealthValue(condition: string, health: IntegrationHealth): number {
    switch (condition) {
      case "error_rate":
        return health.errorRate
      case "response_time":
        return health.responseTime
      case "rate_limit":
        return health.rateLimitUsage
      case "uptime":
        return health.uptime
      case "data_quality":
        return health.dataQuality
      default:
        return 0
    }
  }
}
