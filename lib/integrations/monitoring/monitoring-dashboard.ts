import type { IntegrationHealth, IntegrationMetrics, Alert } from "./integration-monitor"

export interface DashboardData {
  overview: {
    totalIntegrations: number
    healthyIntegrations: number
    degradedIntegrations: number
    unhealthyIntegrations: number
    averageResponseTime: number
    totalActiveAlerts: number
  }
  integrationStatus: IntegrationHealth[]
  recentAlerts: Alert[]
  performanceMetrics: {
    providerId: string
    providerName: string
    metrics: {
      timestamp: Date
      responseTime: number
      errorRate: number
      uptime: number
    }[]
  }[]
}

export class MonitoringDashboard {
  generateDashboardData(
    healthStatus: IntegrationHealth[],
    alerts: Alert[],
    metricsData: Map<string, IntegrationMetrics[]>,
  ): DashboardData {
    const overview = this.generateOverview(healthStatus, alerts)
    const recentAlerts = alerts
      .filter((alert) => !alert.resolved)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)

    const performanceMetrics = this.generatePerformanceMetrics(healthStatus, metricsData)

    return {
      overview,
      integrationStatus: healthStatus,
      recentAlerts,
      performanceMetrics,
    }
  }

  private generateOverview(healthStatus: IntegrationHealth[], alerts: Alert[]) {
    const totalIntegrations = healthStatus.length
    const healthyIntegrations = healthStatus.filter((h) => h.status === "healthy").length
    const degradedIntegrations = healthStatus.filter((h) => h.status === "degraded").length
    const unhealthyIntegrations = healthStatus.filter((h) => h.status === "unhealthy").length

    const averageResponseTime =
      healthStatus.length > 0 ? healthStatus.reduce((sum, h) => sum + h.responseTime, 0) / healthStatus.length : 0

    const totalActiveAlerts = alerts.filter((alert) => !alert.resolved).length

    return {
      totalIntegrations,
      healthyIntegrations,
      degradedIntegrations,
      unhealthyIntegrations,
      averageResponseTime,
      totalActiveAlerts,
    }
  }

  private generatePerformanceMetrics(
    healthStatus: IntegrationHealth[],
    metricsData: Map<string, IntegrationMetrics[]>,
  ) {
    return healthStatus.map((health) => {
      const providerMetrics = metricsData.get(health.providerId) || []
      const last24Hours = providerMetrics.filter((m) => m.timestamp >= new Date(Date.now() - 24 * 60 * 60 * 1000))

      const metrics = last24Hours.map((m) => ({
        timestamp: m.timestamp,
        responseTime: m.averageResponseTime,
        errorRate: m.errorCount > 0 ? (m.errorCount / m.requestCount) * 100 : 0,
        uptime: m.requestCount > 0 ? ((m.requestCount - m.errorCount) / m.requestCount) * 100 : 100,
      }))

      return {
        providerId: health.providerId,
        providerName: health.providerName,
        metrics,
      }
    })
  }

  generateHealthStatusSummary(healthStatus: IntegrationHealth[]): {
    status: "healthy" | "degraded" | "unhealthy"
    message: string
    details: {
      healthy: number
      degraded: number
      unhealthy: number
      unknown: number
    }
  } {
    const details = {
      healthy: healthStatus.filter((h) => h.status === "healthy").length,
      degraded: healthStatus.filter((h) => h.status === "degraded").length,
      unhealthy: healthStatus.filter((h) => h.status === "unhealthy").length,
      unknown: healthStatus.filter((h) => h.status === "unknown").length,
    }

    let status: "healthy" | "degraded" | "unhealthy"
    let message: string

    if (details.unhealthy > 0) {
      status = "unhealthy"
      message = `${details.unhealthy} integration${details.unhealthy > 1 ? "s" : ""} unhealthy`
    } else if (details.degraded > 0) {
      status = "degraded"
      message = `${details.degraded} integration${details.degraded > 1 ? "s" : ""} degraded`
    } else {
      status = "healthy"
      message = "All integrations healthy"
    }

    return { status, message, details }
  }

  generateAlertSummary(alerts: Alert[]): {
    critical: number
    high: number
    medium: number
    low: number
    total: number
    recentTrend: "increasing" | "decreasing" | "stable"
  } {
    const activeAlerts = alerts.filter((alert) => !alert.resolved)

    const summary = {
      critical: activeAlerts.filter((a) => a.severity === "critical").length,
      high: activeAlerts.filter((a) => a.severity === "high").length,
      medium: activeAlerts.filter((a) => a.severity === "medium").length,
      low: activeAlerts.filter((a) => a.severity === "low").length,
      total: activeAlerts.length,
      recentTrend: "stable" as "increasing" | "decreasing" | "stable",
    }

    // Calculate trend based on alerts from last hour vs previous hour
    const now = new Date()
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000)
    const previousHour = new Date(now.getTime() - 2 * 60 * 60 * 1000)

    const recentAlerts = alerts.filter((a) => a.timestamp >= lastHour).length
    const previousAlerts = alerts.filter((a) => a.timestamp >= previousHour && a.timestamp < lastHour).length

    if (recentAlerts > previousAlerts) {
      summary.recentTrend = "increasing"
    } else if (recentAlerts < previousAlerts) {
      summary.recentTrend = "decreasing"
    }

    return summary
  }
}
