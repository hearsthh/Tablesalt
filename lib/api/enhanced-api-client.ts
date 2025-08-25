import { enhancedMockApiClient } from "./enhanced-mock-api-client"
import { createClient, isSupabaseConfigured, getCurrentUserRestaurant } from "@/lib/supabase/client"

export class EnhancedApiClient {
  private useMockData: boolean
  private supabase = createClient()

  constructor(useMockData = !isSupabaseConfigured()) {
    this.useMockData = useMockData
  }

  async checkDatabaseSetup(): Promise<boolean> {
    if (this.useMockData) {
      return false // Mock mode means database isn't set up
    }

    try {
      // Try to query the restaurants table to see if it exists
      const { data, error } = await this.supabase.from("restaurants").select("id").limit(1)

      // If no error, database is set up
      return !error
    } catch (error) {
      console.log("[v0] Database setup check failed:", error)
      return false
    }
  }

  private async getCurrentRestaurantId(): Promise<string | null> {
    if (this.useMockData) {
      return "550e8400-e29b-41d4-a716-446655440000" // Mock restaurant ID
    }

    const restaurant = await getCurrentUserRestaurant()
    return restaurant?.id || null
  }

  async getRestaurant(id: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.getRestaurant(id)
    }

    const { data, error } = await this.supabase.from("restaurants").select("*").eq("id", id).single()

    if (error) throw error
    return { data, success: true }
  }

  async getCustomers(restaurantId: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.getCustomers(restaurantId)
    }

    const { data, error } = await this.supabase
      .from("customers")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { data, success: true }
  }

  async getCustomerAnalytics(restaurantId: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.getCustomerAnalytics(restaurantId)
    }

    const { data: customers, error } = await this.supabase
      .from("customers")
      .select("*")
      .eq("restaurant_id", restaurantId)

    if (error) throw error

    // Calculate analytics from real data
    const totalCustomers = customers.length
    const totalSpent = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0)
    const avgOrderValue = customers.reduce((sum, c) => sum + (c.avg_order_value || 0), 0) / totalCustomers || 0

    return {
      data: {
        totalCustomers,
        totalSpent,
        avgOrderValue,
        segments: customers.reduce(
          (acc, c) => {
            const segment = c.customer_segment || "Unknown"
            acc[segment] = (acc[segment] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      },
      success: true,
    }
  }

  async getReviews(restaurantId: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.getReviews(restaurantId)
    }

    const { data, error } = await this.supabase
      .from("reviews")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { data, success: true }
  }

  async generateReviewResponse(reviewId: string, tone = "professional") {
    if (this.useMockData) {
      return await enhancedMockApiClient.generateReviewResponse(reviewId, tone)
    }

    const { data: review, error } = await this.supabase.from("reviews").select("*").eq("id", reviewId).single()

    if (error) throw error

    // For now, use mock response generation - can be replaced with real AI service
    return await enhancedMockApiClient.generateReviewResponse(reviewId, tone)
  }

  async respondToReview(reviewId: string, response: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.respondToReview(reviewId, response)
    }

    const { data, error } = await this.supabase
      .from("reviews")
      .update({
        response_text: response,
        response_date: new Date().toISOString(),
        is_responded: true,
      })
      .eq("id", reviewId)
      .select()
      .single()

    if (error) throw error
    return { data, success: true }
  }

  async getDashboardStats(restaurantId: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.getDashboardStats(restaurantId)
    }

    try {
      const [customersResult, ordersResult, reviewsResult] = await Promise.all([
        this.supabase.from("customers").select("total_spent").eq("restaurant_id", restaurantId),
        this.supabase.from("orders").select("total_amount, created_at").eq("restaurant_id", restaurantId),
        this.supabase.from("reviews").select("rating").eq("restaurant_id", restaurantId),
      ])

      const customers = customersResult.data || []
      const orders = ordersResult.data || []
      const reviews = reviewsResult.data || []

      const revenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
      const totalCustomers = customers.length
      const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length : 4.2
      const totalOrders = orders.length

      const recentActivity = orders.slice(0, 5).map((order, index) => ({
        id: index + 1,
        type: "order",
        message: `Order placed - $${order.total_amount}`,
        time: new Date(order.created_at).toLocaleString(),
        icon: "ChefHat",
      }))

      const popularItems = [
        { name: "Margherita Pizza", sales: 45 },
        { name: "Caesar Salad", sales: 32 },
        { name: "Pasta Carbonara", sales: 28 },
      ]

      return {
        data: {
          revenue,
          customers: totalCustomers,
          orders: totalOrders,
          rating: avgRating,
          recent_activity: recentActivity,
          popular_items: popularItems,
        },
        success: true,
      }
    } catch (error) {
      console.error("[v0] Failed to load dashboard stats:", error)
      // Fall back to mock data if database query fails
      return await enhancedMockApiClient.getDashboardStats(restaurantId)
    }
  }

  async generateMarketingContent(type: string, audience: string, product?: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.generateMarketingContent(type, audience, product)
    }

    // For now, use mock generation - can be replaced with real AI service
    return await enhancedMockApiClient.generateMarketingContent(type, audience, product)
  }

  async getMarketingCampaigns(restaurantId?: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.getMarketingCampaigns(restaurantId)
    }

    let query = this.supabase.from("marketing_campaigns").select("*")

    if (restaurantId) {
      query = query.eq("restaurant_id", restaurantId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return { data, success: true }
  }

  async generateMenuInsights(restaurantId: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.generateMenuInsights(restaurantId)
    }

    // For now, use mock insights - can be replaced with real AI analysis
    return await enhancedMockApiClient.generateMenuInsights(restaurantId)
  }

  async sendBulkCommunication(customerIds: string[], message: string, channel: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.sendBulkCommunication(customerIds, message, channel)
    }

    // For now, use mock implementation - can be replaced with real communication service
    return await enhancedMockApiClient.sendBulkCommunication(customerIds, message, channel)
  }

  async getCommunicationHistory(customerId: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.getCommunicationHistory(customerId)
    }

    // For now, use mock history - can be replaced with real communication tracking
    return await enhancedMockApiClient.getCommunicationHistory(customerId)
  }

  async generateMenuTags(menuItems: any[]) {
    if (this.useMockData) {
      return await enhancedMockApiClient.generateMenuTags(menuItems)
    }

    // For now, use mock tag generation - can be replaced with real AI service
    return await enhancedMockApiClient.generateMenuTags(menuItems)
  }

  async getCategories(restaurantId: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.getCategories(restaurantId)
    }

    const { data, error } = await this.supabase
      .from("menu_categories")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) throw error
    return { data, success: true }
  }

  async getMenuItems(restaurantId: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.getMenuItems(restaurantId)
    }

    const { data, error } = await this.supabase
      .from("menu_items")
      .select(`
        *,
        menu_categories (
          id,
          name
        )
      `)
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { data, success: true }
  }

  async createMenuItem(itemData: any) {
    if (this.useMockData) {
      return await enhancedMockApiClient.createMenuItem(itemData)
    }

    const { data, error } = await this.supabase.from("menu_items").insert(itemData).select().single()

    if (error) throw error
    return { data, success: true }
  }

  async updateMenuItem(itemId: string, itemData: any) {
    if (this.useMockData) {
      return await enhancedMockApiClient.updateMenuItem(itemId, itemData)
    }

    const { data, error } = await this.supabase.from("menu_items").update(itemData).eq("id", itemId).select().single()

    if (error) throw error
    return { data, success: true }
  }

  async deleteMenuItem(itemId: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.deleteMenuItem(itemId)
    }

    const { error } = await this.supabase.from("menu_items").delete().eq("id", itemId)

    if (error) throw error
    return { success: true }
  }

  async generateMenuCombos(restaurantId: string) {
    if (this.useMockData) {
      return await enhancedMockApiClient.generateMenuCombos(restaurantId)
    }

    // For now, use mock combo generation - can be replaced with real AI service
    return await enhancedMockApiClient.generateMenuCombos(restaurantId)
  }

  setMockMode(useMock: boolean) {
    this.useMockData = useMock
  }
}

export const enhancedApiClient = new EnhancedApiClient()
