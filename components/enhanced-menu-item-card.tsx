"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, Flame, Leaf, Award, Gift, Zap, ChefHat, Heart, Sparkles } from "lucide-react"

interface MenuItemHighlight {
  type: "bestseller" | "new" | "seasonal" | "promotion" | "chef_special" | "healthy" | "spicy" | "limited"
  label: string
  color: string
  icon?: any
  priority: number
}

interface PromotionalOffer {
  type: "discount" | "combo" | "bogo" | "happy_hour"
  value: number
  label: string
  validUntil?: string
}

interface EnhancedMenuItemProps {
  id: string
  name: string
  description: string
  price: number
  image?: string
  rating: number
  preparationTime?: number
  highlights?: MenuItemHighlight[]
  promotion?: PromotionalOffer
  isOutOfStock?: boolean
  onClick?: () => void
  onEdit?: () => void
  onToggleStock?: () => void
  className?: string
}

export function EnhancedMenuItemCard({
  id,
  name,
  description,
  price,
  image,
  rating,
  preparationTime,
  highlights = [],
  promotion,
  isOutOfStock = false,
  onClick,
  onEdit,
  onToggleStock,
  className = "",
}: EnhancedMenuItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const getHighlightIcon = (type: string) => {
    switch (type) {
      case "bestseller":
        return Star
      case "new":
        return Sparkles
      case "seasonal":
        return Leaf
      case "promotion":
        return Gift
      case "chef_special":
        return ChefHat
      case "healthy":
        return Heart
      case "spicy":
        return Flame
      case "limited":
        return Zap
      default:
        return Award
    }
  }

  const sortedHighlights = highlights.sort((a, b) => a.priority - b.priority)
  const primaryHighlight = sortedHighlights[0]

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-200 ${isOutOfStock ? "opacity-60" : ""} ${className}`}
    >
      <div className="relative">
        {/* Image Section */}
        {image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <ChefHat className="h-8 w-8 text-gray-400" />
              </div>
            )}

            {/* Overlay for out of stock */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge className="bg-red-600 text-white">Out of Stock</Badge>
              </div>
            )}

            {/* Primary Highlight Badge */}
            {primaryHighlight && !isOutOfStock && (
              <div className="absolute top-2 left-2">
                <Badge
                  className="text-white text-xs font-medium flex items-center gap-1"
                  style={{ backgroundColor: primaryHighlight.color }}
                >
                  {primaryHighlight.icon && <primaryHighlight.icon className="h-3 w-3" />}
                  {primaryHighlight.label}
                </Badge>
              </div>
            )}

            {/* Promotion Badge */}
            {promotion && !isOutOfStock && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold animate-pulse">
                  {promotion.type === "discount" && `${promotion.value}% OFF`}
                  {promotion.type === "combo" && `COMBO DEAL`}
                  {promotion.type === "bogo" && `BOGO`}
                  {promotion.type === "happy_hour" && `HAPPY HOUR`}
                </Badge>
              </div>
            )}

            {/* Additional Highlights */}
            {sortedHighlights.length > 1 && (
              <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                {sortedHighlights.slice(1, 3).map((highlight, index) => {
                  const Icon = getHighlightIcon(highlight.type)
                  return (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: highlight.color }}
                      title={highlight.label}
                    >
                      <Icon className="h-3 w-3 text-white" />
                    </div>
                  )
                })}
                {sortedHighlights.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">
                    +{sortedHighlights.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate">{name}</h3>
                {promotion && (
                  <div className="text-sm text-orange-600 font-medium mt-1">
                    {promotion.label}
                    {promotion.validUntil && <span className="text-gray-500 ml-1">• Until {promotion.validUntil}</span>}
                  </div>
                )}
              </div>
              <div className="ml-3 flex-shrink-0 text-right">
                {promotion && promotion.type === "discount" ? (
                  <div>
                    <div className="text-sm text-gray-500 line-through">${price.toFixed(2)}</div>
                    <div className="text-lg font-bold text-green-600">
                      ${(price * (1 - promotion.value / 100)).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <div className="text-lg font-bold text-gray-900">${price.toFixed(2)}</div>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{description}</p>

            {/* Highlights without icons (for items without images) */}
            {!image && highlights.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {highlights.slice(0, 3).map((highlight, index) => {
                  const Icon = getHighlightIcon(highlight.type)
                  return (
                    <Badge
                      key={index}
                      className="text-xs flex items-center gap-1"
                      style={{
                        backgroundColor: `${highlight.color}20`,
                        color: highlight.color,
                        borderColor: `${highlight.color}40`,
                      }}
                      variant="outline"
                    >
                      <Icon className="h-3 w-3" />
                      {highlight.label}
                    </Badge>
                  )
                })}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                {rating > 0 && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                )}
                {preparationTime && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{preparationTime}m</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit()
                    }}
                    className="h-8 px-3 text-xs"
                  >
                    Edit
                  </Button>
                )}
                {onToggleStock && (
                  <Button
                    variant={isOutOfStock ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleStock()
                    }}
                    className={`h-8 px-3 text-xs ${
                      isOutOfStock ? "bg-green-600 hover:bg-green-700 text-white" : "text-red-600 hover:text-red-700"
                    }`}
                  >
                    {isOutOfStock ? "Enable" : "Disable"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
