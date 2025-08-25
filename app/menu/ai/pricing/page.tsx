"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, DollarSign, Sparkles, Check, X, TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"

const useToast = () => {
  const toast = (options: any) => {
    console.log("Toast:", options)
  }
  return { toast }
}

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  isOutOfStock: boolean
  popularity: "high" | "medium" | "low"
  profitability: "high" | "medium" | "low"
  orders: number
  revenue: number
  rating: number
  trend: "up" | "down" | "stable"
  trendValue: number
  revenueChange: number
  variants: any[]
  modifiers: any[]
  nutritionalInfo: any
  allergens: string[]
  dietaryTags: string[]
  preparationTime?: number
  spiceLevel?: number
  costPrice?: number
  sortOrder: number
}

type Category = {
  id: string
  name: string
  items: MenuItem[]
  sortOrder: number
}

type PricingUpdate = {
  itemId: string
  itemName: string
  before: number
  after: number
  change: number
  changePercent: number
  reason: string
  impact: "increase" | "decrease"
  confidence: "high" | "medium" | "low"
}

export default function AIPricingPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [categories, setCategories] = useState<Category[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [updates, setUpdates] = useState<PricingUpdate[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)

  useEffect(() => {
    try {
      const menuData = localStorage.getItem("currentMenuData")
      if (menuData) {
        setCategories(JSON.parse(menuData))
      } else {
        setCategories([
          {
            id: "1",
            name: "Main Course",
            sortOrder: 1,
            items: [
              {
                id: "1",
                name: "Butter Chicken",
                description: "Creamy tomato-based curry with tender chicken",
                price: 18.99,
                category: "Main Course",
                isOutOfStock: false,
                popularity: "high",
                profitability: "high",
                orders: 156,
                revenue: 2962.44,
                rating: 4.7,
                trend: "up",
                trendValue: 12,
                revenueChange: 15.2,
                sortOrder: 1,
                variants: [],
                modifiers: [],
                nutritionalInfo: {},
                allergens: ["Dairy"],
                dietaryTags: ["Popular"],
                preparationTime: 15,
                spiceLevel: 3,
                costPrice: 8.5,
              },
              {
                id: "2",
                name: "Margherita Pizza",
                description: "Classic pizza with fresh mozzarella and basil",
                price: 16.5,
                category: "Pizza",
                isOutOfStock: false,
                popularity: "high",
                profitability: "high",
                orders: 203,
                revenue: 3349.5,
                rating: 4.8,
                trend: "up",
                trendValue: 18,
                revenueChange: 22.3,
                sortOrder: 1,
                variants: [],
                modifiers: [],
                nutritionalInfo: {},
                allergens: ["Dairy", "Gluten"],
                dietaryTags: ["Vegetarian", "Popular"],
                preparationTime: 18,
                spiceLevel: 0,
                costPrice: 6.25,
              },
            ],
          },
        ])
      }
    } catch (error) {
      console.error("Error loading menu data:", error)
    }
  }, [])

  const allItems = categories.flatMap((cat) => cat.items)

  const handleGenerate = async () => {
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 2500))

    const mockUpdates: PricingUpdate[] = []

    allItems.forEach((item) => {
      let newPrice = item.price
      let reason = ""
      let confidence: "high" | "medium" | "low" = "medium"

      if (item.popularity === "high" && item.rating >= 4.5) {
        const increase = item.price * 0.15
        newPrice = item.price + increase
        reason = "High demand and excellent ratings support premium pricing"
        confidence = "high"
      } else if (item.popularity === "low" && item.orders < 50) {
        const decrease = item.price * 0.12
        newPrice = item.price - decrease
        reason = "Lower price could increase demand for underperforming item"
        confidence = "medium"
      } else if (item.trend === "up" && item.trendValue > 10) {
        const increase = item.price * 0.08
        newPrice = item.price + increase
        reason = "Strong upward trend indicates market acceptance of higher pricing"
        confidence = "high"
      } else if (item.profitability === "high" && item.costPrice) {
        const margin = (item.price - item.costPrice) / item.price
        if (margin > 0.6) {
          const increase = item.price * 0.1
          newPrice = item.price + increase
          reason = "High profit margins allow for strategic price optimization"
          confidence = "medium"
        }
      } else if (item.category === "Pizza" && item.rating > 4.0) {
        const increase = item.price * 0.06
        newPrice = item.price + increase
        reason = "Pizza category shows strong performance, supporting price increase"
        confidence = "medium"
      }

      if (Math.abs(newPrice - item.price) > 0.5) {
        const change = newPrice - item.price
        const changePercent = (change / item.price) * 100

        mockUpdates.push({
          itemId: item.id,
          itemName: item.name,
          before: item.price,
          after: Number(newPrice.toFixed(2)),
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(1)),
          reason: reason,
          impact: change > 0 ? "increase" : "decrease",
          confidence: confidence,
        })
      }
    })

    setUpdates(mockUpdates)
    setHasGenerated(true)
    setIsGenerating(false)

    toast({
      title: "Pricing analysis complete!",
      description: `Found ${mockUpdates.length} optimization opportunities`,
    })
  }

  const handleApplyAll = () => {
    const updatedCategories = categories.map((category) => ({
      ...category,
      items: category.items.map((item) => {
        const update = updates.find((u) => u.itemId === item.id)
        return update ? { ...item, price: update.after } : item
      }),
    }))

    localStorage.setItem("currentMenuData", JSON.stringify(updatedCategories))
    setCategories(updatedCategories)

    toast({
      title: "All pricing updates applied!",
      description: `Updated prices for ${updates.length} items`,
    })

    setTimeout(() => {
      router.push("/menu")
    }, 1000)
  }

  const handleApplyIndividual = (updateId: string) => {
    const update = updates.find((u) => u.itemId === updateId)
    if (!update) return

    const updatedCategories = categories.map((category) => ({
      ...category,
      items: category.items.map((item) => (item.id === updateId ? { ...item, price: update.after } : item)),
    }))

    localStorage.setItem("currentMenuData", JSON.stringify(updatedCategories))
    setCategories(updatedCategories)

    setUpdates((prev) => prev.filter((u) => u.itemId !== updateId))

    toast({
      title: "Price updated!",
      description: `${update.itemName} price changed to $${update.after}`,
    })
  }

  const handleRejectIndividual = (updateId: string) => {
    const update = updates.find((u) => u.itemId === updateId)
    setUpdates((prev) => prev.filter((u) => u.itemId !== updateId))

    toast({
      title: "Price change rejected",
      description: `Kept original price for ${update?.itemName}`,
    })
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "bg-green-100 text-green-700 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">AI Pricing</h1>
              <p className="text-xs text-gray-500 truncate">Optimize prices with AI recommendations</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-blue-600" />
              Generate Pricing Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                AI will analyze your menu performance, popularity trends, and profitability to suggest optimal pricing
                strategies that maximize revenue while maintaining customer satisfaction.
              </p>
              <Button onClick={handleGenerate} disabled={isGenerating || allItems.length === 0} className="w-full">
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Pricing Opportunities...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Pricing ({allItems.length} items)
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {hasGenerated && (
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Pricing Recommendations ({updates.length} items)
                </div>
                {updates.length > 0 && (
                  <Button onClick={handleApplyAll} className="bg-gray-900 text-white hover:bg-gray-700">
                    Apply All
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {updates.length > 0 ? (
                <div className="space-y-4">
                  {updates.map((update) => (
                    <div key={update.itemId} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                      <div className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="font-medium text-sm text-gray-900">{update.itemName}</h4>
                              <Badge className={`text-xs ${getConfidenceColor(update.confidence)}`}>
                                {update.confidence} confidence
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{update.reason}</p>
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              onClick={() => handleApplyIndividual(update.itemId)}
                              size="sm"
                              className="bg-gray-900 text-white hover:bg-gray-700"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Apply
                            </Button>
                            <Button
                              onClick={() => handleRejectIndividual(update.itemId)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-gray-500">Current: </span>
                              <span className="font-medium">${update.before.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {update.impact === "increase" ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm font-medium">${update.after.toFixed(2)}</span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  update.impact === "increase"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {update.changePercent > 0 ? "+" : ""}
                                {update.changePercent}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No pricing optimization opportunities found.</p>
                  <p className="text-xs text-gray-400 mt-1">Your current pricing appears to be well-optimized.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
