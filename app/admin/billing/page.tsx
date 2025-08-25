"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  DollarSign,
  CreditCard,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Activity,
  Zap,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export default function AdminBillingPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [billingData, setBillingData] = useState<any>(null)

  useEffect(() => {
    loadBillingData()
  }, [])

  const loadBillingData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/v1/admin/billing")
      const result = await response.json()

      if (result.success) {
        setBillingData(result.data)
        toast({
          title: "Billing Data Loaded",
          description: "Phase 0 billing overview loaded successfully.",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("[v0] Failed to load billing data:", error)
      toast({
        title: "Loading Error",
        description: "Failed to load billing data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
      case "trialing":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Trial</Badge>
      case "inactive":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Inactive</Badge>
      default:
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Unknown</Badge>
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "phase0_trial":
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Phase 0 Trial</Badge>
      case "starter":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Starter</Badge>
      case "professional":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Professional</Badge>
      case "enterprise":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Enterprise</Badge>
      default:
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">No Plan</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing data...</p>
        </div>
      </div>
    )
  }

  if (!billingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load billing data</p>
          <Button onClick={loadBillingData} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const { metrics, restaurants, phase0Config } = billingData

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                ← Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Billing Management</h1>
              <p className="text-sm text-gray-500">Phase 0 billing overview and management</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-purple-50 text-purple-700 border-purple-200">Phase 0 Active</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Phase 0 Overview */}
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Phase 0 Trial Program</h3>
                <p className="text-sm text-purple-700">
                  90-day free trial for {phase0Config.maxTestRestaurants} test restaurants
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-purple-900">{metrics.phase0Restaurants}</div>
                <div className="text-sm text-purple-700">Trial Restaurants</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">{phase0Config.trialPeriodDays}</div>
                <div className="text-sm text-purple-700">Trial Days</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">{phase0Config.testPlanLimits.aiGenerations}</div>
                <div className="text-sm text-purple-700">AI Generations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">{phase0Config.testPlanLimits.integrations}</div>
                <div className="text-sm text-purple-700">Integrations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Total Subscriptions</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.totalSubscriptions}</div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Phase 0 launch</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Active Subscriptions</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.activeSubscriptions}</div>
              <div className="flex items-center space-x-1 mt-1">
                <Activity className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">All healthy</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Trial Subscriptions</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.trialSubscriptions}</div>
              <div className="flex items-center space-x-1 mt-1">
                <Calendar className="h-3 w-3 text-purple-600" />
                <span className="text-xs text-purple-600">90 days remaining</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Projected Revenue</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${(metrics.phase0Restaurants * 149).toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <BarChart3 className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Post-trial estimate</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Restaurant Billing Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Restaurant Billing Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {restaurants.map((restaurant: any) => (
                <div
                  key={restaurant.restaurantId}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{restaurant.restaurantName}</h3>
                      <p className="text-sm text-gray-500">{restaurant.userEmail}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          AI: {restaurant.usage.aiGenerations}/{phase0Config.testPlanLimits.aiGenerations}
                        </span>
                        <span className="text-xs text-gray-500">
                          Campaigns: {restaurant.usage.campaigns}/{phase0Config.testPlanLimits.campaigns}
                        </span>
                        <span className="text-xs text-gray-500">
                          Menu Items: {restaurant.usage.menuItems}/{phase0Config.testPlanLimits.menuItems}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getPlanBadge(restaurant.plan)}
                    {getStatusBadge(restaurant.status)}
                    {restaurant.isPhase0 && (
                      <Badge className="bg-purple-50 text-purple-700 border-purple-200">Phase 0</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
