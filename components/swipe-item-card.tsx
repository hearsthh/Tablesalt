"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Star,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  GripVertical,
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

interface SwipeItemCardProps {
  item: MenuItem
  isSelected: boolean
  isReorderMode: boolean
  onSelect: (itemId: string) => void
  onTap: (item: MenuItem) => void
  onEdit: (item: MenuItem) => void
  onDelete: (itemId: string) => void
  onMoveUp: (itemId: string) => void
  onMoveDown: (itemId: string) => void
  onToggleStock: (itemId: string) => void
  canMoveUp: boolean
  canMoveDown: boolean
  onDragStart?: (e: React.DragEvent, itemId: string) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent, targetId: string) => void
}

export function SwipeItemCard({
  item,
  isSelected,
  isReorderMode,
  onSelect,
  onTap,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleStock,
  canMoveUp,
  canMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
}: SwipeItemCardProps) {
  const [isDragging, setIsDragging] = useState(false)

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case "high":
        return "bg-green-50 text-green-700 border-green-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getProfitabilityColor = (profitability: string) => {
    switch (profitability) {
      case "high":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "low":
        return "bg-rose-50 text-rose-700 border-rose-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-green-600" />
    if (trend === "down") return <TrendingDown className="h-3 w-3 text-red-600" />
    return null
  }

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    if (onDragStart) {
      onDragStart(e, item.id)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (onDragOver) {
      onDragOver(e)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    if (onDrop) {
      onDrop(e, item.id)
    }
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 border-blue-300" : "hover:shadow-md"
      } ${isDragging ? "opacity-50 rotate-2 scale-95" : ""} ${item.isOutOfStock ? "opacity-60" : ""}`}
      draggable={isReorderMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Selection Checkbox or Drag Handle */}
          <div className="flex-shrink-0 mt-1">
            {isReorderMode ? (
              <div className="cursor-grab active:cursor-grabbing p-1">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
            ) : (
              <Checkbox checked={isSelected} onCheckedChange={() => onSelect(item.id)} />
            )}
          </div>

          {/* Item Image */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
              {item.image ? (
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 pr-2">
                <h3
                  className="font-semibold text-gray-900 text-sm cursor-pointer hover:text-blue-600 line-clamp-1"
                  onClick={() => onTap(item)}
                >
                  {item.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-gray-900 text-sm">${item.price.toFixed(2)}</div>
                {item.rating > 0 && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    {item.rating}
                  </div>
                )}
              </div>
            </div>

            {/* Tags and Metrics */}
            <div className="flex flex-wrap items-center gap-1 mb-3">
              <Badge className={`text-xs px-2 py-0.5 ${getPopularityColor(item.popularity)}`}>{item.popularity}</Badge>
              <Badge className={`text-xs px-2 py-0.5 ${getProfitabilityColor(item.profitability)}`}>
                {item.profitability} profit
              </Badge>
              {item.isOutOfStock && (
                <Badge className="bg-red-50 text-red-700 border-red-200 text-xs px-2 py-0.5">Out of Stock</Badge>
              )}
              {item.trend !== "stable" && (
                <div className="flex items-center text-xs">
                  {getTrendIcon(item.trend)}
                  <span className={`ml-1 ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {item.trendValue}%
                  </span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span className="truncate">{item.orders} orders</span>
              <span className="truncate">${item.revenue.toFixed(0)} revenue</span>
              {item.preparationTime && <span className="truncate">{item.preparationTime}min prep</span>}
            </div>

            {/* Action Buttons */}
            {!isReorderMode && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="text-xs bg-transparent h-7 px-2"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleStock(item.id)}
                    className={`text-xs h-7 px-2 ${
                      item.isOutOfStock
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    }`}
                  >
                    {item.isOutOfStock ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Enable
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Disable
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveUp(item.id)}
                    disabled={!canMoveUp}
                    className="text-xs bg-transparent h-7 w-7 p-0"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveDown(item.id)}
                    disabled={!canMoveDown}
                    className="text-xs bg-transparent h-7 w-7 p-0"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-700 bg-transparent text-xs h-7 w-7 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
