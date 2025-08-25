"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Layout, Star, Crown, Eye, Sparkles, Coffee, Pizza, Utensils, Wine, Cake } from "lucide-react"

interface MenuTemplate {
  id: string
  name: string
  description: string
  category: string
  cuisineType: string
  isPremium: boolean
  isFeatured: boolean
  usageCount: number
  rating: number
  previewImage: string
  colorScheme: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  layoutConfig: {
    columns: number
    showImages: boolean
    showPrices: boolean
    showDescriptions: boolean
    fontFamily: string
  }
}

interface MenuTemplatesProps {
  onSelectTemplate: (template: MenuTemplate) => void
}

export function MenuTemplates({ onSelectTemplate }: MenuTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCuisine, setSelectedCuisine] = useState("all")
  const [showPreview, setShowPreview] = useState<MenuTemplate | null>(null)
  const [showCustomize, setShowCustomize] = useState<MenuTemplate | null>(null)

  const templates: MenuTemplate[] = [
    {
      id: "1",
      name: "Classic Elegance",
      description: "Timeless design with clean typography and elegant spacing",
      category: "fine-dining",
      cuisineType: "international",
      isPremium: false,
      isFeatured: true,
      usageCount: 1247,
      rating: 4.8,
      previewImage: "/template-classic.jpg",
      colorScheme: {
        primary: "#2c3e50",
        secondary: "#7f8c8d",
        accent: "#e74c3c",
        background: "#ffffff",
      },
      layoutConfig: {
        columns: 2,
        showImages: true,
        showPrices: true,
        showDescriptions: true,
        fontFamily: "serif",
      },
    },
    {
      id: "2",
      name: "Modern Minimalist",
      description: "Clean, contemporary design with focus on readability",
      category: "casual",
      cuisineType: "modern",
      isPremium: false,
      isFeatured: true,
      usageCount: 892,
      rating: 4.6,
      previewImage: "/template-modern.jpg",
      colorScheme: {
        primary: "#34495e",
        secondary: "#95a5a6",
        accent: "#3498db",
        background: "#ffffff",
      },
      layoutConfig: {
        columns: 1,
        showImages: true,
        showPrices: true,
        showDescriptions: true,
        fontFamily: "sans-serif",
      },
    },
    {
      id: "3",
      name: "Rustic Charm",
      description: "Warm, inviting design perfect for comfort food restaurants",
      category: "casual",
      cuisineType: "american",
      isPremium: true,
      isFeatured: false,
      usageCount: 634,
      rating: 4.7,
      previewImage: "/template-rustic.jpg",
      colorScheme: {
        primary: "#8b4513",
        secondary: "#daa520",
        accent: "#ff6347",
        background: "#faf0e6",
      },
      layoutConfig: {
        columns: 2,
        showImages: true,
        showPrices: true,
        showDescriptions: true,
        fontFamily: "serif",
      },
    },
    {
      id: "4",
      name: "Italian Trattoria",
      description: "Traditional Italian styling with warm colors and classic fonts",
      category: "ethnic",
      cuisineType: "italian",
      isPremium: true,
      isFeatured: true,
      usageCount: 756,
      rating: 4.9,
      previewImage: "/template-italian.jpg",
      colorScheme: {
        primary: "#2e7d32",
        secondary: "#c62828",
        accent: "#ffc107",
        background: "#fff8e1",
      },
      layoutConfig: {
        columns: 2,
        showImages: true,
        showPrices: true,
        showDescriptions: true,
        fontFamily: "serif",
      },
    },
    {
      id: "5",
      name: "Asian Fusion",
      description: "Modern Asian-inspired design with clean lines and bold accents",
      category: "ethnic",
      cuisineType: "asian",
      isPremium: false,
      isFeatured: false,
      usageCount: 423,
      rating: 4.5,
      previewImage: "/template-asian.jpg",
      colorScheme: {
        primary: "#d32f2f",
        secondary: "#424242",
        accent: "#ff9800",
        background: "#ffffff",
      },
      layoutConfig: {
        columns: 1,
        showImages: true,
        showPrices: true,
        showDescriptions: true,
        fontFamily: "sans-serif",
      },
    },
    {
      id: "6",
      name: "Cafe Cozy",
      description: "Perfect for cafes and coffee shops with warm, inviting colors",
      category: "cafe",
      cuisineType: "cafe",
      isPremium: false,
      isFeatured: false,
      usageCount: 567,
      rating: 4.4,
      previewImage: "/template-cafe.jpg",
      colorScheme: {
        primary: "#5d4037",
        secondary: "#8d6e63",
        accent: "#ff7043",
        background: "#fafafa",
      },
      layoutConfig: {
        columns: 2,
        showImages: true,
        showPrices: true,
        showDescriptions: false,
        fontFamily: "sans-serif",
      },
    },
  ]

  const categories = [
    { id: "all", name: "All Templates", icon: Layout },
    { id: "fine-dining", name: "Fine Dining", icon: Wine },
    { id: "casual", name: "Casual Dining", icon: Utensils },
    { id: "ethnic", name: "Ethnic Cuisine", icon: Pizza },
    { id: "cafe", name: "Cafe & Coffee", icon: Coffee },
    { id: "dessert", name: "Dessert & Bakery", icon: Cake },
  ]

  const cuisineTypes = [
    "all",
    "international",
    "american",
    "italian",
    "asian",
    "mexican",
    "indian",
    "french",
    "mediterranean",
    "modern",
    "cafe",
  ]

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesCuisine = selectedCuisine === "all" || template.cuisineType === selectedCuisine
    return matchesCategory && matchesCuisine
  })

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((cat) => cat.id === category)
    return categoryData ? categoryData.icon : Layout
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menu Templates</h2>
          <p className="text-gray-600">Choose from professionally designed menu templates</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {filteredTemplates.length} templates
        </Badge>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Category</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="justify-start h-auto p-3"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="text-sm">{category.name}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700">Cuisine Type</Label>
          <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cuisineTypes.map((cuisine) => (
                <SelectItem key={cuisine} value={cuisine}>
                  {cuisine === "all" ? "All Cuisines" : cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const CategoryIcon = getCategoryIcon(template.category)
          return (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={template.previewImage || "/placeholder.svg?height=200&width=300"}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex space-x-1">
                  {template.isFeatured && (
                    <Badge className="bg-blue-500 text-white text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {template.isPremium && (
                    <Badge className="bg-yellow-500 text-white text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowPreview(template)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{template.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CategoryIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-500 capitalize">{template.category.replace("-", " ")}</span>
                  </div>
                  <span className="text-xs text-gray-500">{template.usageCount.toLocaleString()} uses</span>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={() => onSelectTemplate(template)} className="flex-1" size="sm">
                    Use Template
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowCustomize(template)} className="px-3">
                    <Palette className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more templates.</p>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Preview: {showPreview?.name}</span>
              {showPreview?.isPremium && (
                <Badge className="bg-yellow-500 text-white text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {showPreview && (
            <div className="space-y-6">
              <img
                src={showPreview.previewImage || "/placeholder.svg?height=400&width=600"}
                alt={showPreview.name}
                className="w-full h-64 object-cover rounded-lg border"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Template Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="capitalize">{showPreview.category.replace("-", " ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cuisine:</span>
                      <span className="capitalize">{showPreview.cuisineType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{showPreview.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usage:</span>
                      <span>{showPreview.usageCount.toLocaleString()} restaurants</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Layout Configuration</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Columns:</span>
                      <span>{showPreview.layoutConfig.columns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Font:</span>
                      <span className="capitalize">{showPreview.layoutConfig.fontFamily}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Images:</span>
                      <span>{showPreview.layoutConfig.showImages ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Descriptions:</span>
                      <span>{showPreview.layoutConfig.showDescriptions ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPreview(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    onSelectTemplate(showPreview)
                    setShowPreview(null)
                  }}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Customize Dialog */}
      <Dialog open={!!showCustomize} onOpenChange={() => setShowCustomize(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize Template: {showCustomize?.name}</DialogTitle>
          </DialogHeader>
          {showCustomize && (
            <div className="space-y-6">
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Primary Color</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: showCustomize.colorScheme.primary }}
                        />
                        <Input value={showCustomize.colorScheme.primary} className="font-mono text-sm" readOnly />
                      </div>
                    </div>
                    <div>
                      <Label>Accent Color</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: showCustomize.colorScheme.accent }}
                        />
                        <Input value={showCustomize.colorScheme.accent} className="font-mono text-sm" readOnly />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Columns</Label>
                      <Select defaultValue={showCustomize.layoutConfig.columns.toString()}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Column</SelectItem>
                          <SelectItem value="2">2 Columns</SelectItem>
                          <SelectItem value="3">3 Columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Show Images</Label>
                      <Select defaultValue={showCustomize.layoutConfig.showImages.toString()}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-4">
                  <div>
                    <Label>Font Family</Label>
                    <Select defaultValue={showCustomize.layoutConfig.fontFamily}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="sans-serif">Sans Serif</SelectItem>
                        <SelectItem value="monospace">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCustomize(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onSelectTemplate(showCustomize)
                    setShowCustomize(null)
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Apply Customization
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
