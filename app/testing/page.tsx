"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, Database, Brain, Zap } from "lucide-react"

interface Restaurant {
  id: string
  name: string
  cuisine_type: string
  description: string
}

interface TestResult {
  name: string
  status: "pending" | "running" | "success" | "error"
  result?: any
  error?: string
  duration?: number
}

interface TestSuite {
  name: string
  description: string
  tests: TestResult[]
  progress: number
}

export default function TestingPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("")
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      name: "Database Operations",
      description: "Test all database CRUD operations with real schema",
      tests: [
        { name: "Load Restaurant Data", status: "pending" },
        { name: "Load Menu Items", status: "pending" },
        { name: "Load Customer Data", status: "pending" },
        { name: "Load Orders & Analytics", status: "pending" },
        { name: "Load Reviews & Insights", status: "pending" },
      ],
      progress: 0,
    },
    {
      name: "AI Generation Features",
      description: "Test all AI features with real API calls",
      tests: [
        { name: "Menu Descriptions (Grok)", status: "pending" },
        { name: "Social Media Posts (Groq)", status: "pending" },
        { name: "Business Insights (Deep Infra)", status: "pending" },
        { name: "Image Generation (fal)", status: "pending" },
        { name: "Review Responses (Grok)", status: "pending" },
      ],
      progress: 0,
    },
    {
      name: "Feature Integration",
      description: "Test end-to-end feature workflows",
      tests: [
        { name: "Dashboard Analytics", status: "pending" },
        { name: "Menu Management", status: "pending" },
        { name: "Customer Intelligence", status: "pending" },
        { name: "Marketing Campaigns", status: "pending" },
        { name: "Review Management", status: "pending" },
      ],
      progress: 0,
    },
  ])
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    loadRestaurants()
  }, [])

  const loadRestaurants = async () => {
    try {
      const response = await fetch("/api/testing/restaurants")
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data.restaurants || [])
        if (data.restaurants?.length > 0) {
          setSelectedRestaurant(data.restaurants[0].id)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to load restaurants:", error)
    }
  }

  const runTestSuite = async (suiteIndex: number) => {
    if (!selectedRestaurant) {
      alert("Please select a restaurant first")
      return
    }

    setIsRunning(true)
    const suite = testSuites[suiteIndex]

    setTestSuites((prev) =>
      prev.map((s, i) =>
        i === suiteIndex ? { ...s, tests: s.tests.map((t) => ({ ...t, status: "pending" })), progress: 0 } : s,
      ),
    )

    for (let testIndex = 0; testIndex < suite.tests.length; testIndex++) {
      const test = suite.tests[testIndex]

      setTestSuites((prev) =>
        prev.map((s, i) =>
          i === suiteIndex
            ? {
                ...s,
                tests: s.tests.map((t, ti) => (ti === testIndex ? { ...t, status: "running" } : t)),
                progress: (testIndex / s.tests.length) * 100,
              }
            : s,
        ),
      )

      try {
        const startTime = Date.now()
        const result = await runIndividualTest(suite.name, test.name, selectedRestaurant)
        const duration = Date.now() - startTime

        setTestSuites((prev) =>
          prev.map((s, i) =>
            i === suiteIndex
              ? {
                  ...s,
                  tests: s.tests.map((t, ti) => (ti === testIndex ? { ...t, status: "success", result, duration } : t)),
                }
              : s,
          ),
        )
      } catch (error) {
        setTestSuites((prev) =>
          prev.map((s, i) =>
            i === suiteIndex
              ? {
                  ...s,
                  tests: s.tests.map((t, ti) =>
                    ti === testIndex ? { ...t, status: "error", error: error.message } : t,
                  ),
                }
              : s,
          ),
        )
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setTestSuites((prev) => prev.map((s, i) => (i === suiteIndex ? { ...s, progress: 100 } : s)))

    setIsRunning(false)
  }

  const runIndividualTest = async (suiteName: string, testName: string, restaurantId: string) => {
    const response = await fetch("/api/testing/run-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suiteName, testName, restaurantId }),
    })

    if (!response.ok) {
      throw new Error(`Test failed: ${response.statusText}`)
    }

    return await response.json()
  }

  const runAllTests = async () => {
    for (let i = 0; i < testSuites.length; i++) {
      await runTestSuite(i)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "running":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Tablesalt AI Testing Suite</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Comprehensive testing of all features with real database schema and AI API calls
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5" />
            Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex-1 w-full">
              <label className="text-sm font-medium mb-2 block">Select Restaurant</label>
              <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a restaurant to test with" />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{restaurant.name}</span>
                        <span className="text-xs text-muted-foreground">{restaurant.cuisine_type}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={runAllTests}
              disabled={isRunning || !selectedRestaurant}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              <Zap className="h-4 w-4 mr-2" />
              Run All Tests
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="0" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
          {testSuites.map((suite, index) => (
            <TabsTrigger key={index} value={index.toString()} className="text-xs sm:text-sm p-2 sm:p-3">
              <span className="truncate">{suite.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {testSuites.map((suite, suiteIndex) => (
          <TabsContent key={suiteIndex} value={suiteIndex.toString()}>
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {suiteIndex === 0 && <Database className="h-5 w-5" />}
                      {suiteIndex === 1 && <Brain className="h-5 w-5" />}
                      {suiteIndex === 2 && <Zap className="h-5 w-5" />}
                      <span className="text-balance">{suite.name}</span>
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">{suite.description}</CardDescription>
                  </div>
                  <Button
                    onClick={() => runTestSuite(suiteIndex)}
                    disabled={isRunning || !selectedRestaurant}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Run Suite
                  </Button>
                </div>
                {suite.progress > 0 && (
                  <div className="mt-4">
                    <Progress value={suite.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-1">Progress: {Math.round(suite.progress)}%</p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suite.tests.map((test, testIndex) => (
                    <div
                      key={testIndex}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg gap-2"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(test.status)}
                        <span className="font-medium text-sm">{test.name}</span>
                        <Badge className={`${getStatusColor(test.status)} text-xs`}>{test.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {test.duration && <span>{test.duration}ms</span>}
                        {test.error && (
                          <span className="text-red-600 max-w-xs truncate" title={test.error}>
                            {test.error}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
