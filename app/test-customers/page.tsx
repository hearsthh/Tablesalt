"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { enhancedApiClient } from "@/lib/api/enhanced-api-client"

export default function TestCustomersPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runCustomerTests = async () => {
    setIsRunning(true)
    const results = []

    // Test 1: Customer Data Loading
    try {
      const startTime = Date.now()
      const customers = await enhancedApiClient.getCustomers("bella-vista-123")
      const loadTime = Date.now() - startTime

      results.push({
        test: "Customer Data Loading",
        status: customers.length > 0 ? "PASS" : "FAIL",
        details: `Loaded ${customers.length} customers in ${loadTime}ms`,
        data: customers.slice(0, 3),
      })
    } catch (error) {
      results.push({
        test: "Customer Data Loading",
        status: "FAIL",
        details: `Error: ${error}`,
        data: null,
      })
    }

    // Test 2: Customer Analytics
    try {
      const analytics = await enhancedApiClient.getCustomerAnalytics("bella-vista-123")
      results.push({
        test: "Customer Analytics",
        status: analytics ? "PASS" : "FAIL",
        details: `Analytics loaded with ${Object.keys(analytics).length} metrics`,
        data: analytics,
      })
    } catch (error) {
      results.push({
        test: "Customer Analytics",
        status: "FAIL",
        details: `Error: ${error}`,
        data: null,
      })
    }

    // Test 3: Customer Segmentation
    try {
      const customers = await enhancedApiClient.getCustomers("bella-vista-123")
      const segments = {
        vip: customers.filter((c) => c.loyaltyTier === "VIP").length,
        gold: customers.filter((c) => c.loyaltyTier === "Gold").length,
        silver: customers.filter((c) => c.loyaltyTier === "Silver").length,
        bronze: customers.filter((c) => c.loyaltyTier === "Bronze").length,
      }

      results.push({
        test: "Customer Segmentation",
        status: "PASS",
        details: `Segmented customers by loyalty tiers`,
        data: segments,
      })
    } catch (error) {
      results.push({
        test: "Customer Segmentation",
        status: "FAIL",
        details: `Error: ${error}`,
        data: null,
      })
    }

    setTestResults(results)
    setIsRunning(false)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Customer Management Testing</h1>
        <p className="text-muted-foreground">Test customer data loading, analytics, and segmentation features</p>
      </div>

      <div className="mb-6">
        <Button onClick={runCustomerTests} disabled={isRunning}>
          {isRunning ? "Running Tests..." : "Run Customer Tests"}
        </Button>
      </div>

      <div className="grid gap-4">
        {testResults.map((result, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{result.test}</CardTitle>
                <Badge variant={result.status === "PASS" ? "default" : "destructive"}>{result.status}</Badge>
              </div>
              <CardDescription>{result.details}</CardDescription>
            </CardHeader>
            {result.data && (
              <CardContent>
                <pre className="text-sm bg-muted p-3 rounded overflow-auto">{JSON.stringify(result.data, null, 2)}</pre>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
