import { performanceMonitor } from "./performance-monitor"
import { businessAnalytics } from "./business-analytics"
import { userAnalytics } from "./user-analytics"

interface DashboardData {
  timestamp: string
  performance: {
    responseTime: number
    errorRate: number
    throughput: number
    uptime: number
  }
  business: {
    revenue: number
    orders: number
    customers: number
    growthRate: number
  }
  user: {
    pageViews: number
    sessions: number
    bounceRate: number
    conversionRate: number
  }
  alerts: Array<{
    type: "performance" | "business" | "security"
    severity: "low" | "medium" | "high" | "critical"
    message: string
    timestamp: string
  }>
}

class AnalyticsDashboard {
  private dashboardHistory: DashboardData[] = []
  private alerts: DashboardData["alerts"] = []

  constructor() {
    this.startDashboardUpdates()
  }

  private startDashboardUpdates(): void {
    // Update dashboard every 5 minutes
    setInterval(
      () => {
        this.updateDashboard()
      },
      5 * 60 * 1000,
    )

    // Initial update
    setTimeout(() => this.updateDashboard(), 1000)
  }

  private updateDashboard(): void {
    const now = new Date().toISOString()

    // Collect performance metrics
    const perfStats = performanceMonitor.getPerformanceStats()
    const systemHealth = performanceMonitor.getSystemHealth(1)[0] // Last hour

    // Collect business metrics
    const businessKPIs = businessAnalytics.calculateKPIs(7) // Last 7 days
    const todaySales = businessAnalytics.getSalesMetrics(1)[0] // Today

    // Collect user metrics
    const trafficStats = userAnalytics.getTrafficStats()
    const conversionFunnel = userAnalytics.getConversionFunnel()
    const conversionRate = conversionFunnel[conversionFunnel.length - 1]?.conversionRate || 0

    const dashboardData: DashboardData = {
      timestamp: now,
      performance: {
        responseTime: perfStats.avgResponseTime,
        errorRate: perfStats.errorRate,
        throughput: perfStats.totalRequests,
        uptime: systemHealth?.uptime || 0,
      },
      business: {
        revenue: todaySales?.revenue || 0,
        orders: todaySales?.orders || 0,
        customers: todaySales?.customers || 0,
        growthRate: businessKPIs.growthRate,
      },
      user: {
        pageViews: trafficStats.totalPageViews,
        sessions: trafficStats.sessions,
        bounceRate: trafficStats.bounceRate,
        conversionRate,
      },
      alerts: [...this.alerts],
    }

    this.dashboardHistory.push(dashboardData)

    // Keep only last 24 hours of dashboard data
    const cutoff = Date.now() - 24 * 60 * 60 * 1000
    this.dashboardHistory = this.dashboardHistory.filter((d) => new Date(d.timestamp).getTime() > cutoff)

    // Check for alerts
    this.checkAlerts(dashboardData)

    console.log(
      `[v0] DASHBOARD: Updated - Revenue: $${dashboardData.business.revenue.toFixed(2)}, Sessions: ${dashboardData.user.sessions}`,
    )
  }

  private checkAlerts(data: DashboardData): void {
    const newAlerts: DashboardData["alerts"] = []

    // Performance alerts
    if (data.performance.responseTime > 2000) {
      newAlerts.push({
        type: "performance",
        severity: "high",
        message: `High response time: ${data.performance.responseTime.toFixed(0)}ms`,
        timestamp: data.timestamp,
      })
    }

    if (data.performance.errorRate > 0.05) {
      newAlerts.push({
        type: "performance",
        severity: "high",
        message: `High error rate: ${(data.performance.errorRate * 100).toFixed(1)}%`,
        timestamp: data.timestamp,
      })
    }

    // Business alerts
    if (data.business.growthRate < -0.2) {
      newAlerts.push({
        type: "business",
        severity: "medium",
        message: `Revenue declining: ${(data.business.growthRate * 100).toFixed(1)}%`,
        timestamp: data.timestamp,
      })
    }

    // User experience alerts
    if (data.user.bounceRate > 0.7) {
      newAlerts.push({
        type: "business",
        severity: "medium",
        message: `High bounce rate: ${(data.user.bounceRate * 100).toFixed(1)}%`,
        timestamp: data.timestamp,
      })
    }

    if (data.user.conversionRate < 0.02) {
      newAlerts.push({
        type: "business",
        severity: "medium",
        message: `Low conversion rate: ${(data.user.conversionRate * 100).toFixed(1)}%`,
        timestamp: data.timestamp,
      })
    }

    // Add new alerts
    this.alerts.push(...newAlerts)

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100)
    }

    if (newAlerts.length > 0) {
      console.warn(`[v0] ALERTS: ${newAlerts.length} new alerts generated`)
    }
  }

  // Public methods
  getCurrentDashboard(): DashboardData | null {
    return this.dashboardHistory[this.dashboardHistory.length - 1] || null
  }

  getDashboardHistory(hours = 24): DashboardData[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
    return this.dashboardHistory.filter((d) => d.timestamp >= cutoff)
  }

  getActiveAlerts(): DashboardData["alerts"] {
    // Return alerts from last 24 hours
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    return this.alerts.filter((a) => a.timestamp >= cutoff)
  }

  getSystemStatus(): {
    status: "healthy" | "warning" | "critical"
    uptime: number
    lastUpdate: string
    metrics: {
      performance: "good" | "warning" | "critical"
      business: "good" | "warning" | "critical"
      user: "good" | "warning" | "critical"
    }
  } {
    const current = this.getCurrentDashboard()
    if (!current) {
      return {
        status: "critical",
        uptime: 0,
        lastUpdate: "Never",
        metrics: { performance: "critical", business: "critical", user: "critical" },
      }
    }

    // Determine status based on metrics
    const perfStatus =
      current.performance.errorRate > 0.1 || current.performance.responseTime > 3000
        ? "critical"
        : current.performance.errorRate > 0.05 || current.performance.responseTime > 2000
          ? "warning"
          : "good"

    const businessStatus =
      current.business.growthRate < -0.3 ? "critical" : current.business.growthRate < -0.1 ? "warning" : "good"

    const userStatus =
      current.user.bounceRate > 0.8 || current.user.conversionRate < 0.01
        ? "critical"
        : current.user.bounceRate > 0.7 || current.user.conversionRate < 0.02
          ? "warning"
          : "good"

    const overallStatus =
      perfStatus === "critical" || businessStatus === "critical" || userStatus === "critical"
        ? "critical"
        : perfStatus === "warning" || businessStatus === "warning" || userStatus === "warning"
          ? "warning"
          : "healthy"

    return {
      status: overallStatus,
      uptime: current.performance.uptime,
      lastUpdate: current.timestamp,
      metrics: {
        performance: perfStatus,
        business: businessStatus,
        user: userStatus,
      },
    }
  }

  // Export data for reporting
  exportDashboardData(format: "json" | "csv" = "json", hours = 24): string {
    const data = this.getDashboardHistory(hours)

    if (format === "csv") {
      const headers = [
        "timestamp",
        "responseTime",
        "errorRate",
        "revenue",
        "orders",
        "pageViews",
        "sessions",
        "bounceRate",
        "conversionRate",
      ]

      const rows = data.map((d) => [
        d.timestamp,
        d.performance.responseTime.toString(),
        d.performance.errorRate.toString(),
        d.business.revenue.toString(),
        d.business.orders.toString(),
        d.user.pageViews.toString(),
        d.user.sessions.toString(),
        d.user.bounceRate.toString(),
        d.user.conversionRate.toString(),
      ])

      return [headers, ...rows].map((row) => row.join(",")).join("\n")
    }

    return JSON.stringify(data, null, 2)
  }
}

export const analyticsDashboard = new AnalyticsDashboard()

// Initialize all analytics systems
export function initializeAnalytics(): void {
  console.log("[v0] Initializing analytics systems...")

  // Start tracking some initial events
  setTimeout(() => {
    userAnalytics.trackPageView({
      sessionId: "session-1",
      page: "/dashboard",
      userAgent: "Mock User Agent",
    })

    businessAnalytics.recordSale({
      itemId: "item-1",
      itemName: "Butter Chicken Curry",
      category: "Main Course",
      price: 18.99,
      cost: 8.5,
      customerId: "customer-1",
      isNewCustomer: false,
    })
  }, 2000)

  console.log("[v0] Analytics systems initialized")
}
