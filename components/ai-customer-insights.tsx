"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, AlertTriangle, Target, Sparkles, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CustomerInsight {
  type: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  confidence: number
  impact: string
  action_items: string[]
}

interface AICustomerInsightsProps {
  restaurantId: string
}

export function AICustomerInsights({ restaurantId }: AICustomerInsightsProps) {
  const { toast } = useToast()
  const [insights, setInsights] = useState<CustomerInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadInsights()
  }, [restaurantId])

  const loadInsights = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading AI customer insights...")

      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockInsights: CustomerInsight[] = [
        {
          type: "churn_risk",
          title: "High-Value Customers at Risk",
          description:
            "15 customers who spent $500+ haven't visited in 45+ days. Immediate action needed to prevent churn.",
          priority: "high",
          confidence: 0.89,
          impact: "Potential $7,500 revenue loss",
          action_items: [
            "Send personalized win-back email with 20% discount",
            "Call top 5 customers personally",
            "Offer exclusive chef's table experience",
          ],
        },
        {
          type: "upsell_opportunity",
          title: "Wine Pairing Opportunity",
          description:
            "68% of pasta dish orders don't include wine. Customers show interest in Italian wines based on reviews.",
          priority: "medium",
          confidence: 0.76,
          impact: "Potential $2,400/month increase",
          action_items: [
            "Train staff on wine recommendations",
            "Create pasta + wine combo offers",
            "Add wine pairing suggestions to menu",
          ],
        },
        {
          type: "loyalty_program",
          title: "Loyalty Program Effectiveness",
          description:
            "Gold tier customers visit 3x more frequently and spend 40% more per visit than regular customers.",
          priority: "low",
          confidence: 0.94,
          impact: "Program ROI: 285%",
          action_items: [
            "Promote loyalty program to new customers",
            "Add tier-specific perks",
            "Create referral bonuses",
          ],
        },
        {
          type: "seasonal_trend",
          title: "Weekend Dinner Rush Optimization",
          description:
            "Friday-Saturday 7-9pm shows 23% higher demand but 15% longer wait times. Customer satisfaction drops during peak.",
          priority: "high",
          confidence: 0.82,
          impact: "Customer satisfaction improvement",
          action_items: [
            "Add weekend dinner reservations",
            "Increase kitchen staff on weekends",
            "Create express menu for peak hours",
          ],
        },
      ]

      setInsights(mockInsights)

      toast({
        title: "AI Insights Updated",
        description: `Generated ${mockInsights.length} customer insights`,
      })
    } catch (error) {
      console.error("[v0] Failed to load customer insights:", error)
      toast({
        title: "Insights Error",
        description: "Failed to load AI insights. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshInsights = async () => {
    setRefreshing(true)
    await loadInsights()
    setRefreshing(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "medium":
        return <Target className="h-4 w-4 text-yellow-600" />
      case "low":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      default:
        return <Brain className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Customer Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-sm text-gray-600">Analyzing customer data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Customer Insights
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refreshInsights} disabled={refreshing}>
            {refreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <Card key={index} className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {getPriorityIcon(insight.priority)}
                    <h3 className="font-medium text-sm">{insight.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className={getPriorityColor(insight.priority)}>{insight.priority}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700">{insight.description}</p>

                {/* Impact */}
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{insight.impact}</span>
                </div>

                {/* Confidence Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">AI Confidence</span>
                    <span className="font-medium">{Math.round(insight.confidence * 100)}%</span>
                  </div>
                  <Progress value={insight.confidence * 100} className="h-2" />
                </div>

                {/* Action Items */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Recommended Actions</h4>
                  <div className="space-y-1">
                    {insight.action_items.slice(0, 2).map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full flex-shrink-0" />
                        <span className="text-xs text-gray-700">{action}</span>
                      </div>
                    ))}
                    {insight.action_items.length > 2 && (
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                        <span className="text-xs text-gray-500">+{insight.action_items.length - 2} more actions</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {insights.length === 0 && (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No insights available</h3>
            <p className="text-xs text-gray-500">AI insights will appear as customer data is analyzed</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
