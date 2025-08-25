"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Building2, MapPin, Phone, Mail, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function ReviewDataPage() {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Bella Vista Restaurant",
    description: "Authentic Italian cuisine with a modern twist",
    address: "123 Main Street, Downtown",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    phone: "(555) 123-4567",
    email: "info@bellavista.com",
    website: "www.bellavista.com",
    cuisineType: "Italian",
    priceRange: "$$",
    hours: "Mon-Sun: 11:00 AM - 10:00 PM",
  })

  const dataSummaries = [
    {
      title: "Menu Items",
      count: 47,
      icon: Building2,
      description: "Categories: Appetizers, Mains, Desserts, Beverages",
      source: "Square POS",
    },
    {
      title: "Customers",
      count: 1247,
      icon: MapPin,
      description: "Active customers with order history",
      source: "Square POS",
    },
    {
      title: "Reviews",
      count: 89,
      icon: Phone,
      description: "Average rating: 4.2/5 across platforms",
      source: "Google, Yelp",
    },
    {
      title: "Orders",
      count: 2156,
      icon: Mail,
      description: "Last 6 months transaction history",
      source: "Square POS",
    },
  ]

  const handleInputChange = (field: string, value: string) => {
    setRestaurantInfo((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/setup">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Review & Validate</h1>
              <p className="text-sm text-gray-600">Step 3 of 3: Review restaurant information</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Restaurant Info Form - Editable */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Restaurant Information
            </CardTitle>
            <p className="text-sm text-gray-600">Review and edit your restaurant details</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  value={restaurantInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cuisineType">Cuisine Type</Label>
                <Input
                  id="cuisineType"
                  value={restaurantInfo.cuisineType}
                  onChange={(e) => handleInputChange("cuisineType", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={restaurantInfo.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={restaurantInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={restaurantInfo.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={restaurantInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={restaurantInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={restaurantInfo.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="priceRange">Price Range</Label>
                <Input
                  id="priceRange"
                  value={restaurantInfo.priceRange}
                  onChange={(e) => handleInputChange("priceRange", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="hours">Operating Hours</Label>
              <Input
                id="hours"
                value={restaurantInfo.hours}
                onChange={(e) => handleInputChange("hours", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Summaries - Read Only */}
        <Card>
          <CardHeader>
            <CardTitle>Imported Data Summary</CardTitle>
            <p className="text-sm text-gray-600">
              Your data has been successfully imported. Access detailed views in their respective modules.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataSummaries.map((item, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg mr-4">
                    <item.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <span className="text-lg font-bold text-blue-600">{item.count}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{item.description}</p>
                    <p className="text-xs text-gray-500">Source: {item.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Link href="/setup/import-data">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Import
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="flex items-center gap-2">
              Complete Setup
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
