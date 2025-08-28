"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Star,
  CheckCircle,
  Zap,
  Target,
  BarChart3,
  Calendar,
  ArrowUp,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Lightbulb,
  ShoppingCart,
  Utensils,
} from "lucide-react"
import { NavigationDrawer } from "@/components/navigation-drawer"

const useToast = () => {
  const toast = (options: any) => {
    console.log("Toast:", options)
  }
  return { toast }
}

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("7d")
  const [showChartsDialog, setShowChartsDialog] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Mock data for insights
  const overviewMetrics = {
    totalRevenue: 45280,
    revenueChange: 12.5,
    totalOrders: 1847,
    ordersChange: 8.3,
    avgOrderValue: 24.52,
    aovChange: 3.8,
    customerSatisfaction: 4.6,
    satisfactionChange: 0.2,
  }

  const aiInsights = [
    {
      id: 1,
      type: "revenue_opportunity",
      title: "Peak Hour Pricing Opportunity",
      description:
        "Your busiest hours (7-9 PM) show 40% higher demand. Consider implementing dynamic pricing during peak times to increase revenue by an estimated $1,200/month.",
      impact: "high",
      potential_value: 1200,
      confidence: 92,
      status: "new",
      category: "pricing",
      action_required: true,
      estimated_time: "2 hours",
    },
    {
      id: 2,
      type: "menu_optimization",
      title: "Underperforming Menu Items",
      description:
        "3 items account for only 2% of orders but take up 15% of menu space. Consider removing or repositioning these items to improve menu efficiency.",
      impact: "medium",
      potential_value: 800,
      confidence: 87,
      status: "pending",
      category: "menu",
      action_required: true,
      estimated_time: "1 hour",
    },
    {
      id: 3,
      type: "customer_behavior",
      title: "Upselling Opportunity",
      description:
        "Customers who order appetizers spend 35% more on average. Train staff to suggest appetizers to increase average order value.",
      impact: "medium",
      potential_value: 650,
      confidence: 89,
      status: "recommended",
      category: "service",
      action_required: false,
      estimated_time: "30 minutes",
    },
    {
      id: 4,
      type: "inventory_alert",
      title: "Stock Level Warning",
      description:
        "Butter Chicken ingredients are running low. Based on current demand patterns, you'll run out in 2 days. Reorder now to avoid stockouts.",
      impact: "high",
      potential_value: -400,
      confidence: 95,
      status: "urgent",
      category: "inventory",
      action_required: true,
      estimated_time: "15 minutes",
    },
    {
      id: 5,
      type: "seasonal_trend",
      title: "Seasonal Menu Adjustment",
      description:
        "Salad orders typically increase by 60% in the next month. Consider adding seasonal salad options and promoting healthy choices.",
      impact: "medium",
      potential_value: 450,
      confidence: 78,
      status: "upcoming",
      category: "seasonal",
      action_required: false,
      estimated_time: "1 hour",
    },
  ]

  const performanceMetrics = [
    {
      title: "Top Performing Items",
      items: [
        { name: "Margherita Pizza", orders: 203, revenue: 3349.5, growth: 18 },
        { name: "Butter Chicken", orders: 156, revenue: 2962.44, growth: 12 },
        { name: "Caesar Salad", orders: 89, revenue: 1156.11, growth: -5 },
      ],
    },
    {
      title: "Customer Segments",
      items: [
        { name: "Regular Customers", count: 245, value: 18500, growth: 15 },
        { name: "New Customers", count: 89, value: 4200, growth: 22 },
        { name: "VIP Customers", count: 34, value: 8900, growth: 8 },
      ],
    },
    {
      title: "Peak Hours Analysis",
      items: [
        { name: "Lunch (12-2 PM)", orders: 456, revenue: 8900, utilization: 78 },
        { name: "Dinner (7-9 PM)", orders: 623, revenue: 15200, utilization: 92 },
        { name: "Late Night (9-11 PM)", orders: 234, revenue: 4500, utilization: 45 },
      ],
    },
  ]

  const trendAnalysis = [
    {
      metric: "Revenue Trend",
      current: 45280,
      previous: 40250,
      change: 12.5,
      trend: "up",
      forecast: 48500,
    },
    {
      metric: "Order Volume",
      current: 1847,
      previous: 1702,
      change: 8.5,
      trend: "up",
      forecast: 1950,
    },
    {
      metric: "Customer Retention",
      current: 68,
      previous: 65,
      change: 4.6,
      trend: "up",
      forecast: 72,
    },
    {
      metric: "Average Rating",
      current: 4.6,
      previous: 4.4,
      change: 4.5,
      trend: "up",
      forecast: 4.7,
    },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
    toast({ title: "Insights refreshed!", description: "Latest data has been loaded" })
  }

  const handleTakeAction = (insight: any) => {
    toast({
      title: "Action initiated",
      description: `Working on: ${insight.title}`,
    })
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-red-50 text-red-700 border-red-200"
      case "new":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "recommended":
        return "bg-green-50 text-green-700 border-green-200"
      case "upcoming":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pricing":
        return <DollarSign className="h-4 w-4" />
      case "menu":
        return <Utensils className="h-4 w-4" />
      case "service":
        return <Users className="h-4 w-4" />
      case "inventory":
        return <ShoppingCart className="h-4 w-4" />
      case "seasonal":
        return <Calendar className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getChangeColor = (change: number) => {
    return change > 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <NavigationDrawer />
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">Business Insights</h1>
              <p className="text-xs text-gray-500 truncate">AI-powered analytics and recommendations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1D</SelectItem>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
                <SelectItem value="90d">90D</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 px-2 text-xs bg-transparent"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Revenue</div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${overviewMetrics.totalRevenue.toLocaleString()}
                  </div>
                  <div className={`text-xs flex items-center ${getChangeColor(overviewMetrics.revenueChange)}`}>
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {overviewMetrics.revenueChange}%
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Orders</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {overviewMetrics.totalOrders.toLocaleString()}
                  </div>
                  <div className={`text-xs flex items-center ${getChangeColor(overviewMetrics.ordersChange)}`}>
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {overviewMetrics.ordersChange}%
                  </div>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">AOV</div>
                  <div className="text-lg font-semibold text-gray-900">${overviewMetrics.avgOrderValue}</div>
                  <div className={`text-xs flex items-center ${getChangeColor(overviewMetrics.aovChange)}`}>
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {overviewMetrics.aovChange}%
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Rating</div>
                  <div className="text-lg font-semibold text-gray-900">{overviewMetrics.customerSatisfaction}</div>
                  <div className={`text-xs flex items-center ${getChangeColor(overviewMetrics.satisfactionChange)}`}>
                    <ArrowUp className="h-3 w-3 mr-1" />+{overviewMetrics.satisfactionChange}
                  </div>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-100 rounded-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ai-insights" className="relative">
                AI Insights
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="m-0">
              <div className="p-4 space-y-6">
                <div className="text-sm text-gray-600 mb-4">
                  High-level overview of your restaurant's key performance indicators
                </div>

                {/* Quick Actions */}
                <Card className="border border-gray-100 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <Zap className="h-4 w-4 mr-2" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Button variant="outline" className="h-16 flex-col gap-2 bg-transparent">
                        <Eye className="h-5 w-5" />
                        <span className="text-xs">View Reports</span>
                      </Button>
                      <Dialog open={showChartsDialog} onOpenChange={setShowChartsDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="h-16 flex-col gap-2 bg-transparent">
                            <BarChart3 className="h-5 w-5" />
                            <span className="text-xs">Advanced Charts</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Advanced Analytics Charts</DialogTitle>
                          </DialogHeader>
                          {/* Placeholder for AdvancedCharts component */}
                          <div className="p-4">Advanced Charts Component Placeholder</div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" className="h-16 flex-col gap-2 bg-transparent">
                        <Download className="h-5 w-5" />
                        <span className="text-xs">Export Data</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col gap-2 bg-transparent">
                        <Filter className="h-5 w-5" />
                        <span className="text-xs">Custom Filter</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Insights Summary */}
                <Card className="border border-gray-100 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Top Insights Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aiInsights.slice(0, 3).map((insight) => (
                        <div key={insight.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg">{getCategoryIcon(insight.category)}</div>
                            <div>
                              <div className="font-medium text-sm text-gray-900">{insight.title}</div>
                              <div className="text-xs text-gray-600">
                                Potential: ${Math.abs(insight.potential_value)}/month
                              </div>
                            </div>
                          </div>
                          <Badge className={`text-xs ${getStatusColor(insight.status)}`}>{insight.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="ai-insights" className="m-0">
              <div className="p-4 space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  AI-powered insights and recommendations to optimize your business
                </div>
                <div className="space-y-4">
                  {aiInsights.map((insight) => (
                    <Card key={insight.id} className="border border-gray-100 bg-white">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                                {getCategoryIcon(insight.category)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-gray-900 text-sm">{insight.title}</h3>
                                  <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                                    {insight.impact} impact
                                  </Badge>
                                  <Badge className={`text-xs ${getStatusColor(insight.status)}`}>
                                    {insight.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed mb-3">{insight.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <Target className="h-3 w-3 mr-1" />
                                    {insight.confidence}% confidence
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {insight.estimated_time}
                                  </div>
                                  <div
                                    className={`font-medium ${insight.potential_value > 0 ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {insight.potential_value > 0 ? "+" : ""}${Math.abs(insight.potential_value)}/month
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {insight.action_required && (
                            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                              <Button variant="outline" size="sm" className="text-xs bg-transparent">
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                              <Button
                                onClick={() => handleTakeAction(insight)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                size="sm"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Take Action
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="m-0">
              <div className="p-4 space-y-6">
                <div className="text-sm text-gray-600 mb-4">
                  Detailed performance analysis across different business areas
                </div>
                <div className="space-y-6">
                  {performanceMetrics.map((section, index) => (
                    <Card key={index} className="border border-gray-100 bg-white">
                      <CardHeader>
                        <CardTitle className="text-base">{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {section.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <div className="font-medium text-sm text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-600">
                                  {section.title.includes("Customer")
                                    ? `${item.count} customers`
                                    : section.title.includes("Peak")
                                      ? `${item.orders} orders`
                                      : `${item.orders} orders`}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-sm text-gray-900">
                                  ${section.title.includes("Customer") ? item.value : item.revenue}
                                </div>
                                <div
                                  className={`text-xs flex items-center justify-end ${
                                    section.title.includes("Peak")
                                      ? "text-blue-600"
                                      : getChangeColor(item.growth || item.utilization)
                                  }`}
                                >
                                  {section.title.includes("Peak") ? (
                                    <>{item.utilization}% utilization</>
                                  ) : (
                                    <>
                                      {getTrendIcon(item.growth > 0 ? "up" : "down")}
                                      <span className="ml-1">{Math.abs(item.growth)}%</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="m-0">
              <div className="p-4 space-y-6">
                <div className="text-sm text-gray-600 mb-4">
                  Historical trends and future forecasts for key business metrics
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trendAnalysis.map((trend, index) => (
                    <Card key={index} className="border border-gray-100 bg-white">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 text-sm">{trend.metric}</h3>
                            {getTrendIcon(trend.trend)}
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Current</span>
                              <span className="font-semibold text-gray-900">
                                {trend.metric.includes("Revenue") || trend.metric.includes("Rating")
                                  ? trend.metric.includes("Revenue")
                                    ? `$${trend.current.toLocaleString()}`
                                    : trend.current
                                  : trend.metric.includes("Retention")
                                    ? `${trend.current}%`
                                    : trend.current.toLocaleString()}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Previous</span>
                              <span className="text-gray-600">
                                {trend.metric.includes("Revenue") || trend.metric.includes("Rating")
                                  ? trend.metric.includes("Revenue")
                                    ? `$${trend.previous.toLocaleString()}`
                                    : trend.previous
                                  : trend.metric.includes("Retention")
                                    ? `${trend.previous}%`
                                    : trend.previous.toLocaleString()}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Change</span>
                              <span className={`text-xs font-medium ${getChangeColor(trend.change)}`}>
                                +{trend.change}%
                              </span>
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-blue-600">Forecast</span>
                                <span className="font-semibold text-blue-600">
                                  {trend.metric.includes("Revenue") || trend.metric.includes("Rating")
                                    ? trend.metric.includes("Revenue")
                                      ? `$${trend.forecast.toLocaleString()}`
                                      : trend.forecast
                                    : trend.metric.includes("Retention")
                                      ? `${trend.forecast}%`
                                      : trend.forecast.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
