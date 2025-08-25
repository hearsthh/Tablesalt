"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Sparkles,
  Check,
  Plus,
  Tag,
  FileText,
  DollarSign,
  ListOrdered,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"

interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  description?: string
  dietaryTags?: string[]
  isOutOfStock?: boolean
  popularity?: string
  profitability?: string
  orders?: number
  revenue?: number
  rating?: number
  trend?: string
  trendValue?: number
  revenueChange?: number
  variants?: any[]
  modifiers?: any[]
  nutritionalInfo?: any
  allergens?: string[]
  sortOrder?: number
  isCombo?: boolean
}

interface Category {
  id: string
  name: string
  items: MenuItem[]
}

interface AIMenuEnhancementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menuItems?: MenuItem[]
  categories?: Category[]
  onItemsUpdate?: (items: MenuItem[]) => void
  onCategoriesUpdate?: (categories: Category[]) => void
}

type AITool = "combos" | "tags" | "descriptions" | "pricing" | "ordering"
type Step = "tool-selection" | "item-selection" | "configuration" | "generate" | "preview" | "apply"

export function AIMenuEnhancementDialog({
  open,
  onOpenChange,
  menuItems = [],
  categories = [],
  onItemsUpdate,
  onCategoriesUpdate,
}: AIMenuEnhancementDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>("tool-selection")
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Selection states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Configuration states
  const [textPrompt, setTextPrompt] = useState("")
  const [avgDiscount, setAvgDiscount] = useState("15")
  const [descLength, setDescLength] = useState("medium")
  const [descTone, setDescTone] = useState("appetizing")
  const [customTag, setCustomTag] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Results states
  const [generatedResults, setGeneratedResults] = useState<any[]>([])
  const [appliedChanges, setAppliedChanges] = useState<string[]>([])

  const availableTags = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Spicy",
    "Popular",
    "Chef's Special",
    "Healthy",
    "Low-Carb",
  ]

  const tools = [
    {
      id: "combos" as AITool,
      name: "AI Combos",
      description: "Generate smart combo deals with automatic pricing",
      icon: Plus,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      id: "tags" as AITool,
      name: "AI Tags",
      description: "Smart tagging system for dietary and preference labels",
      icon: Tag,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      id: "descriptions" as AITool,
      name: "AI Descriptions",
      description: "Enhanced menu descriptions that drive sales",
      icon: FileText,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      id: "pricing" as AITool,
      name: "Menu Pricing",
      description: "Dynamic pricing optimization with market analysis",
      icon: DollarSign,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      id: "ordering" as AITool,
      name: "Menu Ordering",
      description: "Optimize item positioning for maximum performance",
      icon: ListOrdered,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
  ]

  useEffect(() => {
    if (open) {
      setCurrentStep("tool-selection")
      setSelectedTool(null)
      setSelectedCategories([])
      setSelectedItems([])
      setTextPrompt("")
      setGeneratedResults([])
      setAppliedChanges([])
    }
  }, [open])

  const goToNextStep = () => {
    const steps: Step[] = ["tool-selection", "item-selection", "configuration", "generate", "preview", "apply"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const goToPreviousStep = () => {
    const steps: Step[] = ["tool-selection", "item-selection", "configuration", "generate", "preview", "apply"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const generateResults = async () => {
    setIsGenerating(true)
    setCurrentStep("generate")

    try {
      let results: any[] = []

      switch (selectedTool) {
        case "combos":
          results = await generateComboResults()
          break
        case "tags":
          results = await generateTagResults()
          break
        case "descriptions":
          results = await generateDescriptionResults()
          break
        case "pricing":
          results = await generatePricingResults()
          break
        case "ordering":
          results = await generateOrderingResults()
          break
      }

      setGeneratedResults(results)
      setIsGenerating(false)
      setCurrentStep("preview")
    } catch (error) {
      console.error("AI generation failed:", error)
      setGeneratedResults(getMockResults())
      setIsGenerating(false)
      setCurrentStep("preview")
    }
  }

  const generateComboResults = async () => {
    const response = await fetch("/api/ai/menu-combos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menuItems: menuItems.slice(0, 10), // Limit for API efficiency
        discount: Number.parseInt(avgDiscount) / 100,
        instructions: textPrompt,
      }),
    })

    if (!response.ok) throw new Error("Failed to generate combos")

    const data = await response.json()
    return data.combos || []
  }

  const generateTagResults = async () => {
    const response = await fetch("/api/ai/menu-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menuItems: menuItems.slice(0, 20), // Limit for API efficiency
        selectedTags,
        customTags: customTag ? [customTag] : [],
      }),
    })

    if (!response.ok) throw new Error("Failed to generate tags")

    const data = await response.json()
    return data.taggedItems || []
  }

  const generateDescriptionResults = async () => {
    let itemsToUpdate = menuItems
    if (selectedItems.length > 0) {
      itemsToUpdate = menuItems.filter((item) => selectedItems.includes(item.id))
    } else if (selectedCategories.length > 0) {
      itemsToUpdate = menuItems.filter((item) => selectedCategories.includes(item.category))
    }

    const response = await fetch("/api/ai/menu-descriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menuItems: itemsToUpdate.slice(0, 10), // Limit for API efficiency
        tone: descTone,
        length: descLength,
        instructions: textPrompt,
      }),
    })

    if (!response.ok) throw new Error("Failed to generate descriptions")

    const data = await response.json()
    return data.descriptions || []
  }

  const generatePricingResults = async () => {
    let itemsToUpdate = menuItems
    if (selectedItems.length > 0) {
      itemsToUpdate = menuItems.filter((item) => selectedItems.includes(item.id))
    } else if (selectedCategories.length > 0) {
      itemsToUpdate = menuItems.filter((item) => selectedCategories.includes(item.category))
    }

    const response = await fetch("/api/ai/menu-pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menuItems: itemsToUpdate.slice(0, 15), // Limit for API efficiency
        instructions: textPrompt,
      }),
    })

    if (!response.ok) throw new Error("Failed to generate pricing")

    const data = await response.json()
    return data.pricingRecommendations || []
  }

  const generateOrderingResults = async () => {
    const response = await fetch("/api/ai/menu-ordering", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categories: categories.map((cat) => ({
          ...cat,
          items: cat.items.slice(0, 10), // Limit items per category
        })),
        instructions: textPrompt,
      }),
    })

    if (!response.ok) throw new Error("Failed to generate ordering")

    const data = await response.json()
    return data.orderingRecommendations || []
  }

  const getMockResults = () => {
    switch (selectedTool) {
      case "combos":
        return [
          {
            id: `combo-${Date.now()}`,
            name: "Sample Combo Deal",
            description: "AI-generated combo (fallback)",
            items: menuItems.slice(0, 2),
            originalPrice: 25.99,
            comboPrice: 21.99,
            savings: 4.0,
            tags: ["AI Generated", "Sample"],
          },
        ]
      case "tags":
        return menuItems.slice(0, 3).map((item) => ({
          itemId: item.id,
          itemName: item.name,
          before: item.dietaryTags || [],
          after: [...(item.dietaryTags || []), "AI Enhanced"],
          autoAssigned: true,
        }))
      case "descriptions":
        return menuItems.slice(0, 3).map((item) => ({
          itemId: item.id,
          itemName: item.name,
          before: item.description || "No description",
          after: `AI-enhanced description for ${item.name} (fallback mode)`,
        }))
      case "pricing":
        return menuItems.slice(0, 3).map((item) => ({
          itemId: item.id,
          itemName: item.name,
          currentPrice: item.price,
          newPrice: item.price + 1.0,
          reasoning: "AI pricing optimization (fallback mode)",
        }))
      case "ordering":
        return [
          {
            categoryId: categories[0]?.id || "cat1",
            itemId: menuItems[0]?.id || "item1",
            itemName: menuItems[0]?.name || "Sample Item",
            category: categories[0]?.name || "Sample Category",
            currentPos: 1,
            newPos: 2,
            reasoning: "AI ordering optimization (fallback mode)",
            reorderedItems: menuItems.slice(0, 3).map((item, index) => ({
              id: item.id,
              position: index + 1,
            })),
          },
        ]
      default:
        return []
    }
  }

  const applyChanges = (resultIds: string[]) => {
    if (!onItemsUpdate || !onCategoriesUpdate) return

    switch (selectedTool) {
      case "combos":
        const selectedCombos = generatedResults.filter((combo) => resultIds.includes(combo.id))
        const comboMenuItems = selectedCombos.map((combo) => ({
          id: `combo-${combo.id}-${Date.now()}`, // Ensure unique IDs
          name: combo.name,
          price: combo.comboPrice || combo.price || 0,
          category: "Combos",
          description:
            combo.description || `Combo deal: ${combo.items?.map((item: any) => item.name).join(", ") || ""}`,
          isOutOfStock: false,
          popularity: "high" as const,
          profitability: "high" as const,
          orders: 0,
          revenue: 0,
          rating: 4.5,
          trend: "up" as const,
          trendValue: 15,
          revenueChange: 0,
          variants: [],
          modifiers: [],
          nutritionalInfo: {},
          allergens: [],
          dietaryTags: combo.tags || [],
          sortOrder: 1,
          isCombo: true, // Ensure this is set
        }))

        const allUpdatedItems = [...menuItems, ...comboMenuItems]
        console.log("Applying combo changes:", { comboMenuItems, allUpdatedItems })
        onItemsUpdate(allUpdatedItems)
        break

      case "tags":
        const updatedItemsWithTags = menuItems.map((item) => {
          const result = generatedResults.find((r) => r.itemId === item.id)
          if (result && result.after) {
            return { ...item, dietaryTags: Array.isArray(result.after) ? result.after : [result.after] }
          }
          return item
        })
        onItemsUpdate(updatedItemsWithTags)
        console.log("Successfully applied tags changes!")
        break

      case "descriptions":
        const updatedItemsWithDesc = menuItems.map((item) => {
          const result = generatedResults.find((r) => r.itemId === item.id && resultIds.includes(r.itemId))
          if (result) {
            const newDescription = result.description || result.after || result.enhancedDescription || ""
            return { ...item, description: newDescription }
          }
          return item
        })
        onItemsUpdate(updatedItemsWithDesc)
        break

      case "pricing":
        const updatedItemsWithPrice = menuItems.map((item) => {
          const result = generatedResults.find((r) => r.itemId === item.id && resultIds.includes(r.itemId))
          if (result) {
            const newPrice = result.newPrice || result.price || result.optimizedPrice || item.price
            return {
              ...item,
              price: typeof newPrice === "number" ? newPrice : Number.parseFloat(newPrice) || item.price,
            }
          }
          return item
        })
        onItemsUpdate(updatedItemsWithPrice)
        break

      case "ordering":
        const updatedCategories = categories.map((category) => {
          const orderingResult = generatedResults.find((r) => r.categoryId === category.id)
          if (orderingResult && orderingResult.reorderedItems) {
            const reorderedItems = orderingResult.reorderedItems
              .map((reorderedItem: any) => {
                const originalItem = category.items.find((item) => item.id === reorderedItem.id)
                return originalItem
                  ? { ...originalItem, sortOrder: reorderedItem.sortOrder || reorderedItem.position || 1 }
                  : null
              })
              .filter(Boolean)
            return { ...category, items: reorderedItems.length > 0 ? reorderedItems : category.items }
          }
          return category
        })
        onCategoriesUpdate(updatedCategories)
        break
    }

    setAppliedChanges(resultIds)

    setTimeout(() => {
      onOpenChange(false)
    }, 500)
  }

  const getStepProgress = () => {
    const steps = ["tool-selection", "item-selection", "configuration", "generate", "preview", "apply"]
    const currentIndex = steps.indexOf(currentStep)
    return ((currentIndex + 1) / steps.length) * 100
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[85vh] flex flex-col bg-white border border-gray-200">
        <DialogHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <DialogTitle className="text-lg font-semibold text-gray-900">AI Menu Enhancement</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 px-1">
          {currentStep === "tool-selection" && (
            <div className="space-y-4 py-2">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Choose an AI tool to enhance your menu:</p>
              </div>
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <Card
                    key={tool.id}
                    className={`cursor-pointer transition-all border border-gray-200 hover:border-blue-200 hover:bg-blue-50 ${
                      selectedTool === tool.id ? "border-blue-500 bg-blue-50" : "bg-white"
                    }`}
                    onClick={() => {
                      setSelectedTool(tool.id)
                      goToNextStep()
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-500 p-2 rounded-md flex-shrink-0">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">{tool.name}</h3>
                          <p className="text-xs text-gray-600 leading-relaxed mb-2">{tool.description}</p>
                          <div className="text-xs text-gray-500 font-medium">
                            {tool.id === "combos" ? "Generates combo deals" : "Requires items selection"}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {currentStep === "item-selection" && (
            <div className="space-y-4 py-2">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Select Items</h3>
                <p className="text-xs text-gray-600">Choose which menu items or categories to enhance</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">Categories</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedCategories.includes(category.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories((prev) => [...prev, category.name])
                            } else {
                              setSelectedCategories((prev) => prev.filter((c) => c !== category.name))
                            }
                          }}
                        />
                        <Label className="text-sm text-gray-900 flex-1">{category.name}</Label>
                        <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                          {category.items.length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">Individual Items</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                    {menuItems.slice(0, 10).map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedItems((prev) => [...prev, item.id])
                            } else {
                              setSelectedItems((prev) => prev.filter((i) => i !== item.id))
                            }
                          }}
                        />
                        <Label className="text-sm text-gray-900 flex-1">{item.name}</Label>
                        <span className="text-xs text-gray-600">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 text-sm h-8 px-4 bg-transparent"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" /> Back
                </Button>
                <Button onClick={goToNextStep} className="bg-gray-900 text-white hover:bg-gray-800 text-sm h-8 px-4">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentStep === "configuration" && (
            <div className="space-y-4 py-2">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Configure Settings</h3>
                <p className="text-xs text-gray-600">Customize your AI enhancement preferences</p>
              </div>

              {selectedTool === "combos" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-900">Average Discount (%)</Label>
                    <Input
                      type="number"
                      value={avgDiscount}
                      onChange={(e) => setAvgDiscount(e.target.value)}
                      placeholder="15"
                      className="mt-1 border-gray-300 h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-900">Additional Instructions (Optional)</Label>
                    <Textarea
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      placeholder="e.g., focus on family-friendly combos"
                      rows={3}
                      className="mt-1 border-gray-300 text-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {selectedTool === "tags" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-2 block">Select Tags to Apply</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTags((prev) => [...prev, tag])
                              } else {
                                setSelectedTags((prev) => prev.filter((t) => t !== tag))
                              }
                            }}
                          />
                          <Label className="text-xs text-gray-900">{tag}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Add custom tag"
                      className="flex-1 border-gray-300 h-8 text-sm"
                    />
                    <Button
                      onClick={() => {
                        if (customTag.trim() && !availableTags.includes(customTag.trim())) {
                          setSelectedTags((prev) => [...prev, customTag.trim()])
                          setCustomTag("")
                        }
                      }}
                      variant="outline"
                      className="text-gray-700 border-gray-300 hover:bg-gray-50 h-8 px-3"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {selectedTool === "descriptions" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Length</Label>
                      <Select value={descLength} onValueChange={setDescLength}>
                        <SelectTrigger className="mt-1 border-gray-300 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Tone</Label>
                      <Select value={descTone} onValueChange={setDescTone}>
                        <SelectTrigger className="mt-1 border-gray-300 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appetizing">Appetizing</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="elegant">Elegant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-900">Focus Instructions (Optional)</Label>
                    <Textarea
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      placeholder="e.g., emphasize fresh ingredients and cooking methods"
                      rows={3}
                      className="mt-1 border-gray-300 text-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {(selectedTool === "pricing" || selectedTool === "ordering") && (
                <div>
                  <Label className="text-sm font-medium text-gray-900">Additional Instructions (Optional)</Label>
                  <Textarea
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    placeholder={
                      selectedTool === "pricing"
                        ? "e.g., increase prices for premium items"
                        : "e.g., prioritize popular items at the top"
                    }
                    rows={3}
                    className="mt-1 border-gray-300 text-sm resize-none"
                  />
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 text-sm h-8 px-4 bg-transparent"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" /> Back
                </Button>
                <Button onClick={generateResults} className="bg-blue-400 text-white hover:bg-blue-500 text-sm h-8 px-4">
                  Generate <Sparkles className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === "generate" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-blue-400 animate-spin" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Generating Results</h3>
              <p className="text-xs text-gray-600 text-center">
                AI is analyzing your menu and creating optimized suggestions...
              </p>
              <div className="mt-4 w-48 bg-gray-200 rounded-full h-1">
                <div className="bg-blue-400 h-1 rounded-full animate-pulse" style={{ width: "70%" }} />
              </div>
            </div>
          )}

          {currentStep === "preview" && (
            <div className="space-y-4 py-2">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Preview Results</h3>
                <p className="text-xs text-gray-600">Review the AI-generated suggestions before applying</p>
              </div>

              <div className="space-y-3">
                {generatedResults.slice(0, 3).map((result, index) => (
                  <Card key={result.id || index} className="border border-gray-200">
                    <CardContent className="p-3">
                      {selectedTool === "combos" && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm">{result.name}</h4>
                              <p className="text-xs text-gray-600">{result.description}</p>
                            </div>
                            <div className="text-right ml-3">
                              <div className="text-sm font-bold text-blue-400">${result.comboPrice.toFixed(2)}</div>
                              <div className="text-xs text-gray-500 line-through">
                                ${result.originalPrice.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                            Save ${result.savings.toFixed(2)}
                          </Badge>
                        </div>
                      )}

                      {selectedTool === "tags" && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{result.itemName}</h4>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="flex gap-1 flex-wrap">
                              {result.before.length > 0 ? (
                                result.before.slice(0, 2).map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 text-xs border border-gray-300 text-gray-700 bg-white rounded-md"
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400">No tags</span>
                              )}
                            </div>
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            <div className="flex gap-1 flex-wrap">
                              {result.after.slice(0, 2).map((tag: string) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-600 border border-blue-200 rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedTool === "descriptions" && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{result.itemName}</h4>
                          <div className="space-y-1">
                            <div>
                              <Label className="text-xs text-gray-500">BEFORE:</Label>
                              <p className="text-xs bg-gray-50 p-2 rounded mt-1 line-clamp-2">{result.before}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-blue-400">AFTER:</Label>
                              <p className="text-xs bg-blue-50 p-2 rounded mt-1 line-clamp-2">{result.after}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedTool === "pricing" && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-gray-900 text-sm">{result.itemName}</h4>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-semibold">${result.currentPrice.toFixed(2)}</span>
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                              <span className="font-semibold text-blue-400">${result.newPrice.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-600">{result.reasoning}</p>
                          </div>
                        </div>
                      )}

                      {selectedTool === "ordering" && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm">{result.itemName}</h4>
                              <p className="text-xs text-gray-600">{result.category}</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold">#{result.currentPos}</span>
                                <ArrowRight className="h-3 w-3 text-gray-400" />
                                <span className="font-semibold text-blue-600">#{result.newPos}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{result.reasoning}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 text-sm h-8 px-4 bg-transparent"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" /> Back
                </Button>
                <Button
                  onClick={() => {
                    const allIds = generatedResults.map((r) => r.id || r.itemId)
                    applyChanges(allIds)
                    setCurrentStep("apply")
                  }}
                  className="bg-gray-600 text-white hover:bg-gray-700 text-sm h-8 px-4"
                >
                  Apply Changes <Check className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === "apply" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Changes Applied Successfully!</h3>
              <p className="text-xs text-gray-600 text-center mb-4">
                Your menu has been updated with the AI-generated improvements.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => onOpenChange(false)}
                  className="bg-gray-900 text-white hover:bg-gray-800 text-sm h-8 px-4"
                >
                  View Menu
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentStep("tool-selection")
                    setSelectedTool(null)
                    setGeneratedResults([])
                  }}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 text-sm h-8 px-4"
                >
                  Use Another Tool
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
