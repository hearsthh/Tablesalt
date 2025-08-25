import { ENHANCED_MOCK_DATA } from "../mock-data/enhanced-restaurant-dataset"

export class EnhancedMockApiClient {
  private static instance: EnhancedMockApiClient
  private data = ENHANCED_MOCK_DATA

  static getInstance(): EnhancedMockApiClient {
    if (!EnhancedMockApiClient.instance) {
      EnhancedMockApiClient.instance = new EnhancedMockApiClient()
    }
    return EnhancedMockApiClient.instance
  }

  // Restaurant API
  async getRestaurant(id: string) {
    await this.simulateDelay()
    return { success: true, data: this.data.restaurant }
  }

  // Enhanced Customers API with AI insights
  async getCustomers(restaurantId: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: this.data.customers.filter((customer) => customer.restaurant_id === restaurantId),
    }
  }

  async getCustomerAnalytics(restaurantId: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: {
        totalCustomers: 1247,
        avgSpend: 52.4,
        segments: [
          {
            name: "Active",
            count: 456,
            percentage: 54,
            avgSpend: 62.0,
            avgFrequency: 4.5,
          },
          {
            name: "New",
            count: 127,
            percentage: 15,
            avgSpend: 35.5,
            avgFrequency: 1.2,
          },
          {
            name: "Inactive",
            count: 203,
            percentage: 24,
            avgSpend: 28.75,
            avgFrequency: 0.8,
          },
          {
            name: "At Risk",
            count: 58,
            percentage: 7,
            avgSpend: 15.2,
            avgFrequency: 0.3,
          },
        ],
      },
    }
  }

  // Enhanced Reviews API with AI response generation
  async getReviews(restaurantId: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: this.data.reviews.filter((review) => review.restaurant_id === restaurantId),
    }
  }

  async generateReviewResponse(reviewId: string, tone = "professional") {
    await this.simulateDelay(1500)
    const review = this.data.reviews.find((r) => r.id === reviewId)
    if (!review) {
      return { success: false, error: "Review not found" }
    }

    // Return AI-generated response suggestions
    return {
      success: true,
      data: {
        suggestions: review.ai_response_suggestions || [
          "Thank you for your feedback! We appreciate you taking the time to share your experience.",
          "We're grateful for your review and will use your feedback to continue improving.",
          "Thank you for choosing our restaurant. Your feedback helps us serve you better.",
        ],
        recommended: review.ai_response_suggestions?.[0] || "Thank you for your feedback!",
      },
    }
  }

  async respondToReview(reviewId: string, response: string) {
    await this.simulateDelay()
    const reviewIndex = this.data.reviews.findIndex((r) => r.id === reviewId)
    if (reviewIndex !== -1) {
      this.data.reviews[reviewIndex].response = response
      this.data.reviews[reviewIndex].response_date = new Date().toISOString().split("T")[0]
      return { success: true, data: this.data.reviews[reviewIndex] }
    }
    return { success: false, error: "Review not found" }
  }

  // Enhanced Dashboard with AI insights
  async getDashboardStats(restaurantId: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: {
        revenue: this.data.analytics.revenue.monthly,
        customers: this.data.analytics.customers.new_this_month,
        orders: this.data.analytics.orders.monthly,
        rating: 4.6,
        popular_items: this.data.analytics.popular_items,
        recent_activity: [
          { type: "order", message: "New order #1234 - Margherita Pizza", time: "2 minutes ago" },
          { type: "review", message: "New 5-star review from Sarah J.", time: "15 minutes ago" },
          { type: "customer", message: "New customer registration", time: "1 hour ago" },
        ],
        ai_insights: this.data.aiInsights.slice(0, 3),
      },
    }
  }

  // AI-powered marketing content generation
  async generateMarketingContent(type: string, audience: string, product?: string) {
    await this.simulateDelay(2000)

    const contentTemplates = {
      email: {
        subject: `🍝 Special offer just for you at ${this.data.restaurant.name}!`,
        body: `Hi there!\n\nWe've missed you at Bella Vista! Come back and enjoy 15% off your next meal.\n\nOur chef's special this week is the Osso Buco Milanese - it's been flying out of the kitchen!\n\nBook your table today and taste why our customers keep coming back.\n\nBuon appetito!\nThe Bella Vista Team`,
      },
      social: {
        instagram: `🍕 Fresh out of our wood-fired oven! Our Margherita Pizza with San Marzano tomatoes and fresh mozzarella is pure perfection. Tag a friend who needs to try this! #BellaVista #WoodFiredPizza #Authentic`,
        facebook: `🇮🇹 Craving authentic Italian? Our handmade Spaghetti Carbonara is made the traditional Roman way - with pancetta, eggs, and pecorino romano. No cream, just pure Italian tradition! Book your table tonight.`,
      },
      sms: `🍝 Bella Vista: Miss our carbonara? Get 15% off your next visit! Show this text. Valid until Sunday. Book: (555) 123-4567`,
    }

    return {
      success: true,
      data: {
        content: contentTemplates[type] || contentTemplates.email,
        generated_at: new Date().toISOString(),
        audience: audience,
        estimated_engagement: Math.floor(Math.random() * 20) + 10 + "%",
      },
    }
  }

  // Marketing campaigns
  async getMarketingCampaigns(restaurantId?: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: {
        campaigns: this.data.marketingCampaigns,
        strategies: [
          {
            id: "strategy_001",
            name: "Customer Retention",
            description: "Focus on repeat customers and loyalty",
            target: "Existing customers",
            status: "active",
            progress: 75,
            budget: 2000,
            spent: 1200,
            campaigns: 3,
            roi: "285%",
          },
          {
            id: "strategy_002",
            name: "New Customer Acquisition",
            description: "Attract new customers through social media",
            target: "New customers",
            status: "active",
            progress: 60,
            budget: 3000,
            spent: 1800,
            campaigns: 2,
            roi: "320%",
          },
        ],
      },
    }
  }

  // AI Menu optimization
  async generateMenuInsights(restaurantId: string) {
    await this.simulateDelay(2000)
    return {
      success: true,
      data: {
        insights: this.data.aiInsights.filter((insight) => insight.category === "pricing"),
        recommendations: [
          {
            type: "price_optimization",
            item: "Margherita Pizza",
            current_price: 18.95,
            suggested_price: 21.95,
            confidence: 0.87,
            reasoning: "High demand and positive customer feedback support price increase",
          },
          {
            type: "menu_placement",
            item: "Spaghetti Carbonara",
            suggestion: "Feature as signature dish",
            confidence: 0.92,
            reasoning: "Highest customer satisfaction and repeat orders",
          },
        ],
      },
    }
  }

  async generateMenuCombos(menuItems: any[], categories: any[]) {
    await this.simulateDelay(2000)
    return {
      success: true,
      data: {
        combos: [
          {
            id: "combo_001",
            name: "Italian Classic Duo",
            items: ["Margherita Pizza", "Caesar Salad"],
            original_price: 26.9,
            combo_price: 23.95,
            savings: 2.95,
            popularity_score: 0.85,
            description: "Perfect pairing of our signature pizza with fresh Caesar salad",
          },
          {
            id: "combo_002",
            name: "Pasta & Wine Night",
            items: ["Spaghetti Carbonara", "House Chianti"],
            original_price: 32.9,
            combo_price: 28.95,
            savings: 3.95,
            popularity_score: 0.92,
            description: "Traditional carbonara paired with our house wine selection",
          },
          {
            id: "combo_003",
            name: "Sweet Ending",
            items: ["Osso Buco Milanese", "Tiramisu"],
            original_price: 38.9,
            combo_price: 34.95,
            savings: 3.95,
            popularity_score: 0.78,
            description: "Rich main course with our signature dessert",
          },
        ],
        insights: {
          total_combinations: 24,
          avg_savings: 3.28,
          estimated_uptake: "35%",
          revenue_impact: "+12.5%",
        },
      },
    }
  }

  async generateMenuTags(menuItems: any[]) {
    await this.simulateDelay(1500)
    return {
      success: true,
      data: {
        tags: [
          {
            item_id: "item_001",
            name: "Margherita Pizza",
            suggested_tags: ["vegetarian", "classic", "popular", "wood-fired", "traditional"],
            dietary_info: ["vegetarian"],
            allergens: ["gluten", "dairy"],
            spice_level: 0,
          },
          {
            item_id: "item_002",
            name: "Spaghetti Carbonara",
            suggested_tags: ["signature", "traditional", "creamy", "popular", "roman-style"],
            dietary_info: [],
            allergens: ["gluten", "dairy", "eggs"],
            spice_level: 1,
          },
          {
            item_id: "item_003",
            name: "Osso Buco Milanese",
            suggested_tags: ["premium", "slow-cooked", "traditional", "hearty", "milanese"],
            dietary_info: ["gluten-free"],
            allergens: [],
            spice_level: 2,
          },
        ],
        categories: [
          { name: "Popular Items", count: 8, color: "#10B981" },
          { name: "Vegetarian", count: 12, color: "#059669" },
          { name: "Traditional", count: 15, color: "#DC2626" },
          { name: "Signature Dishes", count: 6, color: "#7C3AED" },
          { name: "Premium", count: 4, color: "#F59E0B" },
        ],
        insights: {
          most_common_tags: ["traditional", "popular", "signature"],
          dietary_coverage: "85%",
          allergen_warnings: 18,
        },
      },
    }
  }

  // Communication APIs
  async sendBulkCommunication(customerIds: string[], message: string, channel: string) {
    await this.simulateDelay(1000)
    return {
      success: true,
      data: {
        sent: customerIds.length,
        channel: channel,
        message_id: `msg_${Date.now()}`,
        estimated_delivery: "2-5 minutes",
      },
    }
  }

  async getCommunicationHistory(customerId: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: [
        {
          id: "comm_001",
          type: "email",
          subject: "Thank you for your visit!",
          sent_at: "2024-01-15T10:30:00Z",
          status: "delivered",
        },
        {
          id: "comm_002",
          type: "sms",
          message: "Your table is ready!",
          sent_at: "2024-01-10T19:15:00Z",
          status: "delivered",
        },
      ],
    }
  }

  // Menu management APIs
  async getCategories(restaurantId: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: [
        {
          id: "cat_001",
          name: "Appetizers",
          description: "Start your meal with our delicious appetizers",
          items: [
            {
              id: "item_001",
              name: "Classic Bruschetta",
              description: "Toasted bread topped with fresh tomatoes, basil, and garlic",
              price: 12.95,
              image: "/classic-bruschetta.png",
              category: "Appetizers",
              dietary_tags: ["vegetarian"],
              allergens: ["gluten"],
              spice_level: 0,
              available: true,
            },
            {
              id: "item_002",
              name: "Antipasto Platter",
              description: "Selection of cured meats, cheeses, and marinated vegetables",
              price: 18.95,
              image: "/antipasto-platter.png",
              category: "Appetizers",
              dietary_tags: [],
              allergens: ["dairy"],
              spice_level: 0,
              available: true,
            },
          ],
        },
        {
          id: "cat_002",
          name: "Pasta",
          description: "Handmade pasta dishes with authentic Italian flavors",
          items: [
            {
              id: "item_003",
              name: "Spaghetti Carbonara",
              description: "Traditional Roman pasta with pancetta, eggs, and pecorino romano",
              price: 22.95,
              image: "/spaghetti-carbonara.png",
              category: "Pasta",
              dietary_tags: [],
              allergens: ["gluten", "dairy", "eggs"],
              spice_level: 1,
              available: true,
            },
            {
              id: "item_004",
              name: "Penne Arrabbiata",
              description: "Spicy tomato sauce with garlic, red peppers, and fresh herbs",
              price: 19.95,
              image: "/penne-arrabbiata.png",
              category: "Pasta",
              dietary_tags: ["vegan"],
              allergens: ["gluten"],
              spice_level: 3,
              available: true,
            },
          ],
        },
        {
          id: "cat_003",
          name: "Pizza",
          description: "Wood-fired pizzas with fresh ingredients",
          items: [
            {
              id: "item_005",
              name: "Margherita Pizza",
              description: "San Marzano tomatoes, fresh mozzarella, and basil",
              price: 18.95,
              image: "/margherita-pizza.png",
              category: "Pizza",
              dietary_tags: ["vegetarian"],
              allergens: ["gluten", "dairy"],
              spice_level: 0,
              available: true,
            },
          ],
        },
        {
          id: "cat_004",
          name: "Desserts",
          description: "Traditional Italian desserts",
          items: [
            {
              id: "item_009",
              name: "Tiramisu",
              description: "Classic Italian dessert with coffee-soaked ladyfingers",
              price: 9.95,
              image: "/classic-tiramisu.png",
              category: "Desserts",
              dietary_tags: ["vegetarian"],
              allergens: ["gluten", "dairy", "eggs"],
              spice_level: 0,
              available: true,
            },
          ],
        },
        {
          id: "cat_005",
          name: "Beverages",
          description: "Italian wines, sodas, and specialty drinks",
          items: [
            {
              id: "item_010",
              name: "Italian Soda",
              description: "Sparkling water with natural fruit flavors",
              price: 4.95,
              image: "/italian-soda.png",
              category: "Beverages",
              dietary_tags: ["vegan", "gluten-free"],
              allergens: [],
              spice_level: 0,
              available: true,
            },
          ],
        },
      ],
    }
  }

  async getMenuItems(restaurantId: string) {
    await this.simulateDelay()
    const categoriesResponse = await this.getCategories(restaurantId)
    if (!categoriesResponse.success) return categoriesResponse

    const allItems = categoriesResponse.data.flatMap((category) => category.items)
    return {
      success: true,
      data: allItems,
    }
  }

  async createMenuItem(itemData: any) {
    await this.simulateDelay()
    const newItem = {
      id: `item_${Date.now()}`,
      ...itemData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return {
      success: true,
      data: newItem,
    }
  }

  async updateMenuItem(itemId: string, itemData: any) {
    await this.simulateDelay()
    const updatedItem = {
      id: itemId,
      ...itemData,
      updated_at: new Date().toISOString(),
    }

    return {
      success: true,
      data: updatedItem,
    }
  }

  async deleteMenuItem(itemId: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: { id: itemId, deleted: true },
    }
  }

  private async simulateDelay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const enhancedMockApiClient = EnhancedMockApiClient.getInstance()
