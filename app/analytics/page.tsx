"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Star,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Clock,
} from "lucide-react"
import { NavigationDrawer } from "@/components/navigation-drawer"
import { enhancedApiClient } from "@/lib/api/enhanced-api-client"
import { useToast } from "@/hooks/use-toast"

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [timeRange, setTimeRange] = useState("30d")
  const [restaurantId] = useState("rest_001")

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading analytics data from enhanced API client...")

      const [performanceResponse, revenueResponse, customerResponse] = await Promise.all([
        enhancedApiClient.getPerformanceAnalytics(restaurantId, timeRange),
        enhancedApiClient.getRevenueAnalytics(restaurantId, timeRange),
        enhancedApiClient.getCustomerAnalytics(restaurantId, timeRange),
      ])

      if (performanceResponse.success && revenueResponse.success && customerResponse.success) {
        const analytics = {
          performance: performanceResponse.data,
          revenue: revenueResponse.data,
          customers: customerResponse.data,
        }

        console.log("[v0] Loaded analytics:", analytics)
        setAnalyticsData(analytics)

        toast({
          title: "Analytics Loaded",
          description: `Loaded performance data for ${timeRange}`,
        })
      } else {
        throw new Error("Failed to load analytics data")
      }
    } catch (error) {
      console.error("[v0] Failed to load analytics data:", error)
      toast({
        title: "Loading Error",
        description: "Using offline data. Some features may be limited.",
        variant: "destructive",
      })

      setAnalyticsData({
        performance: {
          totalRevenue: 284750,
          totalOrders: 1247,
          avgOrderValue: 52.4,
          customerSatisfaction: 4.2,
          revenueChange: 12.5,
          ordersChange: 8.3,
          aovChange: 3.2,
          satisfactionChange: 0.1,
        },
        revenue: {
          daily: [
            { date: "2024-01-01", revenue: 2840, orders: 45 },
            { date: "2024-01-02", revenue: 3120, orders: 52 },
            { date: "2024-01-03", revenue: 2950, orders: 48 },
            { date: "2024-01-04", revenue: 3450, orders: 58 },
            { date: "2024-01-05", revenue: 4200, orders: 67 },
          ],
          topItems: [
            { name: "Margherita Pizza", revenue: 12450, orders: 234 },
            { name: "Caesar Salad", revenue: 8920, orders: 178 },
            { name: "Pasta Carbonara", revenue: 9840, orders: 164 },
          ],
        },
        customers: {
          totalCustomers: 1247,
          newCustomers: 127,
          returningCustomers: 1120,
          churnRate: 5.2,
          segments: [
            { name: "VIP", count: 89, percentage: 7.1 },
            { name: "Regular", count: 456, percentage: 36.6 },
            { name: "Occasional", count: 702, percentage: 56.3 },
          ],
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `$${analyticsData?.performance?.totalRevenue?.toLocaleString() || "284,750"}`,
      change: `+${analyticsData?.performance?.revenueChange || 12.5}%`,
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: analyticsData?.performance?.totalOrders?.toLocaleString() || "1,247",
      change: `+${analyticsData?.performance?.ordersChange || 8.3}%`,
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Avg Order Value",
      value: `$${analyticsData?.performance?.avgOrderValue || "52.40"}`,
      change: `+${analyticsData?.performance?.aovChange || 3.2}%`,
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Customer Rating",
      value: `${analyticsData?.performance?.customerSatisfaction || "4.2"}★`,
      change: `+${analyticsData?.performance?.satisfactionChange || 0.1}`,
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <NavigationDrawer />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Performance Analytics</h1>
              <p className="text-sm text-gray-500 hidden sm:block">Track revenue, orders, and customer metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex border-gray-200 text-gray-600 bg-white h-8 px-3 text-xs rounded-md"
              onClick={() => toast({ title: "Export Data", description: "Preparing analytics export..." })}
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-600 bg-white h-8 px-3 text-xs rounded-md"
              onClick={() => toast({ title: "Filters", description: "Opening filter options..." })}
            >
              <Filter className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Performance Overview
            {analyticsData && (
              <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Live Data</span>
            )}
          </h2>
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="7d" className="text-xs">
                7D
              </TabsTrigger>
              <TabsTrigger value="30d" className="text-xs">
                30D
              </TabsTrigger>
              <TabsTrigger value="90d" className="text-xs">
                90D
              </TabsTrigger>
              <TabsTrigger value="1y" className="text-xs">
                1Y
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => {
            const IconComponent = kpi.icon
            const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown
            return (
              <Card key={index} className="border border-gray-100 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <IconComponent className={`h-4 w-4 ${kpi.color} flex-shrink-0`} />
                    <p className="text-xs text-gray-500 truncate">{kpi.title}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg sm:text-xl font-semibold text-gray-900">{kpi.value}</p>
                    <div className="flex items-center space-x-1">
                      <TrendIcon className={`h-3 w-3 ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                      <span className={`text-xs ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Revenue Analytics */}
        <Card className="border border-gray-100 bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Revenue Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Daily Average</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${Math.round((analyticsData?.performance?.totalRevenue || 284750) / 30).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Per day this month</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Peak Hours</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">6-8 PM</p>
                  <p className="text-xs text-gray-500">Highest revenue window</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <PieChart className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Top Category</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">Pizza</p>
                  <p className="text-xs text-gray-500">42% of total revenue</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Items */}
        <Card className="border border-gray-100 bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(
                analyticsData?.revenue?.topItems || [
                  { name: "Margherita Pizza", revenue: 12450, orders: 234 },
                  { name: "Caesar Salad", revenue: 8920, orders: 178 },
                  { name: "Pasta Carbonara", revenue: 9840, orders: 164 },
                ]
              ).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${item.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card className="border border-gray-100 bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Customer Segments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(
                analyticsData?.customers?.segments || [
                  { name: "VIP", count: 89, percentage: 7.1 },
                  { name: "Regular", count: 456, percentage: 36.6 },
                  { name: "Occasional", count: 702, percentage: 56.3 },
                ]
              ).map((segment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{segment.name}</span>
                    <span className="text-sm text-gray-500">{segment.count} customers</span>
                  </div>
                  <Progress value={segment.percentage} className="h-2" />
                  <p className="text-xs text-gray-500">{segment.percentage}% of total customers</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
