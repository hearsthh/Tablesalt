import { BaseIntegrationProvider } from "../base-provider"
import { AuthHandler } from "../auth-handlers"
import type { IntegrationCredentials, DataType } from "../types"

export class GoogleMyBusinessProvider extends BaseIntegrationProvider {
  id = "google_my_business"
  name = "Google My Business"
  category = "reviews" as const
  regions = ["Global"]
  cities: string[] = [] // Available globally
  authType = "oauth2" as const
  apiVersion = "v4"
  baseUrl = "https://mybusiness.googleapis.com/v4"
  rateLimit = { requests: 1000, window: 100 } // 1000 requests per 100 seconds

  private readonly scopes = [
    "https://www.googleapis.com/auth/business.manage",
    "https://www.googleapis.com/auth/plus.business.manage",
  ]

  async authenticate(credentials: IntegrationCredentials): Promise<boolean> {
    try {
      if (!credentials.clientId || !credentials.clientSecret) {
        throw new Error("Google My Business requires clientId and clientSecret")
      }

      // For OAuth2, we need to handle the authorization flow
      if (!credentials.accessToken) {
        // Generate authorization URL for user to visit
        const authUrl = this.generateAuthUrl(credentials.clientId)
        console.log(`[v0] Please visit this URL to authorize: ${authUrl}`)
        return false // User needs to complete OAuth flow
      }

      // Verify the access token by making a test request
      const response = await this.makeRequest("/accounts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      })

      if (response.ok) {
        this.credentials = credentials
        return true
      }

      return false
    } catch (error) {
      console.error("[v0] GMB authentication failed:", error)
      return false
    }
  }

  private generateAuthUrl(clientId: string): string {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${window.location.origin}/auth/google/callback`,
      response_type: "code",
      scope: this.scopes.join(" "),
      access_type: "offline",
      prompt: "consent",
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  async fetchData(dataType: DataType, options: any = {}): Promise<any> {
    if (!this.credentials?.accessToken) {
      throw new Error("Not authenticated with Google My Business")
    }

    switch (dataType) {
      case "restaurant_info":
        return this.fetchBusinessInfo(options)
      case "reviews":
        return this.fetchReviews(options)
      case "analytics":
        return this.fetchInsights(options)
      default:
        throw new Error(`Data type ${dataType} not supported by Google My Business`)
    }
  }

  private async fetchBusinessInfo(options: any = {}) {
    try {
      // First get the accounts
      const accountsResponse = await this.makeRequest("/accounts")
      const accountsData = await accountsResponse.json()

      if (!accountsData.accounts || accountsData.accounts.length === 0) {
        throw new Error("No Google My Business accounts found")
      }

      const account = accountsData.accounts[0]
      const accountName = account.name

      // Get locations for the account
      const locationsResponse = await this.makeRequest(`/${accountName}/locations`)
      const locationsData = await locationsResponse.json()

      if (!locationsData.locations || locationsData.locations.length === 0) {
        throw new Error("No business locations found")
      }

      // Transform the data to our standard format
      return locationsData.locations.map((location: any) => ({
        id: location.name,
        name: location.locationName,
        address: {
          street: location.address?.addressLines?.join(", "),
          city: location.address?.locality,
          state: location.address?.administrativeArea,
          postalCode: location.address?.postalCode,
          country: location.address?.regionCode,
        },
        phone: location.primaryPhone,
        website: location.websiteUrl,
        category: location.primaryCategory?.displayName,
        hours: this.transformBusinessHours(location.regularHours),
        coordinates: {
          lat: location.latlng?.latitude,
          lng: location.latlng?.longitude,
        },
        photos: location.photos?.map((photo: any) => photo.googleUrl) || [],
        rating: location.averageRating,
        reviewCount: location.reviewCount,
        lastUpdated: new Date().toISOString(),
        source: "Google My Business",
      }))
    } catch (error) {
      console.error("[v0] Failed to fetch GMB business info:", error)
      throw error
    }
  }

  private async fetchReviews(options: any = {}) {
    try {
      const { locationId, limit = 50 } = options

      if (!locationId) {
        throw new Error("Location ID is required to fetch reviews")
      }

      const response = await this.makeRequest(`/${locationId}/reviews?pageSize=${limit}`)
      const data = await response.json()

      return (data.reviews || []).map((review: any) => ({
        id: review.name,
        customerName: review.reviewer?.displayName || "Anonymous",
        rating: review.starRating,
        comment: review.comment,
        date: review.createTime,
        reply: review.reviewReply?.comment,
        replyDate: review.reviewReply?.updateTime,
        source: "Google My Business",
        platform: "Google",
        lastUpdated: new Date().toISOString(),
      }))
    } catch (error) {
      console.error("[v0] Failed to fetch GMB reviews:", error)
      throw error
    }
  }

  private async fetchInsights(options: any = {}) {
    try {
      const { locationId, startDate, endDate } = options

      if (!locationId) {
        throw new Error("Location ID is required to fetch insights")
      }

      const requestBody = {
        locationNames: [locationId],
        basicRequest: {
          timeRange: {
            startTime: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: endDate || new Date().toISOString(),
          },
          metricRequests: [
            { metric: "QUERIES_DIRECT" },
            { metric: "QUERIES_INDIRECT" },
            { metric: "VIEWS_MAPS" },
            { metric: "VIEWS_SEARCH" },
            { metric: "ACTIONS_WEBSITE" },
            { metric: "ACTIONS_PHONE" },
            { metric: "ACTIONS_DRIVING_DIRECTIONS" },
          ],
        },
      }

      const response = await this.makeRequest("/accounts:reportInsights", {
        method: "POST",
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      return {
        locationId,
        period: {
          startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: endDate || new Date().toISOString(),
        },
        metrics: this.transformInsightsData(data.locationMetrics?.[0]?.metricValues || []),
        lastUpdated: new Date().toISOString(),
        source: "Google My Business",
      }
    } catch (error) {
      console.error("[v0] Failed to fetch GMB insights:", error)
      throw error
    }
  }

  private transformBusinessHours(regularHours: any) {
    if (!regularHours?.periods) return null

    const daysMap = {
      MONDAY: "monday",
      TUESDAY: "tuesday",
      WEDNESDAY: "wednesday",
      THURSDAY: "thursday",
      FRIDAY: "friday",
      SATURDAY: "saturday",
      SUNDAY: "sunday",
    }

    const hours: Record<string, { open: string; close: string; closed?: boolean }> = {}

    for (const period of regularHours.periods) {
      const day = daysMap[period.openDay as keyof typeof daysMap]
      if (day) {
        hours[day] = {
          open: period.openTime || "00:00",
          close: period.closeTime || "23:59",
          closed: !period.openTime && !period.closeTime,
        }
      }
    }

    return hours
  }

  private transformInsightsData(metricValues: any[]) {
    const metrics: Record<string, number> = {}

    for (const metric of metricValues) {
      const metricName = metric.metric
      const totalValue = metric.totalValue?.value || 0

      switch (metricName) {
        case "QUERIES_DIRECT":
          metrics.directSearches = totalValue
          break
        case "QUERIES_INDIRECT":
          metrics.discoverySearches = totalValue
          break
        case "VIEWS_MAPS":
          metrics.mapsViews = totalValue
          break
        case "VIEWS_SEARCH":
          metrics.searchViews = totalValue
          break
        case "ACTIONS_WEBSITE":
          metrics.websiteClicks = totalValue
          break
        case "ACTIONS_PHONE":
          metrics.phoneClicks = totalValue
          break
        case "ACTIONS_DRIVING_DIRECTIONS":
          metrics.directionsRequests = totalValue
          break
      }
    }

    return metrics
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.credentials?.accessToken) {
      return {}
    }

    return {
      Authorization: `Bearer ${this.credentials.accessToken}`,
    }
  }

  // Handle OAuth2 callback and exchange code for tokens
  async handleOAuthCallback(code: string): Promise<IntegrationCredentials> {
    if (!this.credentials?.clientId || !this.credentials?.clientSecret) {
      throw new Error("Client credentials not set")
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${window.location.origin}/auth/google/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for tokens")
    }

    const tokens = await tokenResponse.json()

    return {
      ...this.credentials,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    }
  }

  // Refresh access token when it expires
  async refreshAccessToken(): Promise<boolean> {
    if (!this.credentials?.refreshToken || !this.credentials?.clientId || !this.credentials?.clientSecret) {
      return false
    }

    try {
      const refreshedCredentials = await AuthHandler.refreshOAuth2Token(
        this.credentials.refreshToken,
        this.credentials.clientId,
        this.credentials.clientSecret,
        "https://oauth2.googleapis.com/token",
      )

      this.credentials = { ...this.credentials, ...refreshedCredentials }
      return true
    } catch (error) {
      console.error("[v0] Failed to refresh GMB token:", error)
      return false
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.credentials?.accessToken) return false

      const response = await this.makeRequest("/accounts", { method: "GET" })
      return response.ok
    } catch {
      return false
    }
  }
}
