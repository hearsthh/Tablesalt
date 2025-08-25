"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { X, Tag, DollarSign, Eye, EyeOff, Trash2, Copy, Archive } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  isOutOfStock: boolean
  dietaryTags: string[]
}

interface Category {
  id: string
  name: string
  items: MenuItem[]
  sortOrder: number
}

interface MenuBulkActionsProps {
  selectedItems: MenuItem[]
  categories: Category[]
  onAction: (action: string, data?: any) => void
  onClose: () => void
}

export function MenuBulkActions({ selectedItems, categories, onAction, onClose }: MenuBulkActionsProps) {
  const [activeAction, setActiveAction] = useState<string>("")
  const [bulkPrice, setBulkPrice] = useState("")
  const [priceAction, setPriceAction] = useState("increase")
  const [priceType, setPriceType] = useState("percentage")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [targetCategory, setTargetCategory] = useState("")

  const availableTags = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Spicy",
    "Popular",
    "Chef's Special",
    "Seasonal",
    "Healthy",
    "Comfort Food",
  ]

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleApplyAction = () => {
    switch (activeAction) {
      case "price":
        onAction("bulk_price", {
          items: selectedItems.map((item) => item.id),
          action: priceAction,
          value: bulkPrice,
          type: priceType,
        })
        break
      case "tags":
        onAction("bulk_tags", {
          items: selectedItems.map((item) => item.id),
          tags: selectedTags,
        })
        break
      case "category":
        onAction("bulk_category", {
          items: selectedItems.map((item) => item.id),
          category: targetCategory,
        })
        break
      case "visibility":
        onAction("bulk_visibility", {
          items: selectedItems.map((item) => item.id),
          visible: true,
        })
        break
      case "hide":
        onAction("bulk_visibility", {
          items: selectedItems.map((item) => item.id),
          visible: false,
        })
        break
      case "duplicate":
        onAction("bulk_duplicate", {
          items: selectedItems.map((item) => item.id),
        })
        break
      case "delete":
        onAction("bulk_delete", {
          items: selectedItems.map((item) => item.id),
        })
        break
    }
    onClose()
  }

  const renderActionContent = () => {
    switch (activeAction) {
      case "price":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Action</Label>
                <Select value={priceAction} onValueChange={setPriceAction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Increase</SelectItem>
                    <SelectItem value="decrease">Decrease</SelectItem>
                    <SelectItem value="set">Set to</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <Select value={priceType} onValueChange={setPriceType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Value {priceType === "percentage" ? "(%)" : "($)"}</Label>
              <input
                type="number"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder={priceType === "percentage" ? "10" : "2.50"}
              />
            </div>
          </div>
        )

      case "tags":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Select Tags to Add</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox checked={selectedTags.includes(tag)} onCheckedChange={() => handleTagToggle(tag)} />
                    <Label className="text-sm">{tag}</Label>
                  </div>
                ))}
              </div>
            </div>
            {selectedTags.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Selected Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} className="bg-blue-50 text-blue-700 border-blue-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case "category":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Move to Category</Label>
              <Select value={targetCategory} onValueChange={setTargetCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "delete":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Delete Items</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This will permanently delete {selectedItems.length} selected items. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Bulk Actions</span>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Items Summary */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-1">{selectedItems.length} items selected</div>
            <div className="text-xs text-blue-700">
              {selectedItems
                .slice(0, 3)
                .map((item) => item.name)
                .join(", ")}
              {selectedItems.length > 3 && ` and ${selectedItems.length - 3} more`}
            </div>
          </div>

          {!activeAction ? (
            /* Action Selection */
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setActiveAction("price")}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Update Prices
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setActiveAction("tags")}
              >
                <Tag className="h-4 w-4 mr-2" />
                Add Tags
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setActiveAction("category")}
              >
                <Archive className="h-4 w-4 mr-2" />
                Move to Category
              </Button>
              <Separator />
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setActiveAction("visibility")}
              >
                <Eye className="h-4 w-4 mr-2" />
                Make Visible
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setActiveAction("hide")}
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Items
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setActiveAction("duplicate")}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Items
              </Button>
              <Separator />
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                onClick={() => setActiveAction("delete")}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Items
              </Button>
            </div>
          ) : (
            /* Action Configuration */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Configure Action</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveAction("")} className="p-1">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {renderActionContent()}

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleApplyAction} className="flex-1">
                  Apply Changes
                </Button>
                <Button variant="outline" onClick={() => setActiveAction("")} className="flex-1">
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
