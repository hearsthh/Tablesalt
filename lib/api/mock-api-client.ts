import { MOCK_RESTAURANT_DATA } from "../mock-data/restaurant-dataset"

export class MockApiClient {
  private static instance: MockApiClient
  private data = MOCK_RESTAURANT_DATA

  static getInstance(): MockApiClient {
    if (!MockApiClient.instance) {
      MockApiClient.instance = new MockApiClient()
    }
    return MockApiClient.instance
  }

  // Restaurant API
  async getRestaurant(id: string) {
    await this.simulateDelay()
    return { success: true, data: this.data.restaurant }
  }

  async updateRestaurant(id: string, updates: any) {
    await this.simulateDelay()
    this.data.restaurant = { ...this.data.restaurant, ...updates }
    return { success: true, data: this.data.restaurant }
  }

  // Categories API
  async getCategories(restaurantId: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: this.data.categories.filter((cat) => cat.restaurant_id === restaurantId),
    }
  }

  async createCategory(categoryData: any) {
    await this.simulateDelay()
    const newCategory = {
      id: `cat_${Date.now()}`,
      ...categoryData,
      created_at: new Date().toISOString(),
    }
    this.data.categories.push(newCategory)
    return { success: true, data: newCategory }
  }

  async updateCategory(id: string, updates: any) {
    await this.simulateDelay()
    const index = this.data.categories.findIndex((cat) => cat.id === id)
    if (index !== -1) {
      this.data.categories[index] = { ...this.data.categories[index], ...updates }
      return { success: true, data: this.data.categories[index] }
    }
    return { success: false, error: "Category not found" }
  }

  async deleteCategory(id: string) {
    await this.simulateDelay()
    this.data.categories = this.data.categories.filter((cat) => cat.id !== id)
    this.data.menu_items = this.data.menu_items.filter((item) => item.category_id !== id)
    return { success: true }
  }

  // Menu Items API
  async getMenuItems(restaurantId: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: this.data.menu_items.filter((item) => item.restaurant_id === restaurantId),
    }
  }

  async createMenuItem(itemData: any) {
    await this.simulateDelay()
    const newItem = {
      id: `item_${Date.now()}`,
      ...itemData,
      created_at: new Date().toISOString(),
      popularity_score: 0,
    }
    this.data.menu_items.push(newItem)
    return { success: true, data: newItem }
  }

  async updateMenuItem(id: string, updates: any) {
    await this.simulateDelay()
    const index = this.data.menu_items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.data.menu_items[index] = { ...this.data.menu_items[index], ...updates }
      return { success: true, data: this.data.menu_items[index] }
    }
    return { success: false, error: "Menu item not found" }
  }

  async deleteMenuItem(id: string) {
    await this.simulateDelay()
    this.data.menu_items = this.data.menu_items.filter((item) => item.id !== id)
    return { success: true }
  }

  // Customers API
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

  // Reviews API
  async getReviews(restaurantId: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: this.data.reviews.filter((review) => review.restaurant_id === restaurantId),
    }
  }

  // Analytics API
  async getAnalytics(restaurantId: string) {
    await this.simulateDelay()
    return { success: true, data: this.data.analytics }
  }

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
      },
    }
  }

  async getMarketingAnalytics() {
    await this.simulateDelay()
    return {
      success: true,
      data: {
        performanceMetrics: [
          {
            label: "Total Reach",
            value: "78.5K",
            change: "+18%",
            trend: "up",
          },
          {
            label: "Engagement Rate",
            value: "8.2%",
            change: "+2.1%",
            trend: "up",
          },
          {
            label: "Conversion Rate",
            value: "3.2%",
            change: "+0.8%",
            trend: "up",
          },
          {
            label: "Marketing ROI",
            value: "420%",
            change: "+45%",
            trend: "up",
          },
        ],
        channelSummaries: [
          {
            channel: "Instagram",
            followers: "12.4K",
            engagement: "6.8%",
            reach: "45.2K",
            posts: 24,
            trend: "up",
            trendValue: "+18%",
            activeCampaigns: 3,
            revenue: "$2,840",
          },
          {
            channel: "Facebook",
            followers: "8.9K",
            engagement: "4.2%",
            reach: "28.7K",
            posts: 18,
            trend: "up",
            trendValue: "+12%",
            activeCampaigns: 2,
            revenue: "$1,920",
          },
        ],
      },
    }
  }

  async getMarketingCampaigns(restaurantId?: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: {
        campaigns: [
          {
            id: 1,
            name: "Weekend Special Promotion",
            type: "Email",
            status: "active",
            startDate: "2024-01-15",
            endDate: "2024-02-15",
            reach: 1247,
            clicks: 156,
            conversions: 23,
            revenue: 1150.0,
            ctr: 12.5,
            roi: 285,
            budget: 500,
            spent: 320,
            activities: 45,
            orders: 23,
            channels: ["Email", "SMS"],
            strategyId: "strategy_001",
          },
          {
            id: 2,
            name: "New Menu Launch",
            type: "Social Media",
            status: "scheduled",
            startDate: "2024-01-20",
            endDate: "2024-02-20",
            reach: 2340,
            clicks: 287,
            conversions: 45,
            revenue: 2250.0,
            ctr: 12.3,
            roi: 320,
            budget: 800,
            spent: 450,
            activities: 67,
            orders: 45,
            channels: ["Instagram", "Facebook"],
            strategyId: "strategy_002",
          },
        ],
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

  async getCampaignStats(restaurantId: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: {
        activeCampaigns: 12,
        totalReach: 4200,
        avgCtr: 12.1,
        avgRoi: 285,
      },
    }
  }

  async updateCampaignStatus(campaignId: string, action: string) {
    await this.simulateDelay()
    return {
      success: true,
      data: {
        campaignId,
        action,
        status: action === "pause" ? "paused" : action === "start" ? "active" : "updated",
      },
    }
  }

  // AI Integration APIs
  async generateMenuCombos(menuItems: any[]) {
    await this.simulateDelay(2000) // Longer delay for AI processing
    return {
      success: true,
      data: {
        combos: [
          {
            id: "combo_001",
            name: "Italian Classic Combo",
            items: ["item_003", "item_005", "item_009"],
            price: 45.95,
            savings: 6.9,
            description: "Perfect combination of our signature carbonara, margherita pizza, and tiramisu",
          },
          {
            id: "combo_002",
            name: "Seafood Special",
            items: ["item_002", "item_008"],
            price: 42.95,
            savings: 3.95,
            description: "Fresh calamari appetizer paired with our salt-crusted branzino",
          },
        ],
      },
    }
  }

  async generateMenuTags(menuItems: any[]) {
    await this.simulateDelay(1500)
    return {
      success: true,
      data: {
        suggested_tags: [
          { item_id: "item_003", tags: ["signature dish", "customer favorite", "traditional"] },
          { item_id: "item_005", tags: ["classic", "wood-fired", "authentic"] },
          { item_id: "item_007", tags: ["premium", "chef special", "slow-cooked"] },
        ],
      },
    }
  }

  private async simulateDelay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const mockApiClient = MockApiClient.getInstance()
