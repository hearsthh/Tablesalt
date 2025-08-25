"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Play, TrendingUp, Target, BarChart3 } from "lucide-react"
import { enhancedApiClient } from "@/lib/api/enhanced-api-client"

interface TestResult {
  name: string
  status: "pending" | "running" | "passed" | "failed"
  details?: string
  duration?: number
}

export default function TestMarketingPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Marketing Data Loading", status: "pending" },
    { name: "Campaign Performance Metrics", status: "pending" },
    { name: "Channel Analytics", status: "pending" },
    { name: "ROI Calculations", status: "pending" },
    { name: "Dashboard Analytics", status: "pending" },
    { name: "Business Intelligence", status: "pending" },
    { name: "Customer Segmentation Integration", status: "pending" },
    { name: "Performance Tracking", status: "pending" },
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [marketingData, setMarketingData] = useState<any>(null)

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests((prev) => prev.map((test, i) => (i === index ? { ...test, ...updates } : test)))
  }

  const runMarketingTests = async () => {
    setIsRunning(true)
    const restaurantId = "test-restaurant-id"

    // Test 1: Marketing Data Loading
    updateTest(0, { status: "running" })
    const marketingStartTime = Date.now()
    try {
      const marketingData = await enhancedApiClient.getMarketingData(restaurantId)
      const hasMarketingData = marketingData && Object.keys(marketingData).length > 0
      const hasCampaigns = marketingData.campaigns && marketingData.campaigns.length > 0
      const hasPerformance = marketingData.performance && Object.keys(marketingData.performance).length > 0

      setMarketingData(marketingData)

      updateTest(0, {
        status: hasMarketingData && hasCampaigns && hasPerformance ? "passed" : "failed",
        details: `Loaded ${marketingData.campaigns?.length || 0} campaigns with performance data`,
        duration: Date.now() - marketingStartTime,
      })
    } catch (error) {
      updateTest(0, { status: "failed", details: "Failed to load marketing data" })
    }

    // Test 2: Campaign Performance Metrics
    updateTest(1, { status: "running" })
    const performanceStartTime = Date.now()
    try {
      const marketingData = await enhancedApiClient.getMarketingData(restaurantId)
      const campaigns = marketingData.campaigns || []

      const hasValidMetrics = campaigns.every(
        (campaign) =>
          typeof campaign.openRate === "number" &&
          typeof campaign.clickRate === "number" &&
          typeof campaign.conversionRate === "number" &&
          typeof campaign.revenue === "number",
      )

      const hasReasonableValues = campaigns.every(
        (campaign) =>
          campaign.openRate >= 0 &&
          campaign.openRate <= 1 &&
          campaign.clickRate >= 0 &&
          campaign.clickRate <= 1 &&
          campaign.conversionRate >= 0 &&
          campaign.conversionRate <= 1,
      )

      const metricsValid = hasValidMetrics && hasReasonableValues

      updateTest(1, {
        status: metricsValid ? "passed" : "failed",
        details: metricsValid ? "Campaign performance metrics valid" : "Invalid performance metrics",
        duration: Date.now() - performanceStartTime,
      })
    } catch (error) {
      updateTest(1, { status: "failed", details: "Campaign performance metrics test failed" })
    }

    // Test 3: Channel Analytics
    updateTest(2, { status: "running" })
    const channelStartTime = Date.now()
    try {
      const marketingData = await enhancedApiClient.getMarketingData(restaurantId)
      const channels = marketingData.channels || {}

      const hasChannelData = Object.keys(channels).length > 0
      const hasValidChannels = ["email", "sms", "social"].some((channel) => channels[channel])
      const hasChannelMetrics = Object.values(channels).every(
        (channel: any) =>
          typeof channel.reach === "number" &&
          typeof channel.engagement === "number" &&
          typeof channel.cost === "number",
      )

      const channelAnalyticsValid = hasChannelData && hasValidChannels && hasChannelMetrics

      updateTest(2, {
        status: channelAnalyticsValid ? "passed" : "failed",
        details: `Found ${Object.keys(channels).length} marketing channels with metrics`,
        duration: Date.now() - channelStartTime,
      })
    } catch (error) {
      updateTest(2, { status: "failed", details: "Channel analytics test failed" })
    }

    // Test 4: ROI Calculations
    updateTest(3, { status: "running" })
    const roiStartTime = Date.now()
    try {
      const marketingData = await enhancedApiClient.getMarketingData(restaurantId)
      const campaigns = marketingData.campaigns || []

      const hasROIData = campaigns.every(
        (campaign) =>
          typeof campaign.cost === "number" && typeof campaign.revenue === "number" && typeof campaign.roi === "number",
      )

      const hasValidROI = campaigns.every((campaign) => {
        const calculatedROI = campaign.cost > 0 ? (campaign.revenue - campaign.cost) / campaign.cost : 0
        return Math.abs(campaign.roi - calculatedROI) < 0.01 // Allow small floating point differences
      })

      const roiValid = hasROIData && (campaigns.length === 0 || hasValidROI)

      updateTest(3, {
        status: roiValid ? "passed" : "failed",
        details: roiValid ? "ROI calculations accurate" : "ROI calculation errors",
        duration: Date.now() - roiStartTime,
      })
    } catch (error) {
      updateTest(3, { status: "failed", details: "ROI calculations test failed" })
    }

    // Test 5: Dashboard Analytics
    updateTest(4, { status: "running" })
    const dashboardStartTime = Date.now()
    try {
      const dashboardStats = await enhancedApiClient.getDashboardStats(restaurantId)

      const hasRevenue = typeof dashboardStats.revenue === "number"
      const hasCustomers = typeof dashboardStats.customers === "number"
      const hasOrders = typeof dashboardStats.orders === "number"
      const hasRating = typeof dashboardStats.rating === "number"

      const dashboardValid = hasRevenue && hasCustomers && hasOrders && hasRating

      updateTest(4, {
        status: dashboardValid ? "passed" : "failed",
        details: dashboardValid ? "Dashboard analytics data structure valid" : "Missing dashboard analytics",
        duration: Date.now() - dashboardStartTime,
      })
    } catch (error) {
      updateTest(4, { status: "failed", details: "Dashboard analytics test failed" })
    }

    // Test 6: Business Intelligence
    updateTest(5, { status: "running" })
    const biStartTime = Date.now()
    try {
      const marketingData = await enhancedApiClient.getMarketingData(restaurantId)
      const insights = marketingData.insights || []

      const hasInsights = insights.length > 0
      const hasValidInsights = insights.every(
        (insight) => insight.title && insight.description && insight.type && insight.priority,
      )

      const biValid = hasInsights && hasValidInsights

      updateTest(5, {
        status: biValid ? "passed" : "failed",
        details: `Generated ${insights.length} business insights`,
        duration: Date.now() - biStartTime,
      })
    } catch (error) {
      updateTest(5, { status: "failed", details: "Business intelligence test failed" })
    }

    // Test 7: Customer Segmentation Integration
    updateTest(6, { status: "running" })
    const segmentationStartTime = Date.now()
    try {
      const [customers, marketingData] = await Promise.all([
        enhancedApiClient.getCustomers(restaurantId),
        enhancedApiClient.getMarketingData(restaurantId),
      ])

      const customerSegments = [...new Set(customers.map((c) => c.loyaltyTier))]
      const campaignTargets = marketingData.campaigns?.map((c) => c.targetSegment).filter(Boolean) || []

      const hasSegmentation = customerSegments.length > 1
      const hasTargeting = campaignTargets.length > 0
      const validTargeting = campaignTargets.every((target) => customerSegments.includes(target))

      const segmentationValid = hasSegmentation && (campaignTargets.length === 0 || validTargeting)

      updateTest(6, {
        status: segmentationValid ? "passed" : "failed",
        details: `${customerSegments.length} segments, ${campaignTargets.length} targeted campaigns`,
        duration: Date.now() - segmentationStartTime,
      })
    } catch (error) {
      updateTest(6, { status: "failed", details: "Customer segmentation integration test failed" })
    }

    // Test 8: Performance Tracking
    updateTest(7, { status: "running" })
    const trackingStartTime = Date.now()
    try {
      const marketingData = await enhancedApiClient.getMarketingData(restaurantId)
      const performance = marketingData.performance || {}

      const hasOverallMetrics = performance.totalReach && performance.totalEngagement && performance.totalRevenue
      const hasTrends = performance.trends && Array.isArray(performance.trends)
      const hasComparisons = performance.monthOverMonth || performance.yearOverYear

      const trackingValid = hasOverallMetrics && hasTrends

      updateTest(7, {
        status: trackingValid ? "passed" : "failed",
        details: trackingValid ? "Performance tracking metrics complete" : "Missing performance tracking",
        duration: Date.now() - trackingStartTime,
      })
    } catch (error) {
      updateTest(7, { status: "failed", details: "Performance tracking test failed" })
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "running":
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return (
          <Badge variant="default" className="bg-green-500">
            Passed
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "running":
        return <Badge variant="secondary">Running</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const passedTests = tests.filter((t) => t.status === "passed").length
  const failedTests = tests.filter((t) => t.status === "failed").length
  const totalTests = tests.length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing & Analytics Features Testing</h1>
          <p className="text-gray-600">
            Comprehensive testing of marketing campaigns, performance analytics, and business intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{passedTests}</p>
                  <p className="text-sm text-gray-600">Tests Passed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{failedTests}</p>
                  <p className="text-sm text-gray-600">Tests Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Play className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{totalTests}</p>
                  <p className="text-sm text-gray-600">Total Tests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Marketing & Analytics Test Results
              <Button onClick={runMarketingTests} disabled={isRunning} className="ml-4">
                {isRunning ? "Running Tests..." : "Run Marketing Tests"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      {test.details && <p className="text-sm text-gray-600">{test.details}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {test.duration && <span className="text-xs text-gray-500">{test.duration}ms</span>}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Marketing & Analytics Test Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Campaign Management
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Campaign data loading</li>
                  <li>• Performance metrics</li>
                  <li>• ROI calculations</li>
                  <li>• Customer targeting</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics & Insights
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Channel analytics</li>
                  <li>• Dashboard metrics</li>
                  <li>• Business intelligence</li>
                  <li>• Performance tracking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Integration Features
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Customer segmentation</li>
                  <li>• Multi-channel tracking</li>
                  <li>• Revenue attribution</li>
                  <li>• Trend analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
