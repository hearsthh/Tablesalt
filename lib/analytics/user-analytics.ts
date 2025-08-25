interface PageView {
  id: string
  timestamp: string
  userId?: string
  sessionId: string
  page: string
  referrer?: string
  userAgent: string
  duration?: number
  exitPage: boolean
}

interface UserEvent {
  id: string
  timestamp: string
  userId?: string
  sessionId: string
  event: string
  category: "navigation" | "interaction" | "conversion" | "error"
  properties: Record<string, any>
}

interface UserSession {
  id: string
  userId?: string
  startTime: string
  endTime?: string
  pageViews: number
  events: number
  duration: number
  bounced: boolean
  converted: boolean
  device: string
  browser: string
  location?: string
}

interface ConversionFunnel {
  step: string
  users: number
  conversionRate: number
  dropoffRate: number
}

class UserAnalytics {
  private pageViews: PageView[] = []
  private events: UserEvent[] = []
  private sessions: Map<string, UserSession> = new Map()
  private maxEvents = 100000 // Keep last 100k events

  constructor() {
    this.startSessionCleanup()
  }

  // Track page view
  trackPageView(data: {
    userId?: string
    sessionId: string
    page: string
    referrer?: string
    userAgent: string
  }): void {
    const pageView: PageView = {
      id: `pv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...data,
      exitPage: false,
    }

    this.pageViews.push(pageView)
    this.updateSession(data.sessionId, data.userId, "pageview")
    this.trimEvents()

    console.log(`[v0] ANALYTICS: Page view - ${data.page} (Session: ${data.sessionId})`)
  }

  // Track user event
  trackEvent(data: {
    userId?: string
    sessionId: string
    event: string
    category: "navigation" | "interaction" | "conversion" | "error"
    properties?: Record<string, any>
  }): void {
    const event: UserEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      properties: {},
      ...data,
    }

    this.events.push(event)
    this.updateSession(data.sessionId, data.userId, "event")
    this.trimEvents()

    // Check for conversion events
    if (data.category === "conversion") {
      this.markSessionConverted(data.sessionId)
    }

    console.log(`[v0] ANALYTICS: Event - ${data.event} (${data.category})`)
  }

  // Update or create session
  private updateSession(sessionId: string, userId?: string, type: "pageview" | "event" = "pageview"): void {
    let session = this.sessions.get(sessionId)

    if (!session) {
      session = {
        id: sessionId,
        userId,
        startTime: new Date().toISOString(),
        pageViews: 0,
        events: 0,
        duration: 0,
        bounced: true,
        converted: false,
        device: this.detectDevice(),
        browser: this.detectBrowser(),
        location: this.detectLocation(),
      }
      this.sessions.set(sessionId, session)
    }

    // Update session data
    session.endTime = new Date().toISOString()
    session.duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime()

    if (type === "pageview") {
      session.pageViews++
      // Not bounced if more than 1 page view or session > 30 seconds
      if (session.pageViews > 1 || session.duration > 30000) {
        session.bounced = false
      }
    } else {
      session.events++
      session.bounced = false // Any event interaction means not bounced
    }
  }

  private markSessionConverted(sessionId: string): void {
    const session = this.sessions.get(sessionId)
    if (session) {
      session.converted = true
    }
  }

  // Device/browser detection (mock implementations)
  private detectDevice(): string {
    const devices = ["desktop", "mobile", "tablet"]
    return devices[Math.floor(Math.random() * devices.length)]
  }

  private detectBrowser(): string {
    const browsers = ["Chrome", "Firefox", "Safari", "Edge"]
    return browsers[Math.floor(Math.random() * browsers.length)]
  }

  private detectLocation(): string {
    const locations = ["US", "CA", "UK", "AU", "DE"]
    return locations[Math.floor(Math.random() * locations.length)]
  }

  // Convenience tracking methods
  trackMenuView(sessionId: string, userId?: string): void {
    this.trackPageView({
      sessionId,
      userId,
      page: "/menu",
      userAgent: "Mock User Agent",
    })
  }

  trackMenuItemClick(sessionId: string, itemId: string, itemName: string, userId?: string): void {
    this.trackEvent({
      sessionId,
      userId,
      event: "menu_item_click",
      category: "interaction",
      properties: { itemId, itemName },
    })
  }

  trackAIToolUsage(sessionId: string, tool: string, userId?: string): void {
    this.trackEvent({
      sessionId,
      userId,
      event: "ai_tool_used",
      category: "interaction",
      properties: { tool },
    })
  }

  trackMenuUpdate(sessionId: string, action: string, itemId?: string, userId?: string): void {
    this.trackEvent({
      sessionId,
      userId,
      event: "menu_updated",
      category: "conversion",
      properties: { action, itemId },
    })
  }

  trackError(sessionId: string, error: string, page: string, userId?: string): void {
    this.trackEvent({
      sessionId,
      userId,
      event: "error_occurred",
      category: "error",
      properties: { error, page },
    })
  }

  // Analytics queries
  getPageViews(timeRange = 24 * 60 * 60 * 1000): PageView[] {
    const cutoff = new Date(Date.now() - timeRange).toISOString()
    return this.pageViews.filter((pv) => pv.timestamp >= cutoff)
  }

  getEvents(timeRange = 24 * 60 * 60 * 1000): UserEvent[] {
    const cutoff = new Date(Date.now() - timeRange).toISOString()
    return this.events.filter((e) => e.timestamp >= cutoff)
  }

  getSessions(timeRange = 24 * 60 * 60 * 1000): UserSession[] {
    const cutoff = new Date(Date.now() - timeRange).toISOString()
    return Array.from(this.sessions.values()).filter((s) => s.startTime >= cutoff)
  }

  // Analytics calculations
  getTrafficStats(timeRange = 24 * 60 * 60 * 1000): {
    totalPageViews: number
    uniqueVisitors: number
    sessions: number
    bounceRate: number
    avgSessionDuration: number
    topPages: Array<{ page: string; views: number }>
  } {
    const recentPageViews = this.getPageViews(timeRange)
    const recentSessions = this.getSessions(timeRange)

    const uniqueVisitors = new Set(recentPageViews.map((pv) => pv.sessionId)).size
    const bouncedSessions = recentSessions.filter((s) => s.bounced).length
    const avgDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length

    // Top pages
    const pageStats = new Map<string, number>()
    recentPageViews.forEach((pv) => {
      pageStats.set(pv.page, (pageStats.get(pv.page) || 0) + 1)
    })

    const topPages = Array.from(pageStats.entries())
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    return {
      totalPageViews: recentPageViews.length,
      uniqueVisitors,
      sessions: recentSessions.length,
      bounceRate: recentSessions.length > 0 ? bouncedSessions / recentSessions.length : 0,
      avgSessionDuration: avgDuration || 0,
      topPages,
    }
  }

  getConversionFunnel(): ConversionFunnel[] {
    const sessions = Array.from(this.sessions.values())
    const totalSessions = sessions.length

    // Define funnel steps
    const steps = [
      { step: "Visited Site", filter: () => true },
      { step: "Viewed Menu", filter: (s: UserSession) => s.pageViews > 0 },
      { step: "Interacted", filter: (s: UserSession) => s.events > 0 },
      { step: "Converted", filter: (s: UserSession) => s.converted },
    ]

    let previousUsers = totalSessions
    return steps.map((stepDef, index) => {
      const users = sessions.filter(stepDef.filter).length
      const conversionRate = previousUsers > 0 ? users / previousUsers : 0
      const dropoffRate = 1 - conversionRate

      const result = {
        step: stepDef.step,
        users,
        conversionRate,
        dropoffRate: index > 0 ? dropoffRate : 0,
      }

      previousUsers = users
      return result
    })
  }

  getEventStats(timeRange = 24 * 60 * 60 * 1000): {
    totalEvents: number
    eventsByCategory: Record<string, number>
    topEvents: Array<{ event: string; count: number }>
    errorRate: number
  } {
    const recentEvents = this.getEvents(timeRange)
    const totalEvents = recentEvents.length

    // Events by category
    const eventsByCategory: Record<string, number> = {}
    recentEvents.forEach((event) => {
      eventsByCategory[event.category] = (eventsByCategory[event.category] || 0) + 1
    })

    // Top events
    const eventCounts = new Map<string, number>()
    recentEvents.forEach((event) => {
      eventCounts.set(event.event, (eventCounts.get(event.event) || 0) + 1)
    })

    const topEvents = Array.from(eventCounts.entries())
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const errorEvents = recentEvents.filter((e) => e.category === "error").length
    const errorRate = totalEvents > 0 ? errorEvents / totalEvents : 0

    return {
      totalEvents,
      eventsByCategory,
      topEvents,
      errorRate,
    }
  }

  // Cleanup old sessions
  private startSessionCleanup(): void {
    setInterval(
      () => {
        const cutoff = Date.now() - 24 * 60 * 60 * 1000 // 24 hours ago
        for (const [sessionId, session] of this.sessions.entries()) {
          if (new Date(session.startTime).getTime() < cutoff) {
            this.sessions.delete(sessionId)
          }
        }
      },
      60 * 60 * 1000,
    ) // Cleanup every hour
  }

  private trimEvents(): void {
    if (this.pageViews.length > this.maxEvents) {
      this.pageViews = this.pageViews.slice(-this.maxEvents)
    }
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }
  }
}

export const userAnalytics = new UserAnalytics()
