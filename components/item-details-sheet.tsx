"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  Edit,
  Trash2,
  Camera,
  Eye,
  EyeOff,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Flame,
  Leaf,
  Wheat,
  AlertTriangle,
} from "lucide-react"

interface MenuItem {
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

interface ItemDetailsSheetProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onEdit: (item: MenuItem) => void
  onDelete: (itemId: string) => void
  onImageUpload: (itemId: string) => void
  onToggleStock: (itemId: string) => void
}

export function ItemDetailsSheet({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onImageUpload,
  onToggleStock,
}: ItemDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!item) return null

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />
    return <div className="h-4 w-4" />
  }

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
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

  const getProfitabilityColor = (profitability: string) => {
    switch (profitability) {
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

  const renderFoodTags = () => {
    const tags = []

    // Dietary tags
    if (item.dietaryTags.includes("Vegetarian")) {
      tags.push(
        <Badge key="vegetarian" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <Leaf className="h-3 w-3" /> Vegetarian
        </Badge>,
      )
    }

    if (item.dietaryTags.includes("Vegan")) {
      tags.push(
        <Badge key="vegan" className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
          <Leaf className="h-3 w-3" /> Vegan
        </Badge>,
      )
    }

    if (item.dietaryTags.includes("Gluten-Free") || item.dietaryTags.includes("Gluten-Free Available")) {
      tags.push(
        <Badge key="gluten-free" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
          <Wheat className="h-3 w-3" /> Gluten-Free
        </Badge>,
      )
    }

    // Spice level
    if (item.spiceLevel && item.spiceLevel > 0) {
      tags.push(
        <Badge key="spicy" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <Flame className="h-3 w-3" /> {item.spiceLevel > 2 ? "Spicy" : "Mild"}
        </Badge>,
      )
    }

    // Allergen warning if present
    if (item.allergens.length > 0) {
      tags.push(
        <Badge key="allergens" className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> Contains Allergens
        </Badge>,
      )
    }

    return tags.length > 0 ? <div className="flex flex-wrap gap-2">{tags}</div> : null
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] max-h-[90vh] flex flex-col">
        <SheetHeader className="flex-shrink-0 pb-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span>{item.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex-1 space-y-6 p-4">
              {/* Image and Basic Info */}
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    {item.image ? (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onImageUpload(item.id)}
                      className="absolute -bottom-2 -right-2 h-8 w-8 p-0"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        {item.rating}
                      </div>
                      {item.preparationTime && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {item.preparationTime}m
                        </div>
                      )}
                      <Badge className={item.isOutOfStock ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}>
                        {item.isOutOfStock ? "Out of Stock" : "Available"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Food Tags */}
                {renderFoodTags()}
              </div>

              <Separator />

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Popularity</span>
                    <Badge className={`text-xs ${getPopularityColor(item.popularity)}`}>{item.popularity}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profitability</span>
                    <Badge className={`text-xs ${getProfitabilityColor(item.profitability)}`}>
                      {item.profitability}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Orders</span>
                    <span className="text-sm font-medium">{item.orders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="text-sm font-medium">${item.revenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 space-y-6 p-4">
              {/* Trend Analysis */}
              <div className="space-y-4">
                <h4 className="font-medium">Performance Trends</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Trend</span>
                      {getTrendIcon(item.trend)}
                    </div>
                    <div className="text-lg font-semibold">
                      {item.trend === "up" ? "+" : item.trend === "down" ? "-" : ""}
                      {Math.abs(item.trendValue)}%
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Revenue Change</span>
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-lg font-semibold">
                      {item.revenueChange > 0 ? "+" : ""}
                      {item.revenueChange}%
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cost Analysis */}
              {item.costPrice && (
                <div className="space-y-4">
                  <h4 className="font-medium">Cost Analysis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Cost Price</div>
                      <div className="text-lg font-semibold">${item.costPrice.toFixed(2)}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Profit Margin</div>
                      <div className="text-lg font-semibold">
                        {(((item.price - item.costPrice) / item.price) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="flex-1 space-y-6 p-4">
              {/* Allergens */}
              {item.allergens.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Allergens</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.allergens.map((allergen) => (
                      <Badge key={allergen} className="bg-orange-50 text-orange-700 border-orange-200">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietary Tags */}
              {item.dietaryTags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Dietary Information</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.dietaryTags.map((tag) => (
                      <Badge key={tag} className="bg-blue-50 text-blue-700 border-blue-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutritional Info */}
              {item.nutritionalInfo && Object.keys(item.nutritionalInfo).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Nutritional Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(item.nutritionalInfo).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="space-y-2">
                <h4 className="font-medium">Additional Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  {item.preparationTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prep Time:</span>
                      <span className="font-medium">{item.preparationTime} minutes</span>
                    </div>
                  )}
                  {item.spiceLevel !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Spice Level:</span>
                      <span className="font-medium">{item.spiceLevel}/5</span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 pt-4 border-t bg-white">
          <div className="flex space-x-2">
            <Button onClick={() => onEdit(item)} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant={item.isOutOfStock ? "default" : "outline"}
              onClick={() => onToggleStock(item.id)}
              className="flex-1"
            >
              {item.isOutOfStock ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Enable
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Disable
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => onDelete(item.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
