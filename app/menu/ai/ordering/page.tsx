"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ListOrdered, Sparkles, Check, X, ArrowUp, ArrowDown, Layers } from "lucide-react"
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

type OrderingChange = {
  categoryId: string
  categoryName: string
  beforeOrder: string[]
  afterOrder: string[]
  changes: {
    itemId: string
    itemName: string
    fromPosition: number
    toPosition: number
    reason: string
  }[]
  overallReason: string
}

type CategoryOrderingChange = {
  type: "category"
  beforeOrder: string[]
  afterOrder: string[]
  changes: {
    categoryId: string
    categoryName: string
    fromPosition: number
    toPosition: number
    reason: string
  }[]
  overallReason: string
}

export default function AIOrderingPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [categories, setCategories] = useState<Category[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [itemChanges, setItemChanges] = useState<OrderingChange[]>([])
  const [categoryChanges, setCategoryChanges] = useState<CategoryOrderingChange | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [appliedChanges, setAppliedChanges] = useState<string[]>([])

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
                id: "4",
                name: "Mushroom Risotto",
                description: "Creamy arborio rice with wild mushrooms",
                price: 19.99,
                category: "Main Course",
                isOutOfStock: false,
                popularity: "medium",
                profitability: "medium",
                orders: 67,
                revenue: 1339.33,
                rating: 4.5,
                trend: "stable",
                trendValue: 0,
                revenueChange: 2.1,
                sortOrder: 2,
                variants: [],
                modifiers: [],
                nutritionalInfo: {},
                allergens: ["Dairy", "Gluten"],
                dietaryTags: ["Vegetarian"],
                preparationTime: 20,
                spiceLevel: 1,
                costPrice: 7.25,
              },
            ],
          },
          {
            id: "2",
            name: "Pizza",
            sortOrder: 2,
            items: [
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
          {
            id: "3",
            name: "Salads",
            sortOrder: 3,
            items: [
              {
                id: "3",
                name: "Caesar Salad",
                description: "Crisp romaine lettuce with parmesan and croutons",
                price: 12.99,
                category: "Salads",
                isOutOfStock: false,
                popularity: "medium",
                profitability: "high",
                orders: 89,
                revenue: 1156.11,
                rating: 4.3,
                trend: "down",
                trendValue: -5,
                revenueChange: -3.2,
                sortOrder: 1,
                variants: [],
                modifiers: [],
                nutritionalInfo: {},
                allergens: ["Dairy", "Gluten", "Eggs"],
                dietaryTags: ["Vegetarian"],
                preparationTime: 8,
                spiceLevel: 0,
                costPrice: 4.5,
              },
            ],
          },
        ])
      }
    } catch (error) {
      console.error("Error loading menu data:", error)
    }
  }, [])

  const handleGenerate = async () => {
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 2500))

    const mockItemChanges: OrderingChange[] = []
    let mockCategoryChanges: CategoryOrderingChange | null = null

    // Generate item ordering changes
    categories.forEach((category) => {
      if (category.items.length <= 1) return

      const sortedItems = [...category.items].sort((a, b) => {
        const scoreA =
          (a.popularity === "high" ? 3 : a.popularity === "medium" ? 2 : 1) +
          (a.profitability === "high" ? 3 : a.profitability === "medium" ? 2 : 1) +
          (a.rating / 5) * 2 +
          (a.trend === "up" ? 1 : a.trend === "down" ? -1 : 0)

        const scoreB =
          (b.popularity === "high" ? 3 : b.popularity === "medium" ? 2 : 1) +
          (b.profitability === "high" ? 3 : b.profitability === "medium" ? 2 : 1) +
          (b.rating / 5) * 2 +
          (b.trend === "up" ? 1 : b.trend === "down" ? -1 : 0)

        return scoreB - scoreA
      })

      const originalOrder = category.items.map((item) => item.id)
      const newOrder = sortedItems.map((item) => item.id)

      if (JSON.stringify(originalOrder) !== JSON.stringify(newOrder)) {
        const itemChanges = []

        for (let i = 0; i < sortedItems.length; i++) {
          const item = sortedItems[i]
          const originalIndex = category.items.findIndex((origItem) => origItem.id === item.id)

          if (originalIndex !== i) {
            let reason = ""

            if (item.popularity === "high" && item.rating >= 4.5) {
              reason = "High popularity and rating - moved to top for maximum visibility"
            } else if (item.profitability === "high") {
              reason = "High profit margin - prioritized for better revenue"
            } else if (item.trend === "up") {
              reason = "Trending upward - positioned to capitalize on momentum"
            } else if (item.popularity === "low" || item.rating < 4.0) {
              reason = "Lower performance - moved down to make room for better performers"
            } else {
              reason = "Optimized based on overall performance metrics"
            }

            itemChanges.push({
              itemId: item.id,
              itemName: item.name,
              fromPosition: originalIndex + 1,
              toPosition: i + 1,
              reason: reason,
            })
          }
        }

        if (itemChanges.length > 0) {
          mockItemChanges.push({
            categoryId: category.id,
            categoryName: category.name,
            beforeOrder: originalOrder,
            afterOrder: newOrder,
            changes: itemChanges,
            overallReason: `Reordered ${itemChanges.length} items to prioritize high-performing dishes and improve menu flow`,
          })
        }
      }
    })

    // Generate category ordering changes
    const sortedCategories = [...categories].sort((a, b) => {
      const avgScoreA =
        a.items.reduce((sum, item) => {
          return (
            sum +
            ((item.popularity === "high" ? 3 : item.popularity === "medium" ? 2 : 1) +
              (item.profitability === "high" ? 3 : item.profitability === "medium" ? 2 : 1) +
              (item.rating / 5) * 2)
          )
        }, 0) / a.items.length

      const avgScoreB =
        b.items.reduce((sum, item) => {
          return (
            sum +
            ((item.popularity === "high" ? 3 : item.popularity === "medium" ? 2 : 1) +
              (item.profitability === "high" ? 3 : item.profitability === "medium" ? 2 : 1) +
              (item.rating / 5) * 2)
          )
        }, 0) / b.items.length

      return avgScoreB - avgScoreA
    })

    const originalCategoryOrder = categories.map((cat) => cat.id)
    const newCategoryOrder = sortedCategories.map((cat) => cat.id)

    if (JSON.stringify(originalCategoryOrder) !== JSON.stringify(newCategoryOrder)) {
      const categoryChangesArray = []

      for (let i = 0; i < sortedCategories.length; i++) {
        const category = sortedCategories[i]
        const originalIndex = categories.findIndex((origCat) => origCat.id === category.id)

        if (originalIndex !== i) {
          let reason = ""
          const avgRating = category.items.reduce((sum, item) => sum + item.rating, 0) / category.items.length
          const totalOrders = category.items.reduce((sum, item) => sum + item.orders, 0)

          if (avgRating >= 4.5 && totalOrders > 100) {
            reason = "High-performing category with excellent ratings and strong sales"
          } else if (totalOrders > 150) {
            reason = "High-volume category - positioned for maximum visibility"
          } else if (avgRating < 4.0) {
            reason = "Lower-rated category - moved down to prioritize better performers"
          } else {
            reason = "Optimized based on overall category performance"
          }

          categoryChangesArray.push({
            categoryId: category.id,
            categoryName: category.name,
            fromPosition: originalIndex + 1,
            toPosition: i + 1,
            reason: reason,
          })
        }
      }

      if (categoryChangesArray.length > 0) {
        mockCategoryChanges = {
          type: "category",
          beforeOrder: originalCategoryOrder,
          afterOrder: newCategoryOrder,
          changes: categoryChangesArray,
          overallReason: `Reordered ${categoryChangesArray.length} categories to prioritize high-performing sections and improve menu navigation`,
        }
      }
    }

    setItemChanges(mockItemChanges)
    setCategoryChanges(mockCategoryChanges)
    setHasGenerated(true)
    setIsGenerating(false)

    const totalChanges = mockItemChanges.length + (mockCategoryChanges ? 1 : 0)
    toast({
      title: "Menu ordering optimized!",
      description: `Found improvements for ${totalChanges} sections`,
    })
  }

  const handleApplyAll = () => {
    let updatedCategories = [...categories]

    // Apply item changes
    itemChanges.forEach((change) => {
      const categoryIndex = updatedCategories.findIndex((cat) => cat.id === change.categoryId)
      if (categoryIndex >= 0) {
        const reorderedItems = change.afterOrder
          .map((itemId) => updatedCategories[categoryIndex].items.find((item) => item.id === itemId))
          .filter(Boolean) as MenuItem[]

        updatedCategories[categoryIndex] = { ...updatedCategories[categoryIndex], items: reorderedItems }
      }
    })

    // Apply category changes
    if (categoryChanges) {
      updatedCategories = categoryChanges.afterOrder
        .map((categoryId) => updatedCategories.find((cat) => cat.id === categoryId))
        .filter(Boolean) as Category[]
    }

    localStorage.setItem("currentMenuData", JSON.stringify(updatedCategories))
    setCategories(updatedCategories)

    const totalChanges = itemChanges.length + (categoryChanges ? 1 : 0)
    toast({
      title: "All ordering changes applied!",
      description: `Updated ordering for ${totalChanges} sections in your menu`,
    })

    setTimeout(() => {
      router.push("/menu")
    }, 1000)
  }

  const handleApplyItemChanges = (changeId: string) => {
    const change = itemChanges.find((c) => c.categoryId === changeId)
    if (!change) return

    const updatedCategories = categories.map((category) => {
      if (category.id !== changeId) return category

      const reorderedItems = change.afterOrder
        .map((itemId) => category.items.find((item) => item.id === itemId))
        .filter(Boolean) as MenuItem[]

      return { ...category, items: reorderedItems }
    })

    localStorage.setItem("currentMenuData", JSON.stringify(updatedCategories))
    setCategories(updatedCategories)

    setItemChanges((prev) => prev.filter((c) => c.categoryId !== changeId))
    setAppliedChanges((prev) => [...prev, changeId])

    toast({
      title: "Item ordering applied!",
      description: `Updated ${change.categoryName} item order in your menu`,
    })
  }

  const handleApplyCategoryChanges = () => {
    if (!categoryChanges) return

    const updatedCategories = categoryChanges.afterOrder
      .map((categoryId) => categories.find((cat) => cat.id === categoryId))
      .filter(Boolean) as Category[]

    localStorage.setItem("currentMenuData", JSON.stringify(updatedCategories))
    setCategories(updatedCategories)

    setCategoryChanges(null)
    setAppliedChanges((prev) => [...prev, "categories"])

    toast({
      title: "Category ordering applied!",
      description: "Updated category order in your menu",
    })
  }

  const handleRejectItemChanges = (changeId: string) => {
    const change = itemChanges.find((c) => c.categoryId === changeId)
    setItemChanges((prev) => prev.filter((c) => c.categoryId !== changeId))

    toast({
      title: "Item ordering change rejected",
      description: `Kept original order for ${change?.categoryName}`,
    })
  }

  const handleRejectCategoryChanges = () => {
    setCategoryChanges(null)
    toast({
      title: "Category ordering change rejected",
      description: "Kept original category order",
    })
  }

  const totalChanges = itemChanges.length + (categoryChanges ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">AI Menu Ordering</h1>
              <p className="text-xs text-gray-500 truncate">Optimize item and category order for maximum impact</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListOrdered className="h-4 w-4 text-blue-600" />
              Generate Optimal Ordering
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                AI will analyze item performance, popularity, and profitability to suggest the optimal order for both
                items within categories and categories themselves, placing high-performing sections first for maximum
                visibility and sales.
              </p>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || categories.length === 0}
                className="w-full bg-gray-900 text-white hover:bg-gray-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing Menu Order...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Optimize Menu Order ({categories.length} categories)
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {hasGenerated && (
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Ordering Recommendations ({totalChanges} sections)
                </div>
                {totalChanges > 0 && (
                  <Button
                    onClick={handleApplyAll}
                    className="bg-gray-900 text-white hover:bg-gray-700 text-xs h-7 px-3"
                  >
                    Apply All
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {totalChanges > 0 ? (
                <div className="space-y-4">
                  {/* Category Ordering Changes */}
                  {categoryChanges && (
                    <div className="border border-purple-200 rounded-lg bg-purple-50 overflow-hidden shadow-sm">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Layers className="h-4 w-4 text-purple-600" />
                              <h4 className="font-medium text-sm text-gray-900">Category Ordering</h4>
                              <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                                Categories
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{categoryChanges.overallReason}</p>
                          </div>

                          <div className="flex gap-2 flex-shrink-0 ml-3">
                            {appliedChanges.includes("categories") ? (
                              <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1">
                                <Check className="h-3 w-3 mr-1" />
                                Applied
                              </Badge>
                            ) : (
                              <>
                                <Button
                                  onClick={handleApplyCategoryChanges}
                                  size="sm"
                                  className="bg-gray-900 text-white hover:bg-gray-700 text-xs h-7 px-2"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Apply
                                </Button>
                                <Button
                                  onClick={handleRejectCategoryChanges}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent text-xs h-7 px-2"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-medium text-gray-500 mb-2">CATEGORY CHANGES</div>
                          {categoryChanges.changes.map((categoryChange, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-white rounded border border-gray-100"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 truncate">
                                  {categoryChange.categoryName}
                                </div>
                                <div className="text-xs text-gray-600 mt-1 line-clamp-2">{categoryChange.reason}</div>
                              </div>
                              <div className="flex items-center gap-2 text-sm flex-shrink-0 ml-3">
                                <span className="text-gray-500">#{categoryChange.fromPosition}</span>
                                {categoryChange.toPosition < categoryChange.fromPosition ? (
                                  <ArrowUp className="h-3 w-3 text-green-600" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 text-red-600" />
                                )}
                                <span className="font-medium">#{categoryChange.toPosition}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Item Ordering Changes */}
                  {itemChanges.map((change) => (
                    <div
                      key={change.categoryId}
                      className="border border-blue-200 rounded-lg bg-blue-50 overflow-hidden shadow-sm"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <ListOrdered className="h-4 w-4 text-blue-600" />
                              <h4 className="font-medium text-sm text-gray-900">{change.categoryName}</h4>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">Items</Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{change.overallReason}</p>
                          </div>

                          <div className="flex gap-2 flex-shrink-0 ml-3">
                            {appliedChanges.includes(change.categoryId) ? (
                              <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1">
                                <Check className="h-3 w-3 mr-1" />
                                Applied
                              </Badge>
                            ) : (
                              <>
                                <Button
                                  onClick={() => handleApplyItemChanges(change.categoryId)}
                                  size="sm"
                                  className="bg-gray-900 text-white hover:bg-gray-700 text-xs h-7 px-2"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Apply
                                </Button>
                                <Button
                                  onClick={() => handleRejectItemChanges(change.categoryId)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-7 px-2 bg-transparent"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-medium text-gray-500 mb-2">ITEM CHANGES</div>
                          {change.changes.map((itemChange, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-white rounded border border-gray-100"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 truncate">{itemChange.itemName}</div>
                                <div className="text-xs text-gray-600 mt-1 line-clamp-2">{itemChange.reason}</div>
                              </div>
                              <div className="flex items-center gap-2 text-sm flex-shrink-0 ml-3">
                                <span className="text-gray-500">#{itemChange.fromPosition}</span>
                                {itemChange.toPosition < itemChange.fromPosition ? (
                                  <ArrowUp className="h-3 w-3 text-green-600" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 text-red-600" />
                                )}
                                <span className="font-medium">#{itemChange.toPosition}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ListOrdered className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No ordering improvements found.</p>
                  <p className="text-xs text-gray-400 mt-1">Your current menu order appears to be well-optimized.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
