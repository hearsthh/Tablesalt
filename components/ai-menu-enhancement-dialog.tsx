"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ChefHat, Tag, FileText, DollarSign, ListOrdered, ChevronRight } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  description?: string
  dietaryTags?: string[]
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

export function AIMenuEnhancementDialog({
  open,
  onOpenChange,
  menuItems = [],
  categories = [],
  onItemsUpdate,
  onCategoriesUpdate,
}: AIMenuEnhancementDialogProps) {
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null)

  const tools = [
    {
      id: "combos" as AITool,
      name: "AI Combos",
      description: "Generate smart combo deals",
      icon: ChefHat,
    },
    {
      id: "tags" as AITool,
      name: "AI Tags",
      description: "Smart dietary tagging",
      icon: Tag,
    },
    {
      id: "descriptions" as AITool,
      name: "AI Descriptions",
      description: "Enhanced menu descriptions",
      icon: FileText,
    },
    {
      id: "pricing" as AITool,
      name: "Menu Pricing",
      description: "Dynamic pricing optimization",
      icon: DollarSign,
    },
    {
      id: "ordering" as AITool,
      name: "Menu Ordering",
      description: "Optimize item positioning",
      icon: ListOrdered,
    },
  ]

  const handleToolSelect = (toolId: AITool) => {
    setSelectedTool(toolId)
    // Simple demo functionality
    if (onItemsUpdate) {
      const updatedItems = menuItems.map((item) => ({
        ...item,
        description: `AI-enhanced: ${item.description || item.name}`,
      }))
      onItemsUpdate(updatedItems)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <DialogTitle>AI Menu Enhancement</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">Choose an AI tool to enhance your menu:</p>

          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Card
                key={tool.id}
                className="cursor-pointer hover:bg-blue-50 border-gray-200"
                onClick={() => handleToolSelect(tool.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 p-2 rounded-md">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{tool.name}</h3>
                      <p className="text-xs text-gray-600">{tool.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
