"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share2, Star, Clock, Users } from "lucide-react"
import Link from "next/link"

interface MenuItemVariant {
  id: string
  name: string
  price: number
  isDefault: boolean
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  rating?: number
  preparationTime?: number
  dietaryTags?: string[]
  allergens?: string[]
  isOutOfStock?: boolean
  variants?: MenuItemVariant[]
}

interface Category {
  id: string
  name: string
  items: MenuItem[]
}

export default function MenuPreviewPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Bella Vista",
    cuisine: "Italian • Mediterranean • Pizza",
    rating: 4.7,
    deliveryTime: "15-25 min",
    capacity: "2-6 people",
  })

  // Sample menu data for preview
  const sampleMenuData: Category[] = [
    {
      id: "1",
      name: "Main Course",
      items: [
        {
          id: "1",
          name: "Butter Chicken",
          description: "Creamy tomato-based curry with tender chicken",
          price: 18.99,
          category: "Main Course",
          image: "/butter-chicken.png",
          rating: 4.7,
          preparationTime: 15,
          dietaryTags: ["Popular", "Chef's Choice"],
          allergens: ["Dairy", "Gluten"],
          variants: [
            { id: "v1", name: "Regular", price: 18.99, isDefault: true },
            { id: "v2", name: "Large", price: 22.99, isDefault: false },
          ],
        },
        {
          id: "4",
          name: "Mushroom Risotto",
          description: "Creamy arborio rice with wild mushrooms",
          price: 19.99,
          category: "Main Course",
          image: "/mushroom-risotto.png",
          rating: 4.5,
          preparationTime: 20,
          dietaryTags: ["Vegetarian"],
          allergens: ["Dairy", "Gluten"],
          variants: [{ id: "v3", name: "Regular", price: 19.99, isDefault: true }],
        },
      ],
    },
    {
      id: "2",
      name: "Pizza",
      items: [
        {
          id: "2",
          name: "Margherita Pizza",
          description: "Classic pizza with fresh mozzarella and basil",
          price: 16.5,
          category: "Pizza",
          image: "/margherita-pizza.png",
          rating: 4.8,
          preparationTime: 18,
          dietaryTags: ["Vegetarian", "Popular"],
          allergens: ["Dairy", "Gluten"],
          variants: [
            { id: "v6", name: 'Personal (8")', price: 12.5, isDefault: false },
            { id: "v7", name: 'Medium (12")', price: 16.5, isDefault: true },
            { id: "v8", name: 'Large (16")', price: 22.5, isDefault: false },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "Salads",
      items: [
        {
          id: "3",
          name: "Caesar Salad",
          description: "Crisp romaine lettuce with parmesan and croutons",
          price: 12.99,
          category: "Salads",
          image: "/caesar-salad.png",
          rating: 4.3,
          preparationTime: 8,
          dietaryTags: ["Vegetarian", "Fresh & Light"],
          allergens: ["Dairy", "Gluten", "Eggs"],
          variants: [
            { id: "v9", name: "Regular", price: 12.99, isDefault: true },
            { id: "v10", name: "Large", price: 16.99, isDefault: false },
          ],
        },
      ],
    },
  ]

  useEffect(() => {
    // Try to load menu data from localStorage first
    try {
      const savedMenuData = localStorage.getItem("currentMenuData")
      if (savedMenuData) {
        const parsedData = JSON.parse(savedMenuData)
        if (parsedData && parsedData.length > 0) {
          setCategories(parsedData)
          return
        }
      }
    } catch (error) {
      console.error("Error loading menu data:", error)
    }

    // Fall back to sample data
    setCategories(sampleMenuData)
  }, [])

  const allItems = categories.flatMap((cat) => cat.items)
  const filteredCategories =
    selectedCategory === "all"
      ? categories
      : categories.filter((cat) => cat.name.toLowerCase() === selectedCategory.toLowerCase())

  const renderFoodTags = (item: MenuItem) => {
    const tags = []

    // Dietary tags
    if (item.dietaryTags?.includes("Vegetarian")) {
      tags.push(
        <Badge key="vegetarian" className="bg-green-50 text-green-700 border-green-200 text-xs">
          🌱 Vegetarian
        </Badge>,
      )
    }

    if (item.dietaryTags?.includes("Popular")) {
      tags.push(
        <Badge key="popular" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
          ⭐ Popular
        </Badge>,
      )
    }

    if (item.dietaryTags?.includes("Chef's Choice")) {
      tags.push(
        <Badge key="chefs-choice" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
          👨‍🍳 Chef's Choice
        </Badge>,
      )
    }

    if (item.dietaryTags?.includes("Fresh & Light")) {
      tags.push(
        <Badge key="fresh-light" className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs">
          🥗 Fresh & Light
        </Badge>,
      )
    }

    return tags.length > 0 ? <div className="flex flex-wrap gap-1 mt-2">{tags}</div> : null
  }

  const renderVariants = (item: MenuItem) => {
    if (!item.variants || item.variants.length <= 1) return null

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
        <div className="text-sm font-medium text-gray-900 mb-2">Size Options:</div>
        <div className="space-y-2">
          {item.variants.map((variant) => (
            <div key={variant.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{variant.name}</span>
                {variant.isDefault && (
                  <Badge variant="outline" className="text-xs">
                    Default
                  </Badge>
                )}
              </div>
              <span className="text-sm font-semibold text-gray-900">${variant.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <Link href="/menu">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </header>

      {/* Restaurant Header */}
      <div className="bg-gradient-to-br from-orange-100 to-red-100 px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">BV</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{restaurantInfo.name}</h1>
          <p className="text-gray-600 mb-4">{restaurantInfo.cuisine}</p>
          <p className="text-gray-800 mb-4">Authentic Italian cuisine crafted with love and the finest ingredients</p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {restaurantInfo.deliveryTime}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {restaurantInfo.capacity}
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
              {restaurantInfo.rating} rating
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-16 z-40">
        <div className="flex space-x-2 overflow-x-auto">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name.toLowerCase() ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.name.toLowerCase())}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No items available in this category</p>
            <Button variant="outline" onClick={() => setSelectedCategory("all")} className="mt-4">
              View All Items
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <div key={category.id}>
                {selectedCategory === "all" && (
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h2>
                )}
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="p-4">
                        <div className="flex space-x-4">
                          {item.image && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                              <span className="text-lg font-bold text-gray-900 ml-3">${item.price.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 leading-relaxed">{item.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                              {item.rating && (
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                  {item.rating}
                                </div>
                              )}
                              {item.preparationTime && (
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {item.preparationTime}m
                                </div>
                              )}
                              {item.isOutOfStock && <div className="text-red-600 font-medium">Out of Stock</div>}
                            </div>
                            {renderFoodTags(item)}
                            {renderVariants(item)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
