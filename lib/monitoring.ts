// Production monitoring and error handling utilities

export class ProductionMonitor {
  static logError(error: Error, context?: Record<string, any>) {
    if (process.env.NODE_ENV === "production") {
      // Send to Sentry if configured
      if (process.env.SENTRY_DSN && typeof window !== "undefined") {
        // Client-side Sentry reporting
        console.error("Production Error (Sentry):", {
          message: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        })
      } else {
        // Fallback error logging
        console.error("Production Error:", {
          message: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString(),
          url: typeof window !== "undefined" ? window.location.href : "server",
        })
      }
    } else {
      console.error("Development Error:", error, context)
    }
  }

  static logPerformance(metric: string, value: number, context?: Record<string, any>) {
    if (process.env.NODE_ENV === "production") {
      // Send to analytics service
      const performanceData = {
        metric,
        value,
        context,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
        url: typeof window !== "undefined" ? window.location.href : "server",
      }

      console.log("Performance Metric:", performanceData)

      // Send to external monitoring if configured
      if (process.env.VERCEL_ANALYTICS_ID) {
        // Vercel Analytics integration
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "performance_metric",
            properties: performanceData,
          }),
        }).catch(console.error)
      }
    }
  }

  static async healthCheck(): Promise<{ status: "healthy" | "unhealthy"; checks: Record<string, boolean> }> {
    const checks = {
      database: await this.checkDatabase(),
      storage: await this.checkStorage(),
      ai: await this.checkAI(),
    }

    const status = Object.values(checks).every(Boolean) ? "healthy" : "unhealthy"

    return { status, checks }
  }

  private static async checkDatabase(): Promise<boolean> {
    try {
      // Simple database connectivity check
      const response = await fetch("/api/health/database")
      return response.ok
    } catch {
      return false
    }
  }

  private static async checkStorage(): Promise<boolean> {
    try {
      // Simple storage connectivity check
      const response = await fetch("/api/health/storage")
      return response.ok
    } catch {
      return false
    }
  }

  private static async checkAI(): Promise<boolean> {
    try {
      // Simple AI service connectivity check
      const response = await fetch("/api/health/ai")
      return response.ok
    } catch {
      return false
    }
  }
}

// Health check API endpoints
export const healthCheckHandlers = {
  database: async () => {
    try {
      const response = await fetch("/api/health/database")
      const data = await response.json()
      return { ok: data.ok, details: data }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  },
  storage: async () => {
    try {
      const response = await fetch("/api/health/storage")
      const data = await response.json()
      return { ok: data.ok, details: data }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  },
  ai: async () => {
    try {
      const response = await fetch("/api/health/ai")
      const data = await response.json()
      return { ok: data.ok, details: data }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  },
}
