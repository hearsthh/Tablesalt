interface SalesMetric {
  date: string
  revenue: number
  orders: number
  avgOrderValue: number
  customers: number
  newCustomers: number
}

interface MenuItemPerformance {
  itemId: string
  itemName: string
  category: string
  orders: number
  revenue: number
  avgRating: number
  profitMargin: number
  trendDirection: "up" | "down" | "stable"
  trendPercentage: number
}

interface CustomerSegment {
  segment: "new" | "regular" | "vip" | "inactive"
  count: number
  avgOrderValue: number
  totalRevenue: number
  frequency: number
}

interface BusinessInsight {
  id: string
  type: "opportunity" | "warning" | "trend" | "recommendation"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  actionable: boolean
  data: Record<string, any>
  createdAt: string
}

class BusinessAnalytics {
  private salesHistory: SalesMetric[] = []
  private menuPerformance: Map<string, MenuItemPerformance> = new Map()
  private customerSegments: CustomerSegment[] = []
  private insights: BusinessInsight[] = []

  constructor() {
    this.initializeMockData()
    this.startAnalyticsProcessing()
  }

  private initializeMockData(): void {
    // Generate mock sales history for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const baseRevenue = 800 + Math.random() * 400 // $800-1200 base
      const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1
      const revenue = baseRevenue * weekendMultiplier

      const orders = Math.floor(revenue / (25 + Math.random() * 15)) // $25-40 avg order
      const customers = Math.floor(orders * (0.7 + Math.random() * 0.2)) // 70-90% unique customers

      this.salesHistory.push({
        date: date.toISOString().split("T")[0],
        revenue: Math.round(revenue * 100) / 100,
        orders,
        avgOrderValue: Math.round((revenue / orders) * 100) / 100,
        customers,
        newCustomers: Math.floor(customers * (0.1 + Math.random() * 0.1)), // 10-20% new customers
      })
    }

    // Mock menu item performance
    const mockItems = [
      { id: "item-1", name: "Butter Chicken Curry", category: "Main Course" },
      { id: "item-2", name: "Caesar Salad", category: "Appetizers" },
      { id: "item-3", name: "Margherita Pizza", category: "Main Course" },
      { id: "item-4", name: "Chocolate Lava Cake", category: "Desserts" },
    ]

    mockItems.forEach((item) => {
      const orders = Math.floor(Math.random() * 100) + 20
      const revenue = orders * (15 + Math.random() * 20)
      const trendChange = (Math.random() - 0.5) * 0.4 // -20% to +20%

      this.menuPerformance.set(item.id, {
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        orders,
        revenue: Math.round(revenue * 100) / 100,
        avgRating: 3.5 + Math.random() * 1.5, // 3.5-5.0 rating
        profitMargin: 0.4 + Math.random() * 0.3, // 40-70% margin
        trendDirection: trendChange > 0.05 ? "up" : trendChange < -0.05 ? "down" : "stable",
        trendPercentage: Math.abs(trendChange * 100),
      })
    })

    // Mock customer segments
    this.customerSegments = [
      {
        segment: "new",
        count: 45,
        avgOrderValue: 28.5,
        totalRevenue: 1282.5,
        frequency: 1.2,
      },
      {
        segment: "regular",
        count: 128,
        avgOrderValue: 35.2,
        totalRevenue: 4505.6,
        frequency: 3.8,
      },
      {
        segment: "vip",
        count: 23,
        avgOrderValue: 52.8,
        totalRevenue: 1214.4,
        frequency: 8.2,
      },
      {
        segment: "inactive",
        count: 67,
        avgOrderValue: 31.0,
        totalRevenue: 0,
        frequency: 0,
      },
    ]
  }

  private startAnalyticsProcessing(): void {
    // Process analytics every hour
    setInterval(
      () => {
        this.generateBusinessInsights()
        this.updateTrends()
      },
      60 * 60 * 1000,
    )

    // Initial insights generation
    setTimeout(() => this.generateBusinessInsights(), 5000)
  }

  // Record a new sale
  recordSale(saleData: {
    itemId: string
    itemName: string
    category: string
    price: number
    cost: number
    customerId: string
    isNewCustomer: boolean
  }): void {
    const today = new Date().toISOString().split("T")[0]
    let todayMetrics = this.salesHistory.find((s) => s.date === today)

    if (!todayMetrics) {
      todayMetrics = {
        date: today,
        revenue: 0,
        orders: 0,
        avgOrderValue: 0,
        customers: 0,
        newCustomers: 0,
      }
      this.salesHistory.push(todayMetrics)
    }

    // Update daily metrics
    todayMetrics.revenue += saleData.price
    todayMetrics.orders += 1
    todayMetrics.avgOrderValue = todayMetrics.revenue / todayMetrics.orders
    if (saleData.isNewCustomer) {
      todayMetrics.newCustomers += 1
    }

    // Update menu item performance
    const itemPerf = this.menuPerformance.get(saleData.itemId)
    if (itemPerf) {
      itemPerf.orders += 1
      itemPerf.revenue += saleData.price
      itemPerf.profitMargin = (saleData.price - saleData.cost) / saleData.price
    }

    console.log(`[v0] ANALYTICS: Sale recorded - ${saleData.itemName}: $${saleData.price}`)
  }

  // Generate business insights
  private generateBusinessInsights(): void {
    const insights: BusinessInsight[] = []

    // Revenue trend analysis
    const recentSales = this.salesHistory.slice(-7) // Last 7 days
    const previousSales = this.salesHistory.slice(-14, -7) // Previous 7 days

    if (recentSales.length >= 7 && previousSales.length >= 7) {
      const recentRevenue = recentSales.reduce((sum, s) => sum + s.revenue, 0)
      const previousRevenue = previousSales.reduce((sum, s) => sum + s.revenue, 0)
      const revenueChange = (recentRevenue - previousRevenue) / previousRevenue

      if (revenueChange > 0.1) {
        insights.push({
          id: `insight-${Date.now()}-1`,
          type: "trend",
          title: "Revenue Growth Detected",
          description: `Revenue increased by ${(revenueChange * 100).toFixed(1)}% compared to last week`,
          impact: "high",
          actionable: true,
          data: { revenueChange, recentRevenue, previousRevenue },
          createdAt: new Date().toISOString(),
        })
      } else if (revenueChange < -0.1) {
        insights.push({
          id: `insight-${Date.now()}-2`,
          type: "warning",
          title: "Revenue Decline Alert",
          description: `Revenue decreased by ${Math.abs(revenueChange * 100).toFixed(1)}% compared to last week`,
          impact: "high",
          actionable: true,
          data: { revenueChange, recentRevenue, previousRevenue },
          createdAt: new Date().toISOString(),
        })
      }
    }

    // Menu item performance insights
    const topPerformer = Array.from(this.menuPerformance.values()).sort((a, b) => b.revenue - a.revenue)[0]
    const underperformer = Array.from(this.menuPerformance.values()).sort((a, b) => a.orders - b.orders)[0]

    if (topPerformer) {
      insights.push({
        id: `insight-${Date.now()}-3`,
        type: "opportunity",
        title: "Top Performing Item",
        description: `${topPerformer.itemName} is your best seller with $${topPerformer.revenue.toFixed(2)} revenue`,
        impact: "medium",
        actionable: true,
        data: { item: topPerformer },
        createdAt: new Date().toISOString(),
      })
    }

    if (underperformer && underperformer.orders < 10) {
      insights.push({
        id: `insight-${Date.now()}-4`,
        type: "recommendation",
        title: "Low Performing Item",
        description: `${underperformer.itemName} has low sales. Consider promotion or menu optimization`,
        impact: "medium",
        actionable: true,
        data: { item: underperformer },
        createdAt: new Date().toISOString(),
      })
    }

    // Customer segment insights
    const vipSegment = this.customerSegments.find((s) => s.segment === "vip")
    const inactiveSegment = this.customerSegments.find((s) => s.segment === "inactive")

    if (vipSegment && vipSegment.avgOrderValue > 50) {
      insights.push({
        id: `insight-${Date.now()}-5`,
        type: "opportunity",
        title: "High-Value Customers",
        description: `VIP customers spend $${vipSegment.avgOrderValue.toFixed(2)} on average. Consider exclusive offers`,
        impact: "high",
        actionable: true,
        data: { segment: vipSegment },
        createdAt: new Date().toISOString(),
      })
    }

    if (inactiveSegment && inactiveSegment.count > 50) {
      insights.push({
        id: `insight-${Date.now()}-6`,
        type: "recommendation",
        title: "Customer Re-engagement Opportunity",
        description: `${inactiveSegment.count} inactive customers could be re-engaged with targeted campaigns`,
        impact: "medium",
        actionable: true,
        data: { segment: inactiveSegment },
        createdAt: new Date().toISOString(),
      })
    }

    // Add new insights
    this.insights.push(...insights)

    // Keep only last 100 insights
    if (this.insights.length > 100) {
      this.insights = this.insights.slice(-100)
    }

    if (insights.length > 0) {
      console.log(`[v0] ANALYTICS: Generated ${insights.length} new business insights`)
    }
  }

  private updateTrends(): void {
    // Update menu item trends based on recent performance
    this.menuPerformance.forEach((item) => {
      // Mock trend calculation - in production, compare with historical data
      const trendChange = (Math.random() - 0.5) * 0.3 // -15% to +15%
      item.trendDirection = trendChange > 0.05 ? "up" : trendChange < -0.05 ? "down" : "stable"
      item.trendPercentage = Math.abs(trendChange * 100)
    })
  }

  // Query methods
  getSalesMetrics(days = 30): SalesMetric[] {
    return this.salesHistory.slice(-days)
  }

  getMenuPerformance(): MenuItemPerformance[] {
    return Array.from(this.menuPerformance.values()).sort((a, b) => b.revenue - a.revenue)
  }

  getCustomerSegments(): CustomerSegment[] {
    return [...this.customerSegments]
  }

  getBusinessInsights(limit = 20): BusinessInsight[] {
    return this.insights.slice(-limit).reverse()
  }

  // Analytics calculations
  calculateKPIs(timeRange = 30): {
    totalRevenue: number
    totalOrders: number
    avgOrderValue: number
    customerAcquisitionRate: number
    customerRetentionRate: number
    profitMargin: number
    growthRate: number
  } {
    const recentData = this.salesHistory.slice(-timeRange)
    const totalRevenue = recentData.reduce((sum, s) => sum + s.revenue, 0)
    const totalOrders = recentData.reduce((sum, s) => sum + s.orders, 0)
    const totalCustomers = recentData.reduce((sum, s) => sum + s.customers, 0)
    const newCustomers = recentData.reduce((sum, s) => sum + s.newCustomers, 0)

    // Calculate growth rate (compare first half vs second half)
    const halfPoint = Math.floor(timeRange / 2)
    const firstHalf = recentData.slice(0, halfPoint)
    const secondHalf = recentData.slice(halfPoint)

    const firstHalfRevenue = firstHalf.reduce((sum, s) => sum + s.revenue, 0)
    const secondHalfRevenue = secondHalf.reduce((sum, s) => sum + s.revenue, 0)
    const growthRate = firstHalfRevenue > 0 ? (secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue : 0

    // Calculate average profit margin from menu items
    const menuItems = Array.from(this.menuPerformance.values())
    const avgProfitMargin = menuItems.reduce((sum, item) => sum + item.profitMargin, 0) / menuItems.length

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      avgOrderValue: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
      customerAcquisitionRate: totalCustomers > 0 ? newCustomers / totalCustomers : 0,
      customerRetentionRate: 0.75 + Math.random() * 0.2, // Mock retention rate 75-95%
      profitMargin: avgProfitMargin,
      growthRate,
    }
  }

  // Forecasting
  forecastRevenue(days = 7): Array<{ date: string; predictedRevenue: number; confidence: number }> {
    const recentData = this.salesHistory.slice(-14) // Use last 14 days for prediction
    const avgRevenue = recentData.reduce((sum, s) => sum + s.revenue, 0) / recentData.length

    const forecast = []
    for (let i = 1; i <= days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)

      // Simple trend-based forecasting with some randomness
      const trendMultiplier = 1 + (Math.random() - 0.5) * 0.2 // ±10% variation
      const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1
      const predictedRevenue = avgRevenue * trendMultiplier * weekendMultiplier

      forecast.push({
        date: date.toISOString().split("T")[0],
        predictedRevenue: Math.round(predictedRevenue * 100) / 100,
        confidence: 0.7 + Math.random() * 0.2, // 70-90% confidence
      })
    }

    return forecast
  }
}

export const businessAnalytics = new BusinessAnalytics()
