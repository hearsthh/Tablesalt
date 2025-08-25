"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Sparkles, Check, X, Plus, TrendingUp } from "lucide-react"
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
  price: number
  category: string
}

type ComboSuggestion = {
  id: string
  name: string
  description: string
  items: MenuItem[]
  originalPrice: number
  comboPrice: number
  savings: number
  popularity: number
  reason: string
}

export default function AICombosPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCombos, setGeneratedCombos] = useState<ComboSuggestion[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)
  const [appliedCombos, setAppliedCombos] = useState<string[]>([])

  useEffect(() => {
    // Load menu data from localStorage
    try {
      const menuData = localStorage.getItem("currentMenuData")
      if (menuData) {
        const categories = JSON.parse(menuData)
        const items = categories.flatMap((cat: any) =>
          cat.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            category: item.category,
          })),
        )
        setMenuItems(items)
      }
    } catch (error) {
      console.error("Error loading menu data:", error)
    }
  }, [])

  const handleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleSelectAll = () => {
    setSelectedItems(menuItems.map((item) => item.id))
  }

  const handleDeselectAll = () => {
    setSelectedItems([])
  }

  const handleGenerate = async () => {
    if (selectedItems.length < 2) {
      toast({
        title: "Select at least 2 items",
        description: "You need to select at least 2 items to generate combos",
      })
      return
    }

    setIsGenerating(true)

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const selectedMenuItems = menuItems.filter((item) => selectedItems.includes(item.id))

    // Generate mock combos
    const mockCombos: ComboSuggestion[] = [
      {
        id: "combo-1",
        name: "Family Feast",
        description: "Perfect combo for family dining with variety and value",
        items: selectedMenuItems.slice(0, 3),
        originalPrice: selectedMenuItems.slice(0, 3).reduce((sum, item) => sum + item.price, 0),
        comboPrice: selectedMenuItems.slice(0, 3).reduce((sum, item) => sum + item.price, 0) * 0.85,
        savings: selectedMenuItems.slice(0, 3).reduce((sum, item) => sum + item.price, 0) * 0.15,
        popularity: 85,
        reason: "These items are frequently ordered together and offer great variety",
      },
      {
        id: "combo-2",
        name: "Quick Lunch Deal",
        description: "Fast and satisfying lunch combination",
        items: selectedMenuItems.slice(1, 3),
        originalPrice: selectedMenuItems.slice(1, 3).reduce((sum, item) => sum + item.price, 0),
        comboPrice: selectedMenuItems.slice(1, 3).reduce((sum, item) => sum + item.price, 0) * 0.9,
        savings: selectedMenuItems.slice(1, 3).reduce((sum, item) => sum + item.price, 0) * 0.1,
        popularity: 72,
        reason: "Popular lunch combination with good profit margins",
      },
    ]

    setGeneratedCombos(mockCombos)
    setHasGenerated(true)
    setIsGenerating(false)

    toast({
      title: "Combos generated!",
      description: `Found ${mockCombos.length} profitable combo opportunities`,
    })
  }

  const handleApplyCombo = (comboId: string) => {
    setAppliedCombos((prev) => [...prev, comboId])

    // Save to localStorage
    const existingCombos = JSON.parse(localStorage.getItem("acceptedCombos") || "[]")
    const combo = generatedCombos.find((c) => c.id === comboId)
    if (combo) {
      existingCombos.push({
        id: combo.id,
        name: combo.name,
        description: combo.description,
        price: combo.comboPrice,
        savings: combo.savings,
        items: combo.items.map((item) => item.name),
        isActive: true,
      })
      localStorage.setItem("acceptedCombos", JSON.stringify(existingCombos))
    }

    toast({
      title: "Combo added to menu!",
      description: `${combo?.name} has been added to your menu`,
    })
  }

  const handleRejectCombo = (comboId: string) => {
    setGeneratedCombos((prev) => prev.filter((combo) => combo.id !== comboId))
    toast({
      title: "Combo rejected",
      description: "Combo suggestion has been removed",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">AI Combo Generator</h1>
              <p className="text-xs text-gray-500 truncate">Create profitable combo offers</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        {!hasGenerated ? (
          <>
            {/* Selection Step */}
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Select Items for Combo Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Choose items to analyze for combo opportunities</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="text-xs h-7 px-2 bg-transparent"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeselectAll}
                        className="text-xs h-7 px-2 bg-transparent"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleItemSelection(item.id)}
                          />
                          <div>
                            <div className="font-medium text-sm text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.category}</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || selectedItems.length < 2}
                    className="w-full bg-gray-900 text-white hover:bg-gray-700"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Generating Combos...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Combos ({selectedItems.length} items)
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Results Step */}
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    Generated Combo Suggestions ({generatedCombos.length})
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setHasGenerated(false)
                      setGeneratedCombos([])
                      setAppliedCombos([])
                    }}
                    className="text-xs h-7 px-2"
                  >
                    Generate New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedCombos.map((combo) => (
                    <div key={combo.id} className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm">{combo.name}</h4>
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {combo.popularity}% popular
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{combo.description}</p>
                            <p className="text-xs text-gray-500">{combo.reason}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-2">ITEMS INCLUDED</div>
                            <div className="flex flex-wrap gap-1">
                              {combo.items.map((item, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {item.name} (${item.price.toFixed(2)})
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-4">
                              <div>
                                <div className="text-lg font-bold text-gray-900">${combo.comboPrice.toFixed(2)}</div>
                                <div className="text-xs text-gray-500 line-through">
                                  ${combo.originalPrice.toFixed(2)}
                                </div>
                              </div>
                              <div className="text-xs text-green-600 font-medium">Save ${combo.savings.toFixed(2)}</div>
                            </div>

                            <div className="flex gap-2">
                              {appliedCombos.includes(combo.id) ? (
                                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1">
                                  <Check className="h-3 w-3 mr-1" />
                                  Added to Menu
                                </Badge>
                              ) : (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRejectCombo(combo.id)}
                                    className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-7 px-2"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                  <Button
                                    onClick={() => handleApplyCombo(combo.id)}
                                    className="bg-gray-900 text-white hover:bg-gray-700 text-xs h-7 px-2"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add to Menu
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {generatedCombos.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Sparkles className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No more combo suggestions.</p>
                      <p className="text-xs text-gray-400 mt-1">Try selecting different items.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
