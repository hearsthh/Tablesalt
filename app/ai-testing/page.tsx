"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Brain,
  TestTube,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Play,
  Zap,
  MessageSquare,
  ChefHat,
  Megaphone,
  BarChart3,
  Users,
  Star,
  Calendar,
  Percent,
  Target,
} from "lucide-react"

interface AITest {
  id: string
  name: string
  description: string
  endpoint: string
  icon: any
  category: string
  status: "pending" | "running" | "success" | "error"
  result?: any
  error?: string
  duration?: number
}

interface TestResult {
  testId: string
  success: boolean
  data?: any
  error?: string
  duration: number
  timestamp: string
}

interface RestaurantData {
  id: string
  name: string
  cuisine: string
  location: string
  description: string
  menuItems: any[]
  categories: any[]
}

export default function AITestingPage() {
  const { toast } = useToast()
  const [tests, setTests] = useState<AITest[]>([])
  const [results, setResults] = useState<TestResult[]>([])
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("1")
  const [restaurantData, setRestaurantData] = useState<RestaurantData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeTests()
    loadRestaurantData()
  }, [])

  const initializeTests = () => {
    const aiTests: AITest[] = [
      {
        id: "menu-descriptions",
        name: "Menu Descriptions Generator",
        description: "Generate appetizing descriptions for menu items",
        endpoint: "/api/ai/menu-descriptions",
        icon: ChefHat,
        category: "menu",
        status: "pending",
      },
      {
        id: "menu-combos",
        name: "AI Combo Generator",
        description: "Create intelligent combo meal suggestions",
        endpoint: "/api/ai/menu-combos",
        icon: Zap,
        category: "menu",
        status: "pending",
      },
      {
        id: "menu-pricing",
        name: "Smart Pricing Optimizer",
        description: "AI-powered pricing recommendations",
        endpoint: "/api/ai/menu-pricing",
        icon: Percent,
        category: "menu",
        status: "pending",
      },
      {
        id: "menu-tags",
        name: "Menu Tags Generator",
        description: "Generate dietary and marketing tags",
        endpoint: "/api/ai/menu-tags",
        icon: Target,
        category: "menu",
        status: "pending",
      },
      {
        id: "menu-ordering",
        name: "Menu Ordering Optimizer",
        description: "Optimize menu item and category ordering",
        endpoint: "/api/ai/menu-ordering",
        icon: BarChart3,
        category: "menu",
        status: "pending",
      },
      {
        id: "social-media-posts",
        name: "Social Media Posts",
        description: "Generate engaging social media content",
        endpoint: "/api/ai/social-media-posts",
        icon: Megaphone,
        category: "marketing",
        status: "pending",
      },
      {
        id: "campaign-content",
        name: "Campaign Content Generator",
        description: "Create comprehensive marketing campaigns",
        endpoint: "/api/ai/campaign-content",
        icon: Star,
        category: "marketing",
        status: "pending",
      },
      {
        id: "hashtags",
        name: "Hashtag Generator",
        description: "Generate trending hashtags for posts",
        endpoint: "/api/ai/hashtags",
        icon: MessageSquare,
        category: "marketing",
        status: "pending",
      },
      {
        id: "content-adaptation",
        name: "Content Adaptation",
        description: "Adapt content for different platforms",
        endpoint: "/api/ai/content-adaptation",
        icon: Users,
        category: "marketing",
        status: "pending",
      },
      {
        id: "seasonal-content",
        name: "Seasonal Content",
        description: "Generate seasonal marketing content",
        endpoint: "/api/ai/seasonal-content",
        icon: Calendar,
        category: "marketing",
        status: "pending",
      },
    ]

    setTests(aiTests)
  }

  const loadRestaurantData = async () => {
    try {
      console.log("[v0] Loading restaurant data for AI testing")

      const response = await fetch("/api/v1/restaurants/test-data")
      if (!response.ok) {
        throw new Error("Failed to load restaurant data")
      }

      const data = await response.json()
      setRestaurantData(data.restaurants || [])

      toast({
        title: "Restaurant Data Loaded",
        description: `Loaded ${data.restaurants?.length || 0} test restaurants for AI testing`,
      })
    } catch (error) {
      console.error("[v0] Error loading restaurant data:", error)

      const mockRestaurants = generateMockRestaurantData()
      setRestaurantData(mockRestaurants)

      toast({
        title: "Using Mock Data",
        description: "Using fallback mock data for AI testing",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateMockRestaurantData = (): RestaurantData[] => {
    return [
      {
        id: "1",
        name: "Bella Vista Italian",
        cuisine: "Italian",
        location: "New York, NY",
        description: "Authentic Italian cuisine with a modern twist",
        menuItems: [
          {
            id: "item-1",
            name: "Margherita Pizza",
            description: "Classic pizza with tomatoes and mozzarella",
            price: 16.99,
            category: "Pizza",
            ingredients: ["tomatoes", "mozzarella", "basil", "pizza dough"],
            cost_price: 5.1,
            preparation_time: 12,
            popularity_score: 85,
          },
          {
            id: "item-2",
            name: "Spaghetti Carbonara",
            description: "Traditional Roman pasta with eggs and pancetta",
            price: 18.99,
            category: "Pasta",
            ingredients: ["spaghetti", "eggs", "pancetta", "parmesan"],
            cost_price: 6.2,
            preparation_time: 15,
            popularity_score: 78,
          },
        ],
        categories: [
          { id: "cat-1", name: "Pizza", display_order: 1 },
          { id: "cat-2", name: "Pasta", display_order: 2 },
        ],
      },
      {
        id: "2",
        name: "Tokyo Sushi Bar",
        cuisine: "Japanese",
        location: "Los Angeles, CA",
        description: "Fresh sushi and traditional Japanese dishes",
        menuItems: [
          {
            id: "item-3",
            name: "Salmon Nigiri",
            description: "Fresh salmon over seasoned rice",
            price: 8.99,
            category: "Sushi",
            ingredients: ["salmon", "sushi rice", "wasabi"],
            cost_price: 3.2,
            preparation_time: 5,
            popularity_score: 92,
          },
          {
            id: "item-4",
            name: "Chicken Teriyaki",
            description: "Grilled chicken with teriyaki glaze",
            price: 14.99,
            category: "Entrees",
            ingredients: ["chicken", "teriyaki sauce", "rice"],
            cost_price: 4.8,
            preparation_time: 18,
            popularity_score: 76,
          },
        ],
        categories: [
          { id: "cat-3", name: "Sushi", display_order: 1 },
          { id: "cat-4", name: "Entrees", display_order: 2 },
        ],
      },
    ]
  }

  const runSingleTest = async (test: AITest) => {
    const startTime = Date.now()
    setRunningTests((prev) => new Set([...prev, test.id]))

    setTests((prev) => prev.map((t) => (t.id === test.id ? { ...t, status: "running" } : t)))

    try {
      console.log(`[v0] Running AI test: ${test.name}`)

      const testData = getTestDataForEndpoint(test.id)
      const response = await fetch(test.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      })

      const result = await response.json()
      const duration = Date.now() - startTime

      if (response.ok && result.success) {
        const testResult: TestResult = {
          testId: test.id,
          success: true,
          data: result,
          duration,
          timestamp: new Date().toISOString(),
        }

        setResults((prev) => [testResult, ...prev.filter((r) => r.testId !== test.id)])
        setTests((prev) =>
          prev.map((t) => (t.id === test.id ? { ...t, status: "success", result: result, duration } : t)),
        )

        toast({
          title: "Test Passed",
          description: `${test.name} completed successfully in ${duration}ms`,
        })
      } else {
        throw new Error(result.error || "Test failed")
      }
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      const testResult: TestResult = {
        testId: test.id,
        success: false,
        error: errorMessage,
        duration,
        timestamp: new Date().toISOString(),
      }

      setResults((prev) => [testResult, ...prev.filter((r) => r.testId !== test.id)])
      setTests((prev) =>
        prev.map((t) => (t.id === test.id ? { ...t, status: "error", error: errorMessage, duration } : t)),
      )

      toast({
        title: "Test Failed",
        description: `${test.name}: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setRunningTests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(test.id)
        return newSet
      })
    }
  }

  const runAllTests = async () => {
    const filteredTests = selectedCategory === "all" ? tests : tests.filter((t) => t.category === selectedCategory)

    toast({
      title: "Running All Tests",
      description: `Starting ${filteredTests.length} AI generation tests`,
    })

    for (const test of filteredTests) {
      await runSingleTest(test)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    toast({
      title: "All Tests Complete",
      description: "AI generation testing suite finished",
    })
  }

  const getTestDataForEndpoint = (testId: string) => {
    const currentRestaurant = restaurantData.find((r) => r.id === selectedRestaurant)

    if (!currentRestaurant) {
      console.warn("[v0] No restaurant data found, using fallback")
      return {}
    }

    const restaurantContext = {
      name: currentRestaurant.name,
      cuisine: currentRestaurant.cuisine,
      location: currentRestaurant.location,
      description: currentRestaurant.description,
      brandVoice: "Warm and authentic",
      averageOrderValue: 32.5,
      targetDemographic: "Food enthusiasts and families",
    }

    switch (testId) {
      case "menu-descriptions":
        return {
          menuItems: currentRestaurant.menuItems,
          selectedItems: currentRestaurant.menuItems.slice(0, 2).map((item) => item.id),
          style: "appetizing",
          restaurantContext,
        }
      case "menu-combos":
        return {
          menuItems: currentRestaurant.menuItems,
          restaurantContext,
        }
      case "menu-pricing":
        return {
          menuItems: currentRestaurant.menuItems,
          strategy: "profit_optimization",
          restaurantContext,
        }
      case "menu-tags":
        return {
          menuItems: currentRestaurant.menuItems,
          restaurantContext,
        }
      case "menu-ordering":
        return {
          categories: currentRestaurant.categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            items: currentRestaurant.menuItems.filter((item) => item.category === cat.name),
          })),
          restaurantContext,
        }
      case "social-media-posts":
        return {
          restaurantContext,
          options: {
            platforms: ["instagram", "facebook"],
            tone: "engaging",
            contentType: "promotional",
            count: 3,
            menuItems: currentRestaurant.menuItems.slice(0, 3),
          },
        }
      case "campaign-content":
        return {
          campaignTheme: "Winter Comfort Food",
          duration: 7,
          platforms: ["instagram", "facebook", "twitter"],
          restaurantContext,
        }
      case "hashtags":
        return {
          content: `Try our amazing ${currentRestaurant.menuItems[0]?.name || "special dish"}!`,
          platform: "instagram",
          restaurantContext,
        }
      case "content-adaptation":
        return {
          originalContent: `Join us at ${currentRestaurant.name} for our weekend special menu!`,
          targetPlatforms: ["instagram", "facebook", "twitter"],
          restaurantContext,
        }
      case "seasonal-content":
        return {
          season: "winter",
          occasion: "holiday",
          restaurantContext,
        }
      default:
        return { restaurantContext }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "running":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredTests = selectedCategory === "all" ? tests : tests.filter((t) => t.category === selectedCategory)

  const successCount = filteredTests.filter((t) => t.status === "success").length
  const errorCount = filteredTests.filter((t) => t.status === "error").length
  const runningCount = filteredTests.filter((t) => t.status === "running").length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading restaurant data for AI testing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TestTube className="h-6 w-6 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Generation Testing</h1>
                <p className="text-sm text-gray-600">
                  Test AI features with {restaurantData.length} restaurant datasets
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Restaurant:</label>
              <select
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {restaurantData.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name} ({restaurant.cuisine})
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={runAllTests}
              disabled={runningCount > 0}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {runningCount > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Current Restaurant Info Card */}
        {restaurantData.find((r) => r.id === selectedRestaurant) && (
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Testing with: {restaurantData.find((r) => r.id === selectedRestaurant)?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {restaurantData.find((r) => r.id === selectedRestaurant)?.cuisine} •{" "}
                    {restaurantData.find((r) => r.id === selectedRestaurant)?.location} •{" "}
                    {restaurantData.find((r) => r.id === selectedRestaurant)?.menuItems.length} menu items
                  </p>
                </div>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  {restaurantData.find((r) => r.id === selectedRestaurant)?.cuisine}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{filteredTests.length}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{runningCount}</div>
              <div className="text-sm text-gray-600">Running</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {runningCount > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Test Progress</span>
                <span className="text-sm text-gray-500">
                  {successCount + errorCount} / {filteredTests.length}
                </span>
              </div>
              <Progress value={((successCount + errorCount) / filteredTests.length) * 100} className="h-2" />
            </CardContent>
          </Card>
        )}

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="menu">Menu AI</TabsTrigger>
            <TabsTrigger value="marketing">Marketing AI</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4">
            {/* Test Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTests.map((test) => (
                <Card key={test.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <test.icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-sm">{test.name}</CardTitle>
                          <Badge className={`text-xs ${getStatusColor(test.status)}`}>
                            {test.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      {getStatusIcon(test.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{test.description}</p>

                    {test.duration && <div className="text-xs text-gray-500">Duration: {test.duration}ms</div>}

                    {test.error && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                        {test.error}
                      </div>
                    )}

                    {test.result && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                        ✓ {test.result.message || "Test completed successfully"}
                      </div>
                    )}

                    <Button
                      onClick={() => runSingleTest(test)}
                      disabled={runningTests.has(test.id)}
                      size="sm"
                      className="w-full"
                      variant="outline"
                    >
                      {runningTests.has(test.id) ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-2" />
                          Run Test
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Recent Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.slice(0, 5).map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <div className="font-medium text-sm">{tests.find((t) => t.id === result.testId)?.name}</div>
                        <div className="text-xs text-gray-500">{new Date(result.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{result.duration}ms</div>
                      {result.error && <div className="text-xs text-red-600">{result.error}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
