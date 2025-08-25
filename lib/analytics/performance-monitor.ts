interface PerformanceMetric {
  id: string
  timestamp: string
  type: "api_response" | "page_load" | "database_query" | "external_api" | "user_action"
  name: string
  duration: number
  success: boolean
  errorMessage?: string
  metadata?: Record<string, any>
}

interface SystemHealth {
  timestamp: string
  cpu: number
  memory: number
  disk: number
  activeConnections: number
  responseTime: number
  errorRate: number
  uptime: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private healthHistory: SystemHealth[] = []
  private maxMetrics = 50000 // Keep last 50k metrics
  private alertThresholds = {
    responseTime: 2000, // 2 seconds
    errorRate: 0.05, // 5%
    memoryUsage: 0.85, // 85%
    cpuUsage: 0.8, // 80%
  }

  constructor() {
    this.startHealthMonitoring()
  }

  // Record performance metric
  recordMetric(metric: Omit<PerformanceMetric, "id" | "timestamp">): void {
    const performanceMetric: PerformanceMetric = {
      ...metric,
      id: `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    this.metrics.push(performanceMetric)
    this.trimMetrics()

    // Check for performance issues
    this.checkPerformanceAlerts(performanceMetric)

    console.log(`[v0] PERF: ${metric.name} - ${metric.duration}ms (${metric.success ? "✓" : "✗"})`)
  }

  // Middleware for API performance tracking
  trackApiPerformance(apiName: string) {
    return (handler: (req: Request) => Promise<Response>) => {
      return async (req: Request): Promise<Response> => {
        const startTime = Date.now()
        let success = true
        let errorMessage: string | undefined

        try {
          const response = await handler(req)
          success = response.ok
          if (!success) {
            errorMessage = `HTTP ${response.status}`
          }
          return response
        } catch (error) {
          success = false
          errorMessage = error instanceof Error ? error.message : "Unknown error"
          throw error
        } finally {
          const duration = Date.now() - startTime
          this.recordMetric({
            type: "api_response",
            name: apiName,
            duration,
            success,
            errorMessage,
            metadata: {
              method: req.method,
              url: req.url,
            },
          })
        }
      }
    }
  }

  // Track database query performance
  trackDatabaseQuery<T>(queryName: string, queryFn: () => Promise<T>): Promise<T> {
    const startTime = Date.now()

    return queryFn()
      .then((result) => {
        const duration = Date.now() - startTime
        this.recordMetric({
          type: "database_query",
          name: queryName,
          duration,
          success: true,
        })
        return result
      })
      .catch((error) => {
        const duration = Date.now() - startTime
        this.recordMetric({
          type: "database_query",
          name: queryName,
          duration,
          success: false,
          errorMessage: error.message,
        })
        throw error
      })
  }

  // Track external API calls
  trackExternalApi<T>(apiName: string, apiFn: () => Promise<T>): Promise<T> {
    const startTime = Date.now()

    return apiFn()
      .then((result) => {
        const duration = Date.now() - startTime
        this.recordMetric({
          type: "external_api",
          name: apiName,
          duration,
          success: true,
        })
        return result
      })
      .catch((error) => {
        const duration = Date.now() - startTime
        this.recordMetric({
          type: "external_api",
          name: apiName,
          duration,
          success: false,
          errorMessage: error.message,
        })
        throw error
      })
  }

  // System health monitoring
  private startHealthMonitoring(): void {
    setInterval(() => {
      const health = this.collectSystemHealth()
      this.healthHistory.push(health)

      // Keep only last 24 hours of health data
      const cutoff = Date.now() - 24 * 60 * 60 * 1000
      this.healthHistory = this.healthHistory.filter((h) => new Date(h.timestamp).getTime() > cutoff)

      this.checkHealthAlerts(health)
    }, 60000) // Every minute
  }

  private collectSystemHealth(): SystemHealth {
    // Mock system health data - in production, use actual system metrics
    const now = Date.now()
    const recentMetrics = this.metrics.filter((m) => new Date(m.timestamp).getTime() > now - 5 * 60 * 1000) // Last 5 minutes

    const totalRequests = recentMetrics.length
    const failedRequests = recentMetrics.filter((m) => !m.success).length
    const avgResponseTime =
      totalRequests > 0 ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests : 0

    return {
      timestamp: new Date().toISOString(),
      cpu: Math.random() * 0.3 + 0.1, // 10-40% CPU usage
      memory: Math.random() * 0.4 + 0.3, // 30-70% memory usage
      disk: Math.random() * 0.2 + 0.4, // 40-60% disk usage
      activeConnections: Math.floor(Math.random() * 50) + 10, // 10-60 connections
      responseTime: avgResponseTime,
      errorRate: totalRequests > 0 ? failedRequests / totalRequests : 0,
      uptime: Math.floor(Math.random() * 1000000) + 500000, // Mock uptime in seconds
    }
  }

  private checkPerformanceAlerts(metric: PerformanceMetric): void {
    if (metric.duration > this.alertThresholds.responseTime) {
      console.warn(`[v0] ALERT: Slow response detected - ${metric.name}: ${metric.duration}ms`)
    }

    if (!metric.success) {
      console.warn(`[v0] ALERT: Failed request - ${metric.name}: ${metric.errorMessage}`)
    }
  }

  private checkHealthAlerts(health: SystemHealth): void {
    if (health.cpu > this.alertThresholds.cpuUsage) {
      console.warn(`[v0] ALERT: High CPU usage: ${(health.cpu * 100).toFixed(1)}%`)
    }

    if (health.memory > this.alertThresholds.memoryUsage) {
      console.warn(`[v0] ALERT: High memory usage: ${(health.memory * 100).toFixed(1)}%`)
    }

    if (health.errorRate > this.alertThresholds.errorRate) {
      console.warn(`[v0] ALERT: High error rate: ${(health.errorRate * 100).toFixed(1)}%`)
    }
  }

  private trimMetrics(): void {
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }
  }

  // Query methods
  getMetrics(filters?: {
    type?: string
    name?: string
    success?: boolean
    startTime?: string
    endTime?: string
    limit?: number
  }): PerformanceMetric[] {
    let filtered = [...this.metrics]

    if (filters) {
      if (filters.type) filtered = filtered.filter((m) => m.type === filters.type)
      if (filters.name) filtered = filtered.filter((m) => m.name.includes(filters.name!))
      if (filters.success !== undefined) filtered = filtered.filter((m) => m.success === filters.success)
      if (filters.startTime) filtered = filtered.filter((m) => m.timestamp >= filters.startTime!)
      if (filters.endTime) filtered = filtered.filter((m) => m.timestamp <= filters.endTime!)
    }

    const limit = filters?.limit || 1000
    return filtered.slice(-limit).reverse()
  }

  getSystemHealth(hours = 24): SystemHealth[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
    return this.healthHistory.filter((h) => h.timestamp >= cutoff)
  }

  getPerformanceStats(timeRange = 60 * 60 * 1000): {
    totalRequests: number
    successRate: number
    avgResponseTime: number
    p95ResponseTime: number
    errorRate: number
    slowestEndpoints: Array<{ name: string; avgTime: number; count: number }>
  } {
    const cutoff = new Date(Date.now() - timeRange).toISOString()
    const recentMetrics = this.metrics.filter((m) => m.timestamp >= cutoff)

    const totalRequests = recentMetrics.length
    const successfulRequests = recentMetrics.filter((m) => m.success).length
    const responseTimes = recentMetrics.map((m) => m.duration).sort((a, b) => a - b)

    // Calculate P95 response time
    const p95Index = Math.floor(responseTimes.length * 0.95)
    const p95ResponseTime = responseTimes[p95Index] || 0

    // Group by endpoint name for slowest endpoints
    const endpointStats = new Map<string, { totalTime: number; count: number }>()
    recentMetrics.forEach((metric) => {
      const existing = endpointStats.get(metric.name) || { totalTime: 0, count: 0 }
      endpointStats.set(metric.name, {
        totalTime: existing.totalTime + metric.duration,
        count: existing.count + 1,
      })
    })

    const slowestEndpoints = Array.from(endpointStats.entries())
      .map(([name, stats]) => ({
        name,
        avgTime: stats.totalTime / stats.count,
        count: stats.count,
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 10)

    return {
      totalRequests,
      successRate: totalRequests > 0 ? successfulRequests / totalRequests : 1,
      avgResponseTime: totalRequests > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / totalRequests : 0,
      p95ResponseTime,
      errorRate: totalRequests > 0 ? (totalRequests - successfulRequests) / totalRequests : 0,
      slowestEndpoints,
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()
