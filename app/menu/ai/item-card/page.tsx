"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ShoppingBag, Zap, Eye, Download, Share, ImageIcon, Wand2, Star, Clock } from "lucide-react"
import Link from "next/link"

const useToast = () => {
  const toast = (options: any) => {
    console.log("Toast:", options)
  }
  return { toast }
}

export default function ItemCardPage() {
  const [selectedItem, setSelectedItem] = useState("")
  const [customDescription, setCustomDescription] = useState("")
  const [cardStyle, setCardStyle] = useState("modern")
  const [showNutrition, setShowNutrition] = useState(false)
  const [showAllergens, setShowAllergens] = useState(true)
  const { toast } = useToast()

  const menuItems = [
    {
      id: "1",
      name: "Margherita Pizza",
      price: 16.5,
      description: "Classic pizza with fresh mozzarella and basil",
      category: "Pizza",
      rating: 4.8,
      prepTime: "12 min",
      allergens: ["Gluten", "Dairy"],
      nutrition: { calories: 280, protein: 12, carbs: 35, fat: 10 },
    },
    {
      id: "2",
      name: "Butter Chicken",
      price: 18.99,
      description: "Creamy tomato-based curry with tender chicken",
      category: "Main Course",
      rating: 4.7,
      prepTime: "15 min",
      allergens: ["Dairy", "Nuts"],
      nutrition: { calories: 420, protein: 28, carbs: 15, fat: 25 },
    },
    {
      id: "3",
      name: "Caesar Salad",
      price: 12.99,
      description: "Crisp romaine lettuce with parmesan and croutons",
      category: "Salads",
      rating: 4.3,
      prepTime: "8 min",
      allergens: ["Gluten", "Dairy", "Eggs"],
      nutrition: { calories: 180, protein: 8, carbs: 12, fat: 12 },
    },
  ]

  const cardStyles = [
    { id: "modern", name: "Modern Clean", description: "Minimalist design with clean lines" },
    { id: "elegant", name: "Elegant Classic", description: "Traditional with elegant typography" },
    { id: "vibrant", name: "Vibrant Colorful", description: "Bold colors and dynamic layout" },
    { id: "rustic", name: "Rustic Charm", description: "Warm, cozy design with natural feel" },
  ]

  const selectedItemData = menuItems.find((item) => item.id === selectedItem)

  const handleGenerateDescription = () => {
    if (!selectedItemData) return

    const aiDescriptions = [
      `Indulge in our signature ${selectedItemData.name.toLowerCase()}, crafted with the finest ingredients and traditional techniques that have been perfected over generations.`,
      `Experience the authentic flavors of our ${selectedItemData.name.toLowerCase()}, made fresh daily with locally sourced ingredients and served with passion.`,
      `Savor every bite of our ${selectedItemData.name.toLowerCase()}, a culinary masterpiece that combines traditional recipes with modern presentation.`,
    ]

    const randomDescription = aiDescriptions[Math.floor(Math.random() * aiDescriptions.length)]
    setCustomDescription(randomDescription)
    toast({ title: "AI description generated!", description: "New description has been created" })
  }

  const handleGenerateCard = () => {
    if (!selectedItem) {
      toast({ title: "Please select an item first" })
      return
    }
    toast({ title: "Item card generated!", description: "Your custom item card is ready" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/menu">
              <Button variant="ghost" size="sm" className="p-1 sm:px-3">
                <ArrowLeft className="h-4 w-4 mr-0 sm:mr-1" />
                <span className="hidden sm:inline">Back to Menu</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900">AI Item Card Generator</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Create stunning item cards with AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button variant="outline" size="sm" className="text-xs px-2 sm:px-3 bg-transparent">
              <Share className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs px-2 sm:px-3 bg-transparent">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button
              className="bg-black text-white hover:bg-gray-800 text-xs px-2 sm:px-3"
              onClick={handleGenerateCard}
              size="sm"
            >
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Generate</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Controls */}
          <div className="space-y-4 sm:space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Item Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShoppingBag className="h-4 w-4" />
                  Select Menu Item
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm">Menu Item</Label>
                  <Select value={selectedItem} onValueChange={setSelectedItem}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Choose an item to create card for" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} - ${item.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedItemData && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">{selectedItemData.name}</div>
                    <div className="text-xs text-gray-600">
                      {selectedItemData.category} • ${selectedItemData.price}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{selectedItemData.description}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Description */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wand2 className="h-4 w-4" />
                  AI Description Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm">Custom Description</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateDescription}
                      disabled={!selectedItem}
                      className="text-xs bg-transparent"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Generate AI
                    </Button>
                  </div>
                  <Textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Enter custom description or generate one with AI"
                    rows={4}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card Style */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Card Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {cardStyles.map((style) => (
                    <div
                      key={style.id}
                      className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                        cardStyle === style.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setCardStyle(style.id)}
                    >
                      <h3 className="font-medium text-sm">{style.name}</h3>
                      <p className="text-xs text-gray-500">{style.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Display Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Display Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show Nutrition Info</Label>
                  <Button
                    variant={showNutrition ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowNutrition(!showNutrition)}
                    className="text-xs"
                  >
                    {showNutrition ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show Allergens</Label>
                  <Button
                    variant={showAllergens ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowAllergens(!showAllergens)}
                    className="text-xs"
                  >
                    {showAllergens ? "On" : "Off"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="h-[calc(100vh-120px)]">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Eye className="h-4 w-4" />
                  Card Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto flex items-center justify-center">
                {selectedItemData ? (
                  <div className="bg-white border rounded-lg overflow-hidden shadow-lg max-w-sm w-full">
                    {/* Item Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-white opacity-50" />
                    </div>

                    {/* Item Details */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{selectedItemData.name}</h3>
                        <div className="text-lg font-bold text-green-600">${selectedItemData.price}</div>
                      </div>

                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span>{selectedItemData.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{selectedItemData.prepTime}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{customDescription || selectedItemData.description}</p>

                      {showAllergens && (
                        <div className="mb-3">
                          <div className="text-xs font-medium text-gray-700 mb-1">Allergens:</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedItemData.allergens.map((allergen) => (
                              <Badge key={allergen} className="text-xs bg-red-50 text-red-700 border-red-200">
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {showNutrition && (
                        <div className="border-t pt-3">
                          <div className="text-xs font-medium text-gray-700 mb-2">Nutrition (per serving):</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Calories: {selectedItemData.nutrition.calories}</div>
                            <div>Protein: {selectedItemData.nutrition.protein}g</div>
                            <div>Carbs: {selectedItemData.nutrition.carbs}g</div>
                            <div>Fat: {selectedItemData.nutrition.fat}g</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a menu item to see the card preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Export Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-16 flex-col gap-2 bg-transparent text-xs"
                    disabled={!selectedItem}
                  >
                    <Download className="h-4 w-4" />
                    <span>PNG Image</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex-col gap-2 bg-transparent text-xs"
                    disabled={!selectedItem}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>PDF Card</span>
                  </Button>
                </div>
                <div className="text-xs text-gray-500 text-center mt-2">
                  High-resolution files for print and digital use
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
