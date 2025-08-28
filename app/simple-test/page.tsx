"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "loading"
  message: string
  data?: any
}

export default function SimpleTestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateResult = (name: string, status: "success" | "error", message: string, data?: any) => {
    setResults((prev) => prev.map((result) => (result.name === name ? { ...result, status, message, data } : result)))
  }

  const runTests = async () => {
    setIsRunning(true)
    setResults([
      { name: "Dashboard API", status: "loading", message: "Testing..." },
      { name: "Restaurant Data", status: "loading", message: "Testing..." },
      { name: "AI Menu Descriptions", status: "loading", message: "Testing..." },
    ])

    // Test 1: Dashboard API
    try {
      const response = await fetch("/api/v1/dashboard/stats")
      const data = await response.json()

      if (response.ok && data.success) {
        updateResult(
          "Dashboard API",
          "success",
          `✅ Revenue: ${data.stats.revenue.value}, Orders: ${data.stats.orders.value}`,
        )
      } else {
        updateResult("Dashboard API", "error", `❌ ${data.error || "API failed"}`)
      }
    } catch (error) {
      updateResult("Dashboard API", "error", `❌ ${error.message}`)
    }

    // Test 2: Restaurant Data
    try {
      const response = await fetch("/api/testing/restaurants")
      const data = await response.json()

      if (response.ok && data.restaurants) {
        updateResult("Restaurant Data", "success", `✅ Found ${data.restaurants.length} restaurants`)
      } else {
        updateResult("Restaurant Data", "error", `❌ ${data.error || "No restaurant data"}`)
      }
    } catch (error) {
      updateResult("Restaurant Data", "error", `❌ ${error.message}`)
    }

    // Test 3: AI Menu Descriptions
    try {
      const response = await fetch("/api/ai/menu-descriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuItems: [
            {
              id: "test-1",
              name: "Margherita Pizza",
              description: "Classic pizza with tomato sauce and mozzarella",
              price: 18.99,
              category: "Pizza",
            },
          ],
        }),
      })
      const data = await response.json()

      if (response.ok && data.descriptions) {
        updateResult("AI Menu Descriptions", "success", `✅ Generated ${data.descriptions.length} descriptions`)
      } else {
        const errorMessage =
          data.code === "MISSING_API_KEY" ? `❌ ${data.error}` : `❌ ${data.error || "AI generation failed"}`
        updateResult("AI Menu Descriptions", "error", errorMessage)
      }
    } catch (error) {
      updateResult("AI Menu Descriptions", "error", `❌ ${error.message}`)
    }

    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Platform Status Check</CardTitle>
            <p className="text-gray-600">Simple test of core functionality</p>
          </CardHeader>
          <CardContent>
            <Button onClick={runTests} disabled={isRunning} className="w-full h-12 text-lg">
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Running Tests...
                </>
              ) : (
                "Run Tests"
              )}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <Card key={index} className="border-l-4 border-l-gray-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{result.name}</h3>
                    {result.status === "loading" && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                    {result.status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {result.status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                  <p
                    className={`text-sm ${
                      result.status === "success"
                        ? "text-green-700"
                        : result.status === "error"
                          ? "text-red-700"
                          : "text-gray-600"
                    }`}
                  >
                    {result.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardContent className="p-4 text-center">
            <Button variant="outline" asChild className="w-full bg-transparent">
              <a href="/dashboard">← Back to Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
