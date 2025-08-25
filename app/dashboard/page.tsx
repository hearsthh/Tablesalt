"use client"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/auth-provider"
import { useRouter } from "next/navigation"
import {
  Star,
  ChefHat,
  Brain,
  Megaphone,
  BarChart3,
  Target,
  Settings,
  Users,
  Activity,
  DollarSign,
  UserPlus,
  ShoppingCart,
} from "lucide-react"

export default function DashboardPage() {
  console.log("[v0] Dashboard component rendering")

  const { toast } = useToast()
  const { user, loading: authLoading, isDemo } = useAuth()
  const router = useRouter()

  const [dashboardData, setDashboardData] = useState({
    quickStats: [],
    recentActivity: [],
    aiInsights: [],
    restaurant: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] Dashboard useEffect - authLoading:", authLoading, "user:", !!user, "isDemo:", isDemo)

    if (!authLoading) {
      loadDashboardData()
    }
  }, [authLoading, user, isDemo])

  const loadDashboardData = async () => {
    console.log("[v0] Loading dashboard data - isDemo:", isDemo)

    try {
      setLoading(true)

      console.log("[v0] Using demo data for v0 preview")
      setDashboardData({
        quickStats: [
          {
            label: "Revenue",
            value: "$28,475",
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
            description: "Last 30 days (Demo)",
          },
          {
            label: "New Customers",
            value: "127",
            change: "+15.2%",
            trend: "up",
            icon: UserPlus,
            description: "Last 30 days (Demo)",
          },
          {
            label: "Total Orders",
            value: "284",
            change: "+8.3%",
            trend: "up",
            icon: Activity,
            description: "Last 30 days (Demo)",
          },
          {
            label: "Avg Rating",
            value: "4.2",
            change: "+0.1",
            trend: "up",
            icon: Star,
            description: "Last 30 days (Demo)",
          },
        ],
        recentActivity: [
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
        ],
        aiInsights: [
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
        ],
        restaurant: {
          id: "demo_001",
          name: "Demo Restaurant",
          status: "demo",
        },
      })

      toast({
        title: "Demo Mode Active",
        description: "Viewing sample restaurant data. Perfect for testing all features!",
      })

      console.log("[v0] Demo data loaded successfully")
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error loading dashboard data:", error)
      setLoading(false)
    }
  }

  console.log("[v0] Dashboard render state - authLoading:", authLoading, "loading:", loading, "user:", !!user)

  if (authLoading) {
    console.log("[v0] Showing auth loading state")
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    console.log("[v0] Showing data loading state")
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  console.log("[v0] Rendering main dashboard content")

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
    {
      title: "Restaurant Profile",
      description: "Manage restaurant information and settings",
      icon: Settings,
      href: "/restaurant-profile",
      stats: { primary: "100%", secondary: "Complete" },
      status: "active",
      insights: "Profile up to date",
    },
  ]

  const { quickStats, recentActivity, aiInsights, restaurant } = dashboardData

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1 rounded-md">Active</Badge>
        )
      case "new":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-1 rounded-md">New</Badge>
      case "coming_soon":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs px-2 py-1 rounded-md">
            Coming Soon
          </Badge>
        )
      default:
        return null
    }
  }

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {restaurant?.name || "Restaurant Owner"}</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your restaurant today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.description}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <IconComponent className="h-8 w-8 text-blue-600 mb-2" />
                    <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-600" />
              AI Insights
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {aiInsights.map((insight, index) => {
                const IconComponent = insight.icon
                return (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(insight.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <IconComponent className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">{insight.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        </div>
                      </div>
                      <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                        {insight.action}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module, index) => {
            const IconComponent = module.icon
            return (
              <a
                key={index}
                href={module.href}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 block"
              >
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                  {getStatusBadge(module.status)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{module.stats.primary}</p>
                    <p className="text-sm text-gray-500">{module.stats.secondary}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600">{module.insights}</p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const IconComponent = activity.icon
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
