import { createClient } from "@/lib/supabase/client"

interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
  userId?: string
  restaurantId?: string
  timestamp?: Date
}

interface GoogleAnalyticsConfig {
  measurementId: string
  apiSecret: string
}

interface MixpanelConfig {
  token: string
  apiSecret: string
}

class AnalyticsService {
  private googleAnalytics: GoogleAnalyticsConfig | null = null
  private mixpanel: MixpanelConfig | null = null
  private supabase = createClient()

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    // Initialize Google Analytics
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && process.env.GA_API_SECRET) {
      this.googleAnalytics = {
        measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        apiSecret: process.env.GA_API_SECRET,
      }
    }

    // Initialize Mixpanel
    if (process.env.MIXPANEL_TOKEN && process.env.MIXPANEL_API_SECRET) {
      this.mixpanel = {
        token: process.env.MIXPANEL_TOKEN,
        apiSecret: process.env.MIXPANEL_API_SECRET,
      }
    }
  }

  async track(event: AnalyticsEvent): Promise<void> {
    try {
      // Store in database
      await this.storeEvent(event)

      // Send to external providers
      await Promise.all([this.sendToGoogleAnalytics(event), this.sendToMixpanel(event)])
    } catch (error) {
      console.error("Analytics tracking error:", error)
    }
  }

  private async storeEvent(event: AnalyticsEvent): Promise<void> {
    const { error } = await this.supabase.from("analytics_events").insert({
      event_name: event.event,
      properties: event.properties,
      user_id: event.userId,
      restaurant_id: event.restaurantId,
      timestamp: event.timestamp || new Date(),
    })

    if (error) {
      console.error("Database analytics error:", error)
    }
  }

  private async sendToGoogleAnalytics(event: AnalyticsEvent): Promise<void> {
    if (!this.googleAnalytics) return

    try {
      const response = await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${this.googleAnalytics.measurementId}&api_secret=${this.googleAnalytics.apiSecret}`,
        {
          method: "POST",
          body: JSON.stringify({
            client_id: event.userId || "anonymous",
            events: [
              {
                name: event.event,
                params: event.properties,
              },
            ],
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`GA API error: ${response.status}`)
      }
    } catch (error) {
      console.error("Google Analytics error:", error)
    }
  }

  private async sendToMixpanel(event: AnalyticsEvent): Promise<void> {
    if (!this.mixpanel) return

    try {
      const data = {
        event: event.event,
        properties: {
          ...event.properties,
          distinct_id: event.userId || "anonymous",
          time: event.timestamp?.getTime() || Date.now(),
          token: this.mixpanel.token,
        },
      }

      const response = await fetch("https://api.mixpanel.com/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([data]),
      })

      if (!response.ok) {
        throw new Error(`Mixpanel API error: ${response.status}`)
      }
    } catch (error) {
      console.error("Mixpanel error:", error)
    }
  }

  // Convenience methods for common events
  async trackPageView(page: string, userId?: string, restaurantId?: string): Promise<void> {
    await this.track({
      event: "page_view",
      properties: { page },
      userId,
      restaurantId,
    })
  }

  async trackFeatureUsage(feature: string, userId?: string, restaurantId?: string): Promise<void> {
    await this.track({
      event: "feature_used",
      properties: { feature },
      userId,
      restaurantId,
    })
  }

  async trackAIGeneration(type: string, success: boolean, userId?: string, restaurantId?: string): Promise<void> {
    await this.track({
      event: "ai_generation",
      properties: { type, success },
      userId,
      restaurantId,
    })
  }
}

export const analyticsService = new AnalyticsService()
export default analyticsService
