"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/auth-provider"
import {
  Star,
  ChefHat,
  Brain,
  Megaphone,
  BarChart3,
  Target,
  Users,
  Activity,
  DollarSign,
  UserPlus,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  revenue: { value: string; change: string; trend: string }
  customers: { value: string; change: string; trend: string }
  orders: { value: string; change: string; trend: string }
  rating: { value: string; change: string; trend: string }
}

interface ActivityItem {
  id: string
  type: string
  title: string
  description: string
  time: string
  icon: any
}

interface AIInsight {
  title: string
  description: string
  priority: string
  action: string
  module: string
  icon: any
}

export default function DashboardPage() {
  console.log("[v0] Dashboard component rendering")

  const { toast } = useToast()
  const { user, loading: authLoading, isDemo } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [restaurantName, setRestaurantName] = useState("Demo Restaurant")

  useEffect(() => {
    console.log("[v0] Dashboard useEffect - authLoading:", authLoading, "user:", !!user, "isDemo:", isDemo)

    if (authLoading) return

    const loadDashboardData = async () => {
      try {
        console.log("[v0] Attempting to load real dashboard data from API")
        const response = await fetch("/api/v1/dashboard/stats")

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Successfully loaded real data from API")

          setStats(data.stats)
          setRecentActivity(data.recentActivity || [])
          setAiInsights(data.aiInsights || [])
          setRestaurantName(data.restaurantName || "Demo Restaurant")
          setLoading(false)

          if (isDemo) {
            toast({
              title: "Real Data Loaded",
              description: `Showing real data for ${data.restaurantName}. This is connected to your database!`,
            })
          }
          return
        } else {
          console.log("[v0] API failed with status:", response.status)
          throw new Error(`API failed with status ${response.status}`)
        }
      } catch (error) {
        console.log("[v0] API failed, using fallback demo data:", error)
        loadDemoData()
      }
    }

    const loadDemoData = () => {
      console.log("[v0] Loading fallback demo data")
      setStats({
        revenue: { value: "$28,475", change: "+12.5%", trend: "up" },
        customers: { value: "127", change: "+15.2%", trend: "up" },
        orders: { value: "284", change: "+8.3%", trend: "up" },
        rating: { value: "4.2", change: "+0.1", trend: "up" },
      })

      setRecentActivity([
        {
          id: "demo-1",
          type: "order",
          title: "New Order",
          description: "$52.40 from Sarah Johnson",
          time: "5 minutes ago",
          icon: ShoppingCart,
        },
        {
          id: "demo-2",
          type: "review",
          title: "New Review",
          description: "5★ - Amazing food and great service!",
          time: "12 minutes ago",
          icon: Star,
        },
        {
          id: "demo-3",
          type: "customer",
          title: "New Customer",
          description: "Mike Chen joined",
          time: "1 hour ago",
          icon: UserPlus,
        },
      ])

      setAiInsights([
        {
          title: "Menu Optimization",
          description: "Demo: Margherita Pizza shows high demand. Consider featuring it more prominently.",
          priority: "high",
          action: "Review Menu",
          module: "menu",
          icon: ChefHat,
        },
        {
          title: "Customer Insights",
          description: "Demo: AI analysis shows peak ordering times and customer preferences.",
          priority: "medium",
          action: "View Insights",
          module: "customers",
          icon: Users,
        },
        {
          title: "Social Media Campaign",
          description: "Demo: Your Instagram posts are performing well. Consider increasing posting frequency.",
          priority: "low",
          action: "View Campaigns",
          module: "campaigns",
          icon: Megaphone,
        },
      ])

      setRestaurantName("Demo Restaurant")
      setLoading(false)

      toast({
        title: "Demo Mode Active",
        description: "Using fallback demo data. Connect to database for real insights!",
      })
    }

    loadDashboardData()
  }, [authLoading, user, isDemo, toast])

  console.log("[v0] Dashboard render state - authLoading:", authLoading, "loading:", loading, "user:", !!user)

  if (authLoading || loading) {
    console.log("[v0] Showing loading state")
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  console.log("[v0] Rendering main dashboard content")

  const quickStats = [
    {
      label: "Revenue",
      value: stats?.revenue.value || "$0",
      change: stats?.revenue.change || "0%",
      trend: stats?.revenue.trend || "up",
      icon: DollarSign,
      description: "Last 30 days" + (isDemo ? " (Demo)" : ""),
    },
    {
      label: "New Customers",
      value: stats?.customers.value || "0",
      change: stats?.customers.change || "0%",
      trend: stats?.customers.trend || "up",
      icon: UserPlus,
      description: "Last 30 days" + (isDemo ? " (Demo)" : ""),
    },
    {
      label: "Total Orders",
      value: stats?.orders.value || "0",
      change: stats?.orders.change || "0%",
      trend: stats?.orders.trend || "up",
      icon: Activity,
      description: "Last 30 days" + (isDemo ? " (Demo)" : ""),
    },
    {
      label: "Avg Rating",
      value: stats?.rating.value || "0",
      change: stats?.rating.change || "0",
      trend: stats?.rating.trend || "up",
      icon: Star,
      description: "Last 30 days" + (isDemo ? " (Demo)" : ""),
    },
  ]

  const modules = [
    {
      title: "Menu Engineering",
      description: "Optimize pricing and identify bestsellers",
      icon: ChefHat,
      href: "/menu",
      stats: { primary: "86", secondary: "Menu score" },
      status: "active",
      insights: "5 optimization suggestions",
    },
    {
      title: "Reviews Intelligence",
      description: "AI-powered review management across all platforms",
      icon: Star,
      href: "/reviews",
      stats: { primary: "4.2★", secondary: "1,247 reviews" },
      status: "active",
      insights: "68% positive sentiment",
    },
    {
      title: "Marketing Hub",
      description: "Create campaigns with AI content generation",
      icon: Megaphone,
      href: "/marketing",
      stats: { primary: "5", secondary: "Active campaigns" },
      status: "active",
      insights: "3 campaigns need attention",
    },
    {
      title: "Campaign Management",
      description: "Manage social media campaigns and automation",
      icon: Target,
      href: "/dashboard/campaigns",
      stats: { primary: "3", secondary: "Active campaigns" },
      status: "active",
      insights: "15.4K total reach this month",
    },
    {
      title: "Customer Intelligence",
      description: "Understand behavior and predict churn",
      icon: Brain,
      href: "/customers",
      stats: { primary: "89%", secondary: "Retention rate" },
      status: "active",
      insights: "58 customers at risk",
    },
    {
      title: "Performance Analytics",
      description: "Track revenue and operational metrics",
      icon: BarChart3,
      href: "/analytics",
      stats: { primary: "$284K", secondary: "Revenue" },
      status: "active",
      insights: "23% increase this month",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-l-red-400"
      case "medium":
        return "bg-yellow-50 border-l-yellow-400"
      case "low":
        return "bg-blue-50 border-l-blue-400"
      default:
        return "bg-gray-50 border-l-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {restaurantName}</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Here's what's happening with your restaurant today
          </p>
          {isDemo && <Badge className="mt-2 bg-blue-50 text-blue-700 border-blue-200">Demo Mode Active</Badge>}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.label}</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{stat.description}</p>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-600 mb-1 sm:mb-2" />
                      <span
                        className={`text-xs sm:text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* AI Insights */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              {aiInsights.map((insight, index) => {
                const IconComponent = insight.icon
                return (
                  <div key={index} className={`p-3 sm:p-4 rounded-lg border-l-4 ${getPriorityColor(insight.priority)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base">{insight.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">{insight.description}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 text-white hover:bg-blue-700 flex-shrink-0 text-xs sm:text-sm"
                      >
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {modules.map((module, index) => {
            const IconComponent = module.icon
            return (
              <Link key={index} href={module.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">Active</Badge>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{module.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{module.stats.primary}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{module.stats.secondary}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm text-blue-600">{module.insights}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity, index) => {
                const IconComponent =
                  typeof activity.icon === "string"
                    ? activity.icon === "ShoppingCart"
                      ? ShoppingCart
                      : activity.icon === "Star"
                        ? Star
                        : activity.icon === "UserPlus"
                          ? UserPlus
                          : Activity
                    : activity.icon
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{activity.description}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{activity.time}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
