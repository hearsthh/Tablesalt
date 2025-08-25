"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  Eye,
  Plus,
  Trash2,
  Copy,
  RefreshCw,
  Sun,
  Snowflake,
  Leaf,
  Flower,
  Clock,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface SeasonalTheme {
  id: string
  name: string
  season: "spring" | "summer" | "fall" | "winter"
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  fonts: {
    heading: string
    body: string
  }
  imagery: string
  isActive: boolean
  startDate: string
  endDate: string
  description: string
}

interface SeasonalMenuItem {
  id: string
  name: string
  description: string
  category: string
  season: string[]
  isPromoted: boolean
  specialPrice?: number
  originalPrice: number
}

export default function SeasonalMenuPage() {
  const [activeTab, setActiveTab] = useState("themes")
  const [themes, setThemes] = useState<SeasonalTheme[]>([])
  const [seasonalItems, setSeasonalItems] = useState<SeasonalMenuItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<string>("")

  // Sample seasonal themes
  const sampleThemes: SeasonalTheme[] = [
    {
      id: "summer_fresh",
      name: "Summer Fresh",
      season: "summer",
      colors: {
        primary: "#fbbf24",
        secondary: "#34d399",
        accent: "#60a5fa",
        background: "#fef3c7",
      },
      fonts: {
        heading: "Inter",
        body: "System UI",
      },
      imagery: "fresh_fruits_and_vegetables",
      isActive: false,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      description: "Bright, fresh theme highlighting seasonal summer ingredients and light dishes",
    },
    {
      id: "winter_comfort",
      name: "Winter Comfort",
      season: "winter",
      colors: {
        primary: "#dc2626",
        secondary: "#92400e",
        accent: "#1f2937",
        background: "#fef2f2",
      },
      fonts: {
        heading: "Inter",
        body: "System UI",
      },
      imagery: "warm_comfort_foods",
      isActive: false,
      startDate: "2024-12-01",
      endDate: "2025-02-28",
      description: "Warm, cozy theme emphasizing hearty comfort foods and hot beverages",
    },
    {
      id: "spring_renewal",
      name: "Spring Renewal",
      season: "spring",
      colors: {
        primary: "#10b981",
        secondary: "#f59e0b",
        accent: "#8b5cf6",
        background: "#ecfdf5",
      },
      fonts: {
        heading: "Inter",
        body: "System UI",
      },
      imagery: "fresh_greens_and_flowers",
      isActive: true,
      startDate: "2024-03-01",
      endDate: "2024-05-31",
      description: "Fresh, vibrant theme celebrating new seasonal ingredients and lighter fare",
    },
    {
      id: "autumn_harvest",
      name: "Autumn Harvest",
      season: "fall",
      colors: {
        primary: "#f97316",
        secondary: "#92400e",
        accent: "#7c2d12",
        background: "#fff7ed",
      },
      fonts: {
        heading: "Inter",
        body: "System UI",
      },
      imagery: "harvest_vegetables_and_spices",
      isActive: false,
      startDate: "2024-09-01",
      endDate: "2024-11-30",
      description: "Rich, warm theme showcasing autumn harvest ingredients and seasonal flavors",
    },
  ]

  // Sample seasonal items
  const sampleSeasonalItems: SeasonalMenuItem[] = [
    {
      id: "summer_gazpacho",
      name: "Chilled Gazpacho",
      description: "Refreshing cold soup with fresh tomatoes, cucumbers, and herbs",
      category: "Appetizers",
      season: ["summer"],
      isPromoted: true,
      specialPrice: 8.99,
      originalPrice: 10.99,
    },
    {
      id: "winter_soup",
      name: "Hearty Butternut Squash Soup",
      description: "Creamy, warming soup perfect for cold winter days",
      category: "Soups",
      season: ["fall", "winter"],
      isPromoted: false,
      originalPrice: 9.99,
    },
    {
      id: "spring_salad",
      name: "Spring Greens Salad",
      description: "Fresh mixed greens with seasonal vegetables and light vinaigrette",
      category: "Salads",
      season: ["spring", "summer"],
      isPromoted: true,
      specialPrice: 11.99,
      originalPrice: 13.99,
    },
  ]

  useEffect(() => {
    setThemes(sampleThemes)
    setSeasonalItems(sampleSeasonalItems)
  }, [])

  const generateSeasonalThemes = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // In a real app, this would call an AI service
    setIsGenerating(false)
  }

  const applyTheme = (themeId: string) => {
    setThemes((prev) =>
      prev.map((theme) => ({
        ...theme,
        isActive: theme.id === themeId,
      })),
    )
    setSelectedTheme(themeId)
  }

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case "spring":
        return <Flower className="h-4 w-4" />
      case "summer":
        return <Sun className="h-4 w-4" />
      case "fall":
        return <Leaf className="h-4 w-4" />
      case "winter":
        return <Snowflake className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getCurrentSeason = () => {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return "spring"
    if (month >= 5 && month <= 7) return "summer"
    if (month >= 8 && month <= 10) return "fall"
    return "winter"
  }

  const currentSeason = getCurrentSeason()
  const activeTheme = themes.find((t) => t.isActive)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/menu">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Menu
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Seasonal Menu Manager</h1>
              <p className="text-sm text-gray-600">Create and manage seasonal themes and menu items</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <Calendar className="h-3 w-3 mr-1" />
              Current: {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="themes">Seasonal Themes</TabsTrigger>
            <TabsTrigger value="items">Seasonal Items</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          {/* Themes Tab */}
          <TabsContent value="themes" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Seasonal Themes</h2>
                <p className="text-sm text-gray-600">Create and manage seasonal menu themes</p>
              </div>
              <Button onClick={generateSeasonalThemes} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Themes
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themes.map((theme) => (
                <Card
                  key={theme.id}
                  className={`border-2 transition-all ${
                    theme.isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          {getSeasonIcon(theme.season)}
                          <CardTitle className="text-lg">{theme.name}</CardTitle>
                        </div>
                        {theme.isActive && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{theme.description}</p>

                    {/* Color Palette */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Color Palette</Label>
                      <div className="flex space-x-2">
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.colors.primary }}
                          title="Primary"
                        />
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.colors.secondary }}
                          title="Secondary"
                        />
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.colors.accent }}
                          title="Accent"
                        />
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.colors.background }}
                          title="Background"
                        />
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(theme.startDate).toLocaleDateString()} -{" "}
                        {new Date(theme.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => applyTheme(theme.id)}
                        disabled={theme.isActive}
                        className="flex-1"
                        variant={theme.isActive ? "secondary" : "default"}
                      >
                        {theme.isActive ? "Currently Active" : "Apply Theme"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Seasonal Items Tab */}
          <TabsContent value="items" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Seasonal Menu Items</h2>
                <p className="text-sm text-gray-600">Manage items that appear during specific seasons</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Seasonal Item
              </Button>
            </div>

            <div className="space-y-4">
              {seasonalItems.map((item) => (
                <Card key={item.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <div className="flex space-x-1">
                            {item.season.map((season) => (
                              <Badge key={season} variant="outline" className="text-xs">
                                {getSeasonIcon(season)}
                                <span className="ml-1 capitalize">{season}</span>
                              </Badge>
                            ))}
                          </div>
                          {item.isPromoted && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">Promoted</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Category: {item.category}</span>
                          <span>
                            Price:{" "}
                            {item.specialPrice ? (
                              <>
                                <span className="line-through">${item.originalPrice}</span>
                                <span className="text-green-600 font-medium ml-1">${item.specialPrice}</span>
                              </>
                            ) : (
                              `$${item.originalPrice}`
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Seasonal Automation</h2>
              <p className="text-sm text-gray-600">Configure automatic seasonal theme and item changes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5" />
                    <span>Auto Theme Switching</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable automatic theme switching</Label>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label>Switch themes based on:</Label>
                    <Select defaultValue="calendar">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calendar">Calendar dates</SelectItem>
                        <SelectItem value="weather">Weather conditions</SelectItem>
                        <SelectItem value="both">Both calendar and weather</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Performance Tracking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">Track the performance of seasonal themes and items</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Spring Theme Performance</span>
                      <span className="text-sm font-medium text-green-600">+18% orders</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Seasonal Items Revenue</span>
                      <span className="text-sm font-medium text-green-600">+$2,400</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Customer Engagement</span>
                      <span className="text-sm font-medium text-green-600">+25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
