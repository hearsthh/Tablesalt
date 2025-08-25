"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileText, Sparkles, Check, X, RefreshCw } from "lucide-react"
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

type EnhancedDescription = {
  id: string
  itemId: string
  itemName: string
  originalDescription: string
  enhancedDescription: string
  improvements: string[]
  tone: string
  length: string
}

export default function AIDescriptionsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [tone, setTone] = useState<string>("appetizing")
  const [length, setLength] = useState<string>("medium")
  const [isGenerating, setIsGenerating] = useState(false)
  const [enhancedDescriptions, setEnhancedDescriptions] = useState<EnhancedDescription[]>([])
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
      toast({ title: "Please select at least one item to enhance descriptions" })
      return
    }

    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const selectedMenuItems = allItems.filter((item) => selectedItems.includes(item.id))
    const enhanced: EnhancedDescription[] = selectedMenuItems.map((item) => ({
      id: `enhanced-${item.id}`,
      itemId: item.id,
      itemName: item.name,
      originalDescription: item.description,
      enhancedDescription: generateEnhancedDescription(item, tone, length),
      improvements: ["More appetizing language", "Added sensory details", "Highlighted key ingredients"],
      tone,
      length,
    }))

    setEnhancedDescriptions(enhanced)
    setHasGenerated(true)
    setIsGenerating(false)

    toast({
      title: "Descriptions enhanced!",
      description: `${enhanced.length} descriptions have been improved`,
    })
  }

  const generateEnhancedDescription = (item: MenuItem, tone: string, length: string) => {
    const toneMap = {
      appetizing: "mouth-watering",
      professional: "expertly crafted",
      casual: "delicious",
      elegant: "exquisitely prepared",
    }

    const lengthMap = {
      short: 1,
      medium: 2,
      long: 3,
    }

    const baseDescriptions = {
      "Butter Chicken": [
        "Rich, creamy tomato curry with tender chicken pieces",
        "Succulent chicken simmered in our signature creamy tomato sauce, infused with aromatic spices and finished with a touch of cream",
        "Our most beloved dish featuring tender chicken pieces slow-cooked in a velvety tomato-based curry, enriched with cream and aromatic Indian spices, served with fragrant basmati rice",
      ],
      "Margherita Pizza": [
        "Classic pizza with fresh mozzarella and basil",
        "Traditional Italian pizza topped with San Marzano tomatoes, fresh mozzarella, and aromatic basil leaves",
        "Authentic Neapolitan-style pizza featuring our house-made dough topped with premium San Marzano tomatoes, creamy fresh mozzarella di bufala, and garden-fresh basil leaves, baked to perfection in our wood-fired oven",
      ],
      "Caesar Salad": [
        "Crisp romaine with parmesan and croutons",
        "Fresh romaine lettuce tossed in our house-made Caesar dressing with aged parmesan and garlic croutons",
        "Garden-fresh romaine lettuce hearts tossed in our signature Caesar dressing made with aged anchovies, fresh garlic, and lemon, topped with aged Parmigiano-Reggiano and house-made herb croutons",
      ],
    }

    const descriptions = baseDescriptions[item.name as keyof typeof baseDescriptions] || [
      item.description,
      `${toneMap[tone as keyof typeof toneMap]} ${item.name.toLowerCase()} prepared with care`,
      `Our ${toneMap[tone as keyof typeof toneMap]} ${item.name.toLowerCase()} is prepared using the finest ingredients and traditional techniques`,
    ]

    return descriptions[lengthMap[length as keyof typeof lengthMap] - 1] || item.description
  }

  const handleApplyDescription = (enhancedDesc: EnhancedDescription) => {
    try {
      const menuData = localStorage.getItem("currentMenuData")
      if (menuData) {
        const menuCategories = JSON.parse(menuData)

        // Find and update the item
        for (const category of menuCategories) {
          const itemIndex = category.items.findIndex((item: MenuItem) => item.id === enhancedDesc.itemId)
          if (itemIndex !== -1) {
            category.items[itemIndex].description = enhancedDesc.enhancedDescription
            break
          }
        }

        localStorage.setItem("currentMenuData", JSON.stringify(menuCategories))
        setCategories(menuCategories)
      }

      // Remove from enhanced descriptions
      setEnhancedDescriptions((prev) => prev.filter((desc) => desc.id !== enhancedDesc.id))

      toast({
        title: "Description applied!",
        description: `${enhancedDesc.itemName} description has been updated`,
      })
    } catch (error) {
      console.error("Error applying description:", error)
      toast({ title: "Error applying description" })
    }
  }

  const handleRejectDescription = (enhancedDesc: EnhancedDescription) => {
    setEnhancedDescriptions((prev) => prev.filter((desc) => desc.id !== enhancedDesc.id))
    toast({ title: "Description rejected" })
  }

  const handleRegenerateDescription = (enhancedDesc: EnhancedDescription) => {
    const item = allItems.find((item) => item.id === enhancedDesc.itemId)
    if (item) {
      const newDescription = generateEnhancedDescription(item, tone, length)
      setEnhancedDescriptions((prev) =>
        prev.map((desc) => (desc.id === enhancedDesc.id ? { ...desc, enhancedDescription: newDescription } : desc)),
      )
      toast({ title: "Description regenerated!" })
    }
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
              <h1 className="text-lg font-semibold text-gray-900 truncate">AI Descriptions</h1>
              <p className="text-xs text-gray-500 truncate">Enhance your menu item descriptions</p>
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
              Select Items & Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block text-gray-900">Writing Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="border-gray-200">
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
              <div>
                <Label className="text-sm font-medium mb-2 block text-gray-900">Description Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
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
              Generate Enhanced Descriptions
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
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2 text-blue-400" />
                  Generate Descriptions
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
                Review & Apply ({enhancedDescriptions.length} descriptions)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enhancedDescriptions.length > 0 ? (
                <div className="space-y-4">
                  {enhancedDescriptions.map((desc) => (
                    <div key={desc.id} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 mb-2">{desc.itemName}</h4>

                            {/* BEFORE Section */}
                            <div className="mb-3">
                              <div className="text-xs font-medium text-gray-500 mb-1">BEFORE:</div>
                              <p className="text-sm text-gray-600 line-through opacity-75 bg-gray-100 p-2 rounded">
                                {desc.originalDescription}
                              </p>
                            </div>

                            {/* AFTER Section */}
                            <div className="mb-3">
                              <div className="text-xs font-medium text-blue-600 mb-1">AFTER:</div>
                              <p className="text-sm text-gray-900 bg-white p-2 rounded border border-blue-200">
                                {desc.enhancedDescription}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {desc.improvements.map((improvement, index) => (
                                <Badge key={index} className="bg-green-100 text-green-700 border-green-200 text-xs">
                                  {improvement}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-3 border-t border-blue-200">
                          <Button
                            onClick={() => handleApplyDescription(desc)}
                            size="sm"
                            className="bg-gray-900 text-white hover:bg-gray-700 h-7 px-3 text-xs"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Apply
                          </Button>
                          <Button
                            onClick={() => handleRegenerateDescription(desc)}
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50 h-7 px-3 text-xs"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Regenerate
                          </Button>
                          <Button
                            onClick={() => handleRejectDescription(desc)}
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
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No descriptions to review. All have been applied or rejected.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
