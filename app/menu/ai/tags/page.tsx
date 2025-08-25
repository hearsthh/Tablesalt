"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Tags, Sparkles, Check, X, Plus } from "lucide-react"
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

type TagSuggestion = {
  id: string
  itemId: string
  itemName: string
  currentTags: string[]
  suggestedTags: string[]
  reasoning: string[]
}

export default function AITagsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [tagType, setTagType] = useState<string>("dietary")
  const [isGenerating, setIsGenerating] = useState(false)
  const [tagSuggestions, setTagSuggestions] = useState<TagSuggestion[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

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
            ],
          },
        ])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }, [])

  const allItems = categories.flatMap((cat) => cat.items)

  const handleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleSelectAll = () => {
    if (selectedItems.length === allItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(allItems.map((item) => item.id))
    }
  }

  const handleGenerate = async () => {
    if (selectedItems.length === 0) {
      toast({ title: "Please select at least one item to generate tags" })
      return
    }

    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const selectedMenuItems = allItems.filter((item) => selectedItems.includes(item.id))
    const suggestions: TagSuggestion[] = selectedMenuItems.map((item) => ({
      id: `tag-${item.id}`,
      itemId: item.id,
      itemName: item.name,
      currentTags: item.dietaryTags || [],
      suggestedTags: generateTags(item, tagType),
      reasoning: generateReasoning(item, tagType),
    }))

    setTagSuggestions(suggestions)
    setHasGenerated(true)
    setIsGenerating(false)

    toast({
      title: "Tags generated!",
      description: `${suggestions.length} items analyzed for tag suggestions`,
    })
  }

  const generateTags = (item: MenuItem, type: string) => {
    const tagMap = {
      dietary: {
        "Butter Chicken": ["Gluten-Free", "High Protein", "Dairy"],
        "Margherita Pizza": ["Vegetarian", "Contains Gluten", "Dairy"],
        "Caesar Salad": ["Vegetarian", "Contains Eggs", "Dairy"],
      },
      marketing: {
        "Butter Chicken": ["Chef's Special", "Customer Favorite", "Signature Dish"],
        "Margherita Pizza": ["Classic", "Traditional", "Best Seller"],
        "Caesar Salad": ["Fresh", "Light Option", "Healthy Choice"],
      },
      allergen: {
        "Butter Chicken": ["Contains Dairy", "Nut-Free", "Egg-Free"],
        "Margherita Pizza": ["Contains Gluten", "Contains Dairy", "Nut-Free"],
        "Caesar Salad": ["Contains Eggs", "Contains Dairy", "Gluten"],
      },
    }

    return (
      tagMap[type as keyof typeof tagMap]?.[item.name as keyof (typeof tagMap)[typeof type]] || [
        "Popular",
        "Recommended",
      ]
    )
  }

  const generateReasoning = (item: MenuItem, type: string) => {
    const reasoningMap = {
      dietary: ["Based on ingredients analysis", "Nutritional content review", "Dietary restriction compatibility"],
      marketing: ["Performance metrics analysis", "Customer feedback review", "Sales data insights"],
      allergen: ["Ingredient allergen scan", "Cross-contamination assessment", "Safety compliance check"],
    }

    return reasoningMap[type as keyof typeof reasoningMap] || ["AI analysis complete"]
  }

  const handleApplyTags = (suggestion: TagSuggestion) => {
    try {
      const menuData = localStorage.getItem("currentMenuData")
      if (menuData) {
        const menuCategories = JSON.parse(menuData)

        // Find and update the item
        for (const category of menuCategories) {
          const itemIndex = category.items.findIndex((item: MenuItem) => item.id === suggestion.itemId)
          if (itemIndex !== -1) {
            // Merge current tags with suggested tags, removing duplicates
            const allTags = [...(category.items[itemIndex].dietaryTags || []), ...suggestion.suggestedTags]
            category.items[itemIndex].dietaryTags = [...new Set(allTags)]
            break
          }
        }

        localStorage.setItem("currentMenuData", JSON.stringify(menuCategories))
        setCategories(menuCategories)
      }

      // Remove from suggestions
      setTagSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id))

      toast({
        title: "Tags applied!",
        description: `${suggestion.itemName} tags have been updated`,
      })
    } catch (error) {
      console.error("Error applying tags:", error)
      toast({ title: "Error applying tags" })
    }
  }

  const handleRejectTags = (suggestion: TagSuggestion) => {
    setTagSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id))
    toast({ title: "Tags rejected" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">AI Tags</h1>
              <p className="text-xs text-gray-500 truncate">Auto-generate relevant tags for menu items</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                1
              </div>
              Select Items & Tag Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block text-gray-900">Tag Type</Label>
              <Select value={tagType} onValueChange={setTagType}>
                <SelectTrigger className="border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dietary">Dietary & Nutrition</SelectItem>
                  <SelectItem value="marketing">Marketing & Sales</SelectItem>
                  <SelectItem value="allergen">Allergen & Safety</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-gray-900">
                  Select Items ({selectedItems.length} selected)
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs h-7 px-2 bg-transparent border-gray-200 text-gray-600"
                >
                  {selectedItems.length === allItems.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-3">
                {categories.map((category) => (
                  <div key={category.id}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{category.name}</h4>
                    <div className="space-y-2 ml-4">
                      {category.items.map((item) => (
                        <div key={item.id} className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleItemSelection(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-900 font-medium truncate">{item.name}</span>
                              <span className="text-sm font-medium text-gray-700 flex-shrink-0 ml-2">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-1">
                              {(item.dietaryTags || []).map((tag) => (
                                <Badge key={tag} className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                2
              </div>
              Generate Tag Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGenerate}
              disabled={selectedItems.length === 0 || isGenerating}
              className="w-full bg-gray-900 text-white hover:bg-gray-700 h-9"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin text-blue-400" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2 text-blue-400" />
                  Generate Tags
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {hasGenerated && (
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                  3
                </div>
                Review & Apply ({tagSuggestions.length} suggestions)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tagSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {tagSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 mb-2">{suggestion.itemName}</h4>

                          {/* Current Tags */}
                          <div className="mb-3">
                            <div className="text-xs font-medium text-gray-500 mb-1">CURRENT TAGS:</div>
                            <div className="flex flex-wrap gap-1">
                              {suggestion.currentTags.length > 0 ? (
                                suggestion.currentTags.map((tag) => (
                                  <Badge key={tag} className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                                    {tag}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400 italic">No tags assigned</span>
                              )}
                            </div>
                          </div>

                          {/* Suggested Tags */}
                          <div className="mb-3">
                            <div className="text-xs font-medium text-blue-600 mb-1">SUGGESTED TAGS:</div>
                            <div className="flex flex-wrap gap-1">
                              {suggestion.suggestedTags.map((tag) => (
                                <Badge key={tag} className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                  <Plus className="h-2 w-2 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Reasoning */}
                          <div className="mb-3">
                            <div className="text-xs font-medium text-gray-500 mb-1">REASONING:</div>
                            <div className="flex flex-wrap gap-1">
                              {suggestion.reasoning.map((reason, index) => (
                                <Badge key={index} className="bg-green-100 text-green-700 border-green-200 text-xs">
                                  {reason}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-3 border-t border-blue-200">
                          <Button
                            onClick={() => handleApplyTags(suggestion)}
                            size="sm"
                            className="bg-gray-900 text-white hover:bg-gray-700 h-7 px-3 text-xs"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Apply Tags
                          </Button>
                          <Button
                            onClick={() => handleRejectTags(suggestion)}
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50 h-7 px-3 text-xs"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Tags className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No tag suggestions to review. All have been applied or rejected.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
