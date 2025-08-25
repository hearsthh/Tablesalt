"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Edit, Save, Clock, Users, Star, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function RestaurantProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [restaurantData, setRestaurantData] = useState({
    name: "Bella Vista Restaurant",
    description: "Authentic Italian cuisine with a modern twist",
    address: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    email: "info@bellavista.com",
    website: "www.bellavista.com",
    cuisineType: "Italian",
    priceRange: "$$",
    lastUpdated: "2024-01-15 10:30 AM",
  })

  const dataSummaries = [
    {
      title: "Menu Items",
      count: 47,
      lastSync: "2024-01-15 09:15 AM",
      source: "Square POS",
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Customers",
      count: 1247,
      lastSync: "2024-01-15 08:45 AM",
      source: "Square POS",
      icon: Users,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Reviews",
      count: 89,
      lastSync: "2024-01-14 11:20 PM",
      source: "Google & Yelp",
      icon: Star,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Orders",
      count: 2156,
      lastSync: "2024-01-15 10:00 AM",
      source: "Multiple Sources",
      icon: Clock,
      color: "bg-purple-100 text-purple-700",
    },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Restaurant Profile</h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Manage your restaurant information and view data summaries
            </p>
          </div>
          <Button
            variant={isEditing ? "outline" : "default"}
            size="sm"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="flex items-center space-x-1"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        {/* Restaurant Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl">Restaurant Information</CardTitle>
              <Badge variant="secondary" className="text-xs">
                Last updated: {restaurantData.lastUpdated}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Restaurant Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={restaurantData.name}
                    onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{restaurantData.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cuisineType" className="text-sm font-medium">
                  Cuisine Type
                </Label>
                {isEditing ? (
                  <Input
                    id="cuisineType"
                    value={restaurantData.cuisineType}
                    onChange={(e) => setRestaurantData({ ...restaurantData, cuisineType: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{restaurantData.cuisineType}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={restaurantData.description}
                  onChange={(e) => setRestaurantData({ ...restaurantData, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{restaurantData.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={restaurantData.phone}
                    onChange={(e) => setRestaurantData({ ...restaurantData, phone: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{restaurantData.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    value={restaurantData.email}
                    onChange={(e) => setRestaurantData({ ...restaurantData, email: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{restaurantData.email}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={restaurantData.address}
                  onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{restaurantData.address}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Summaries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Data Summaries</CardTitle>
            <p className="text-sm text-gray-600">Overview of your imported data with last sync timestamps</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dataSummaries.map((summary, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${summary.color}`}>
                        <summary.icon className="h-4 w-4" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{summary.count}</span>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">{summary.title}</h4>
                    <p className="text-xs text-gray-500 mb-1">Source: {summary.source}</p>
                    <p className="text-xs text-gray-400">Last sync: {summary.lastSync}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
