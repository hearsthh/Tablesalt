"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageIcon, Edit } from "lucide-react"
import { ImageService } from "@/lib/image-utils"

interface MenuItem {
  id: string
  name: string
  price: number
  description?: string
  image?: string
  dietaryTags?: string[]
  isOutOfStock?: boolean
  popularity?: string
  spiceLevel?: number
}

interface MenuItemCardProps {
  item: MenuItem
  onEdit?: (item: MenuItem) => void
  onToggleStock?: (item: MenuItem) => void
  className?: string
}

export function MenuItemCard({ item, onEdit, onToggleStock, className }: MenuItemCardProps) {
  const optimizedImageUrl = item.image ? ImageService.getOptimizedImageUrl(item.image, 300, 200) : null

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {optimizedImageUrl ? (
          <img
            src={optimizedImageUrl || "/placeholder.svg"}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(item.name)}`
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {item.isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}

        <div className="absolute top-2 right-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={() => onEdit?.(item)}
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</h3>
          <span className="font-bold text-gray-900 text-sm">${item.price.toFixed(2)}</span>
        </div>

        {item.description && <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>}

        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {item.dietaryTags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                {tag}
              </Badge>
            ))}
            {item.spiceLevel && item.spiceLevel > 0 && (
              <Badge variant="outline" className="text-xs px-2 py-0">
                🌶️ {item.spiceLevel}
              </Badge>
            )}
          </div>

          {item.popularity && (
            <Badge variant={item.popularity === "high" ? "default" : "secondary"} className="text-xs">
              {item.popularity}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
