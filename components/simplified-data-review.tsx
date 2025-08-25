"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, ShoppingCart, Users, Star, Database, CheckCircle, Edit3, ArrowRight } from "lucide-react"

interface ReviewData {
  type: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  summary: {
    total: number
    confidence: number
    lastUpdated: string
  }
  details?: any
  editable: boolean
}

interface SimplifiedDataReviewProps {
  importedData: any[]
  onReviewComplete: (reviewedData: any) => void
  onBack: () => void
}

export function SimplifiedDataReview({ importedData, onReviewComplete, onBack }: SimplifiedDataReviewProps) {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Bella Vista Restaurant",
    address: "123 Main Street, Downtown",
    phone: "+1 (555) 123-4567",
    email: "info@bellavista.com",
    website: "www.bellavista.com",
    description: "Authentic Italian cuisine in the heart of downtown",
    hours: "Mon-Sun: 11:00 AM - 10:00 PM",
    cuisine: "Italian",
    priceRange: "$$",
  })

  const [isEditing, setIsEditing] = useState(false)

  const reviewData: ReviewData[] = [
    {
      type: "restaurantInfo",
      label: "Restaurant Info",
      icon: Store,
      summary: { total: 1, confidence: 95, lastUpdated: "2024-01-15" },
      editable: true,
    },
    {
      type: "menu",
      label: "Menu Items",
      icon: ShoppingCart,
      summary: { total: 247, confidence: 98, lastUpdated: "2024-01-15" },
      editable: false,
    },
    {
      type: "customers",
      label: "Customer Data",
      icon: Users,
      summary: { total: 1247, confidence: 92, lastUpdated: "2024-01-15" },
      editable: false,
    },
    {
      type: "reviews",
      label: "Reviews",
      icon: Star,
      summary: { total: 531, confidence: 96, lastUpdated: "2024-01-14" },
      editable: false,
    },
    {
      type: "orders",
      label: "Order History",
      icon: Database,
      summary: { total: 3421, confidence: 94, lastUpdated: "2024-01-15" },
      editable: false,
    },
  ]

  const handleSaveRestaurantInfo = () => {
    setIsEditing(false)
  }

  const handleComplete = () => {
    onReviewComplete({
      restaurantInfo,
      summaries: reviewData.filter((item) => !item.editable),
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Review Your Data</CardTitle>
              <CardDescription className="text-sm">Review restaurant info and data summaries</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onBack}>
              Back
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="restaurant" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="restaurant" className="text-xs sm:text-sm">
            Restaurant Info
          </TabsTrigger>
          <TabsTrigger value="summaries" className="text-xs sm:text-sm">
            Data Summaries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Store className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Restaurant Information</CardTitle>
                    <CardDescription className="text-xs">Review and edit your restaurant details</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit3 className="w-3 h-3 mr-1" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm">
                        Restaurant Name
                      </Label>
                      <Input
                        id="name"
                        value={restaurantInfo.name}
                        onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={restaurantInfo.phone}
                        onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-sm">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={restaurantInfo.address}
                      onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={restaurantInfo.email}
                        onChange={(e) => setRestaurantInfo({ ...restaurantInfo, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-sm">
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={restaurantInfo.website}
                        onChange={(e) => setRestaurantInfo({ ...restaurantInfo, website: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={restaurantInfo.description}
                      onChange={(e) => setRestaurantInfo({ ...restaurantInfo, description: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleSaveRestaurantInfo} className="w-full sm:w-auto">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Name:</span>
                      <p className="mt-1">{restaurantInfo.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Phone:</span>
                      <p className="mt-1">{restaurantInfo.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-gray-600">Address:</span>
                      <p className="mt-1">{restaurantInfo.address}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <p className="mt-1">{restaurantInfo.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Website:</span>
                      <p className="mt-1">{restaurantInfo.website}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-gray-600">Description:</span>
                      <p className="mt-1">{restaurantInfo.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summaries" className="space-y-3">
          {reviewData
            .filter((item) => !item.editable)
            .map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.type}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{item.label}</h4>
                          <p className="text-xs text-gray-600">{item.summary.total} items imported</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          {item.summary.confidence}% confidence
                        </Badge>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </TabsContent>
      </Tabs>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h4 className="font-semibold text-green-900 text-sm">Review Complete</h4>
              <p className="text-xs text-green-700">Ready to finalize your restaurant setup</p>
            </div>
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <ArrowRight className="w-4 h-4 mr-1" />
              Complete Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
