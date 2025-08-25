import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationCredentials, DataType } from "../types"

export class YelpProvider extends BaseIntegrationProvider {
  id = "yelp"
  name = "Yelp"
  category = "reviews" as const
  regions = ["North America"]
  cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "San Francisco",
    "Boston",
    "Seattle",
    "Miami",
    "Las Vegas",
    "Toronto",
    "Vancouver",
  ]
  authType = "api_key" as const
  apiVersion = "v3"
  baseUrl = "https://api.yelp.com/v3"
  rateLimit = { requests: 5000, window: 86400 } // 5000 requests per day

  // Yelp Business API endpoints
  private readonly businessApiUrl = "https://api.yelp.com/v3/businesses"

  async authenticate(credentials: IntegrationCredentials): Promise<boolean> {
    try {
      if (!credentials.apiKey) {
        throw new Error("Yelp requires an API key")
      }

      // Verify the API key by making a test request
      const response = await this.makeRequest("/businesses/search?term=test&location=New York", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
        },
      })

      if (response.ok) {
        this.credentials = credentials
        return true
      }

      return false
    } catch (error) {
      console.error("[v0] Yelp authentication failed:", error)
      return false
    }
  }

  async fetchData(dataType: DataType, options: any = {}): Promise<any> {
    if (!this.credentials?.apiKey) {
      throw new Error("Not authenticated with Yelp")
    }

    switch (dataType) {
      case "restaurant_info":
        return this.fetchBusinessInfo(options)
      case "reviews":
        return this.fetchReviews(options)
      case "analytics":
        return this.fetchBusinessInsights(options)
      default:
        throw new Error(`Data type ${dataType} not supported by Yelp`)
    }
  }

  private async fetchBusinessInfo(options: any = {}) {
    try {
      const { businessId, searchTerm, location } = options

      if (businessId) {
        // Fetch specific business by ID
        const response = await this.makeRequest(`/businesses/${businessId}`)
        const business = await response.json()
        return this.transformBusinessData(business)
      } else if (searchTerm && location) {
        // Search for businesses
        const params = new URLSearchParams({
          term: searchTerm,
          location: location,
          limit: "1", // Get the first match
          sort_by: "best_match",
        })

        const response = await this.makeRequest(`/businesses/search?${params.toString()}`)
        const data = await response.json()

        if (data.businesses && data.businesses.length > 0) {
          const business = data.businesses[0]
          // Get detailed info for the business
          const detailResponse = await this.makeRequest(`/businesses/${business.id}`)
          const detailedBusiness = await detailResponse.json()
          return this.transformBusinessData(detailedBusiness)
        }

        throw new Error("No business found matching the criteria")
      } else {
        throw new Error("Either businessId or both searchTerm and location are required")
      }
    } catch (error) {
      console.error("[v0] Failed to fetch Yelp business info:", error)
      throw error
    }
  }

  private async fetchReviews(options: any = {}) {
    try {
      const { businessId, limit = 20 } = options

      if (!businessId) {
        throw new Error("Business ID is required to fetch reviews")
      }

      const params = new URLSearchParams({
        limit: Math.min(limit, 3).toString(), // Yelp API only returns up to 3 reviews
        sort_by: "newest",
      })

      const response = await this.makeRequest(`/businesses/${businessId}/reviews?${params.toString()}`)
      const data = await response.json()

      return {
        businessId,
        reviews: (data.reviews || []).map((review: any) => ({
          id: review.id,
          customerName: review.user?.name || "Anonymous",
          customerImage: review.user?.image_url,
          rating: review.rating,
          comment: review.text,
          date: review.time_created,
          url: review.url,
          source: "Yelp",
          platform: "Yelp",
          lastUpdated: new Date().toISOString(),
        })),
        totalReviews: data.total || 0,
        possibleLanguages: data.possible_languages || [],
        lastUpdated: new Date().toISOString(),
        source: "Yelp",
      }
    } catch (error) {
      console.error("[v0] Failed to fetch Yelp reviews:", error)
      throw error
    }
  }

  private async fetchBusinessInsights(options: any = {}) {
    try {
      const { businessId } = options

      if (!businessId) {
        throw new Error("Business ID is required to fetch insights")
      }

      // Get basic business info for insights
      const response = await this.makeRequest(`/businesses/${businessId}`)
      const business = await response.json()

      // Yelp doesn't provide detailed analytics via public API
      // This would typically require Yelp for Business Owners API
      return {
        businessId,
        metrics: {
          rating: business.rating,
          reviewCount: business.review_count,
          categories: business.categories?.map((cat: any) => cat.title) || [],
          priceLevel: business.price,
          isClaimedListing: business.is_claimed,
          isClosed: business.is_closed,
          phone: business.phone,
          displayPhone: business.display_phone,
          photos: business.photos || [],
          hours: business.hours?.[0]?.open || [],
          specialHours: business.special_hours || [],
          popularityScore: this.calculatePopularityScore(business),
        },
        location: {
          address: business.location?.display_address?.join(", "),
          city: business.location?.city,
          state: business.location?.state,
          zipCode: business.location?.zip_code,
          country: business.location?.country,
          coordinates: business.coordinates
            ? {
                lat: business.coordinates.latitude,
                lng: business.coordinates.longitude,
              }
            : null,
        },
        lastUpdated: new Date().toISOString(),
        source: "Yelp",
      }
    } catch (error) {
      console.error("[v0] Failed to fetch Yelp insights:", error)
      throw error
    }
  }

  private transformBusinessData(business: any) {
    return {
      id: business.id,
      name: business.name,
      alias: business.alias,
      url: business.url,
      phone: business.phone,
      displayPhone: business.display_phone,
      reviewCount: business.review_count,
      rating: business.rating,
      photos: business.photos || [],
      categories: (business.categories || []).map((cat: any) => ({
        alias: cat.alias,
        title: cat.title,
      })),
      price: business.price,
      location: {
        address1: business.location?.address1,
        address2: business.location?.address2,
        address3: business.location?.address3,
        city: business.location?.city,
        zipCode: business.location?.zip_code,
        country: business.location?.country,
        state: business.location?.state,
        displayAddress: business.location?.display_address,
        crossStreets: business.location?.cross_streets,
      },
      coordinates: business.coordinates
        ? {
            latitude: business.coordinates.latitude,
            longitude: business.coordinates.longitude,
          }
        : null,
      hours: business.hours?.[0]?.open ? this.transformBusinessHours(business.hours[0].open) : null,
      specialHours: business.special_hours || [],
      isClaimed: business.is_claimed,
      isClosed: business.is_closed,
      isOpenNow: business.hours?.[0]?.is_open_now,
      attributes: business.attributes || {},
      transactions: business.transactions || [],
      messaging: business.messaging,
      lastUpdated: new Date().toISOString(),
      source: "Yelp",
    }
  }

  private transformBusinessHours(openHours: any[]) {
    const daysMap = {
      0: "monday",
      1: "tuesday",
      2: "wednesday",
      3: "thursday",
      4: "friday",
      5: "saturday",
      6: "sunday",
    }

    const hours: Record<string, { open: string; close: string; closed?: boolean }> = {}

    for (const hour of openHours) {
      const day = daysMap[hour.day as keyof typeof daysMap]
      if (day) {
        hours[day] = {
          open: hour.start,
          close: hour.end,
          closed: false,
        }
      }
    }

    return hours
  }

  private calculatePopularityScore(business: any): number {
    // Simple popularity calculation based on rating and review count
    const rating = business.rating || 0
    const reviewCount = business.review_count || 0

    // Normalize review count (log scale to prevent huge numbers from dominating)
    const normalizedReviewCount = Math.log10(reviewCount + 1)

    // Weight: 70% rating, 30% review count
    const score = rating * 0.7 + normalizedReviewCount * 0.3

    return Math.round(score * 10) / 10 // Round to 1 decimal place
  }

  // Search for businesses (useful for finding business ID)
  async searchBusinesses(term: string, location: string, options: any = {}) {
    try {
      const { limit = 20, radius = 10000, categories, price, sortBy = "best_match" } = options

      const params = new URLSearchParams({
        term,
        location,
        limit: Math.min(limit, 50).toString(), // Yelp max is 50
        radius: Math.min(radius, 40000).toString(), // Yelp max is 40km
        sort_by: sortBy,
      })

      if (categories) {
        params.append("categories", categories)
      }

      if (price) {
        params.append("price", price)
      }

      const response = await this.makeRequest(`/businesses/search?${params.toString()}`)
      const data = await response.json()

      return {
        businesses: (data.businesses || []).map((business: any) => ({
          id: business.id,
          name: business.name,
          rating: business.rating,
          reviewCount: business.review_count,
          price: business.price,
          phone: business.phone,
          categories: business.categories?.map((cat: any) => cat.title) || [],
          location: business.location?.display_address?.join(", "),
          coordinates: business.coordinates,
          imageUrl: business.image_url,
          url: business.url,
          distance: business.distance,
          isClosed: business.is_closed,
        })),
        total: data.total || 0,
        region: data.region,
        lastUpdated: new Date().toISOString(),
        source: "Yelp",
      }
    } catch (error) {
      console.error("[v0] Failed to search Yelp businesses:", error)
      throw error
    }
  }

  // Get autocomplete suggestions
  async getAutocompleteSuggestions(text: string, latitude?: number, longitude?: number) {
    try {
      const params = new URLSearchParams({
        text,
      })

      if (latitude && longitude) {
        params.append("latitude", latitude.toString())
        params.append("longitude", longitude.toString())
      }

      const response = await this.makeRequest(`/autocomplete?${params.toString()}`)
      const data = await response.json()

      return {
        terms: (data.terms || []).map((term: any) => ({
          text: term.text,
        })),
        businesses: (data.businesses || []).map((business: any) => ({
          id: business.id,
          name: business.name,
        })),
        categories: (data.categories || []).map((category: any) => ({
          alias: category.alias,
          title: category.title,
        })),
        lastUpdated: new Date().toISOString(),
        source: "Yelp",
      }
    } catch (error) {
      console.error("[v0] Failed to get Yelp autocomplete suggestions:", error)
      throw error
    }
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.credentials?.apiKey) {
      return {}
    }

    return {
      Authorization: `Bearer ${this.credentials.apiKey}`,
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.credentials?.apiKey) return false

      const response = await this.makeRequest("/businesses/search?term=test&location=New York", {
        method: "GET",
      })
      return response.ok
    } catch {
      return false
    }
  }
}
