interface AuditEvent {
  id: string
  timestamp: string
  userId?: string
  userEmail?: string
  userRole?: string
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  success: boolean
  errorMessage?: string
  severity: "low" | "medium" | "high" | "critical"
}

interface SecurityEvent extends AuditEvent {
  type: "authentication" | "authorization" | "data_access" | "data_modification" | "system" | "suspicious"
  riskScore: number
}

class AuditLogger {
  private events: AuditEvent[] = []
  private securityEvents: SecurityEvent[] = []
  private maxEvents = 10000 // Keep last 10k events in memory

  constructor() {
    this.startPeriodicFlush()
  }

  // Log general audit event
  logEvent(event: Omit<AuditEvent, "id" | "timestamp">): void {
    const auditEvent: AuditEvent = {
      ...event,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    this.events.push(auditEvent)
    this.trimEvents()

    // Log to console for development
    console.log(`[v0] AUDIT: ${auditEvent.action} on ${auditEvent.resource} by ${auditEvent.userEmail || "anonymous"}`)

    // In production, this would be sent to:
    // - Database for long-term storage
    // - Log aggregation service (ELK, Splunk)
    // - SIEM system for security monitoring
    // - Compliance logging system
  }

  // Log security-specific event
  logSecurityEvent(event: Omit<SecurityEvent, "id" | "timestamp">): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: `security-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    this.securityEvents.push(securityEvent)
    this.events.push(securityEvent) // Also add to general events
    this.trimEvents()

    // Alert on high-risk events
    if (securityEvent.riskScore >= 8 || securityEvent.severity === "critical") {
      this.alertHighRiskEvent(securityEvent)
    }

    console.log(`[v0] SECURITY: ${securityEvent.type} - ${securityEvent.action} (Risk: ${securityEvent.riskScore}/10)`)
  }

  // Convenience methods for common events
  logAuthentication(success: boolean, email: string, ipAddress?: string, errorMessage?: string): void {
    this.logSecurityEvent({
      action: success ? "login_success" : "login_failed",
      resource: "authentication",
      userEmail: email,
      success,
      errorMessage,
      ipAddress,
      severity: success ? "low" : "medium",
      type: "authentication",
      riskScore: success ? 1 : 5,
    })
  }

  logDataAccess(userId: string, userEmail: string, userRole: string, resource: string, resourceId?: string): void {
    this.logEvent({
      userId,
      userEmail,
      userRole,
      action: "data_access",
      resource,
      resourceId,
      success: true,
      severity: "low",
    })
  }

  logDataModification(
    userId: string,
    userEmail: string,
    userRole: string,
    action: string,
    resource: string,
    resourceId?: string,
    details?: Record<string, any>,
  ): void {
    this.logEvent({
      userId,
      userEmail,
      userRole,
      action,
      resource,
      resourceId,
      details,
      success: true,
      severity: "medium",
    })
  }

  logPermissionDenied(
    userId?: string,
    userEmail?: string,
    userRole?: string,
    action: string,
    resource: string,
    ipAddress?: string,
  ): void {
    this.logSecurityEvent({
      userId,
      userEmail,
      userRole,
      action: "permission_denied",
      resource,
      success: false,
      ipAddress,
      severity: "medium",
      type: "authorization",
      riskScore: 6,
    })
  }

  logSuspiciousActivity(
    description: string,
    userId?: string,
    userEmail?: string,
    ipAddress?: string,
    details?: Record<string, any>,
  ): void {
    this.logSecurityEvent({
      userId,
      userEmail,
      action: "suspicious_activity",
      resource: "system",
      details: { description, ...details },
      success: false,
      ipAddress,
      severity: "high",
      type: "suspicious",
      riskScore: 8,
    })
  }

  logRateLimitExceeded(ipAddress: string, ruleKey: string, userEmail?: string): void {
    this.logSecurityEvent({
      userEmail,
      action: "rate_limit_exceeded",
      resource: "api",
      details: { ruleKey },
      success: false,
      ipAddress,
      severity: "medium",
      type: "suspicious",
      riskScore: 5,
    })
  }

  // Query methods
  getEvents(filters?: {
    userId?: string
    action?: string
    resource?: string
    success?: boolean
    severity?: string
    startDate?: string
    endDate?: string
    limit?: number
  }): AuditEvent[] {
    let filteredEvents = [...this.events]

    if (filters) {
      if (filters.userId) {
        filteredEvents = filteredEvents.filter((e) => e.userId === filters.userId)
      }
      if (filters.action) {
        filteredEvents = filteredEvents.filter((e) => e.action.includes(filters.action!))
      }
      if (filters.resource) {
        filteredEvents = filteredEvents.filter((e) => e.resource === filters.resource)
      }
      if (filters.success !== undefined) {
        filteredEvents = filteredEvents.filter((e) => e.success === filters.success)
      }
      if (filters.severity) {
        filteredEvents = filteredEvents.filter((e) => e.severity === filters.severity)
      }
      if (filters.startDate) {
        filteredEvents = filteredEvents.filter((e) => e.timestamp >= filters.startDate!)
      }
      if (filters.endDate) {
        filteredEvents = filteredEvents.filter((e) => e.timestamp <= filters.endDate!)
      }
    }

    const limit = filters?.limit || 100
    return filteredEvents.slice(-limit).reverse()
  }

  getSecurityEvents(limit = 100): SecurityEvent[] {
    return this.securityEvents.slice(-limit).reverse()
  }

  getHighRiskEvents(limit = 50): SecurityEvent[] {
    return this.securityEvents
      .filter((e) => e.riskScore >= 7 || e.severity === "critical")
      .slice(-limit)
      .reverse()
  }

  // Analytics methods
  getEventStats(timeRange = 24 * 60 * 60 * 1000): {
    total: number
    successful: number
    failed: number
    byAction: Record<string, number>
    bySeverity: Record<string, number>
  } {
    const cutoff = new Date(Date.now() - timeRange).toISOString()
    const recentEvents = this.events.filter((e) => e.timestamp >= cutoff)

    const stats = {
      total: recentEvents.length,
      successful: recentEvents.filter((e) => e.success).length,
      failed: recentEvents.filter((e) => !e.success).length,
      byAction: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
    }

    recentEvents.forEach((event) => {
      stats.byAction[event.action] = (stats.byAction[event.action] || 0) + 1
      stats.bySeverity[event.severity] = (stats.bySeverity[event.severity] || 0) + 1
    })

    return stats
  }

  // Private methods
  private trimEvents(): void {
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }
    if (this.securityEvents.length > this.maxEvents) {
      this.securityEvents = this.securityEvents.slice(-this.maxEvents)
    }
  }

  private alertHighRiskEvent(event: SecurityEvent): void {
    console.warn(`[v0] HIGH RISK SECURITY EVENT:`, {
      id: event.id,
      type: event.type,
      action: event.action,
      riskScore: event.riskScore,
      userEmail: event.userEmail,
      ipAddress: event.ipAddress,
    })

    // In production, this would:
    // - Send alert to security team
    // - Trigger automated response (block IP, disable account)
    // - Log to SIEM system
    // - Send notification to admin dashboard
  }

  private startPeriodicFlush(): void {
    // Flush events to persistent storage every 5 minutes
    setInterval(
      () => {
        if (this.events.length > 0) {
          console.log(`[v0] Flushing ${this.events.length} audit events to storage`)
          // In production, this would save to database or log service
        }
      },
      5 * 60 * 1000,
    )
  }

  // Export methods for compliance
  exportEvents(format: "json" | "csv" = "json", filters?: any): string {
    const events = this.getEvents(filters)

    if (format === "csv") {
      const headers = ["timestamp", "userId", "userEmail", "action", "resource", "success", "severity"]
      const rows = events.map((e) => [
        e.timestamp,
        e.userId || "",
        e.userEmail || "",
        e.action,
        e.resource,
        e.success.toString(),
        e.severity,
      ])

      return [headers, ...rows].map((row) => row.join(",")).join("\n")
    }

    return JSON.stringify(events, null, 2)
  }
}

export const auditLogger = new AuditLogger()
