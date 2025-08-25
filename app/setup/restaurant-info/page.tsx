"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-provider"

interface RestaurantData {
  name: string
  cuisine: string
  phone: string
  address: string
  hours: string
  description: string
}

export default function RestaurantInfoPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [restaurantData, setRestaurantData] = useState<RestaurantData>({
    name: "",
    cuisine: "",
    phone: "",
    address: "",
    hours: "",
    description: "",
  })

  useEffect(() => {
    const loadRestaurantData = async () => {
      if (!user) return

      setLoading(true)
      try {
        const response = await fetch("/api/v1/restaurants")
        if (response.ok) {
          const { data } = await response.json()
          if (data) {
            setRestaurantData({
              name: data.name || "",
              cuisine: data.cuisine_type || "",
              phone: data.phone || "",
              address: data.address || "",
              hours: data.operating_hours || "",
              description: data.description || "",
            })
          }
        }
      } catch (error) {
        console.error("Failed to load restaurant data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRestaurantData()
  }, [user])

  const handleInputChange = (field: keyof RestaurantData, value: string) => {
    setRestaurantData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save restaurant data
      const restaurantResponse = await fetch("/api/v1/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurantData),
      })

      if (!restaurantResponse.ok) {
        throw new Error("Failed to save restaurant data")
      }

      // Update setup progress
      await fetch("/api/v1/setup/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "restaurant_info", completed: true }),
      })

      router.push("/restaurant-profile")
    } catch (error) {
      console.error("Failed to save restaurant data:", error)
      alert("Failed to save restaurant information. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
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
              <h1 className="text-xl font-bold">Restaurant Information</h1>
              <p className="text-sm text-gray-600">Step 3 of 3: Final restaurant details</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                Complete Setup
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Restaurant Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter restaurant name"
                    value={restaurantData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cuisine">Cuisine Type</Label>
                  <Input
                    id="cuisine"
                    placeholder="e.g., Italian, Mexican, Asian"
                    value={restaurantData.cuisine}
                    onChange={(e) => handleInputChange("cuisine", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    value={restaurantData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Street address"
                    value={restaurantData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hours">Operating Hours</Label>
                  <Input
                    id="hours"
                    placeholder="Mon-Sun: 11:00 AM - 10:00 PM"
                    value={restaurantData.hours}
                    onChange={(e) => handleInputChange("hours", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your restaurant"
                    value={restaurantData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
