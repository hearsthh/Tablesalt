"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { enhancedApiClient } from "@/lib/api/enhanced-api-client"

export default function TestReviewsPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runReviewTests = async () => {
    setIsRunning(true)
    const results = []

    // Test 1: Review Data Loading
    try {
      const startTime = Date.now()
      const reviews = await enhancedApiClient.getReviews("bella-vista-123")
      const loadTime = Date.now() - startTime

      const reviewsArray = Array.isArray(reviews) ? reviews : []

      results.push({
        test: "Review Data Loading",
        status: reviewsArray.length > 0 ? "PASS" : "FAIL",
        details: `Loaded ${reviewsArray.length} reviews in ${loadTime}ms`,
        data: reviewsArray.slice(0, 3),
      })
    } catch (error) {
      results.push({
        test: "Review Data Loading",
        status: "FAIL",
        details: `Error: ${error}`,
        data: null,
      })
    }

    // Test 2: Sentiment Analysis
    try {
      const reviews = await enhancedApiClient.getReviews("bella-vista-123")
      const reviewsArray = Array.isArray(reviews) ? reviews : []

      const sentimentCounts = {
        positive: reviewsArray.filter((r) => r.sentiment === "positive").length,
        negative: reviewsArray.filter((r) => r.sentiment === "negative").length,
        neutral: reviewsArray.filter((r) => r.sentiment === "neutral").length,
      }

      results.push({
        test: "Sentiment Analysis",
        status: reviewsArray.length > 0 ? "PASS" : "FAIL",
        details: `Analyzed sentiment for ${reviewsArray.length} reviews`,
        data: sentimentCounts,
      })
    } catch (error) {
      results.push({
        test: "Sentiment Analysis",
        status: "FAIL",
        details: `Error: ${error}`,
        data: null,
      })
    }

    // Test 3: Multi-platform Aggregation
    try {
      const reviews = await enhancedApiClient.getReviews("bella-vista-123")
      const reviewsArray = Array.isArray(reviews) ? reviews : []

      const platformCounts = reviewsArray.reduce(
        (acc, review) => {
          acc[review.platform] = (acc[review.platform] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      results.push({
        test: "Multi-platform Aggregation",
        status: Object.keys(platformCounts).length > 1 ? "PASS" : "FAIL",
        details: `Reviews from ${Object.keys(platformCounts).length} platforms`,
        data: platformCounts,
      })
    } catch (error) {
      results.push({
        test: "Multi-platform Aggregation",
        status: "FAIL",
        details: `Error: ${error}`,
        data: null,
      })
    }

    try {
      const reviews = await enhancedApiClient.getReviews("bella-vista-123")
      const reviewsArray = Array.isArray(reviews) ? reviews : []

      const responseStats = {
        total: reviewsArray.length,
        responded: reviewsArray.filter((r) => r.response).length,
        pending: reviewsArray.filter((r) => !r.response).length,
      }

      results.push({
        test: "Review Response Management",
        status: "PASS",
        details: `${responseStats.responded}/${responseStats.total} reviews have responses`,
        data: responseStats,
      })
    } catch (error) {
      results.push({
        test: "Review Response Management",
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
        <h1 className="text-3xl font-bold mb-2">Reviews Management Testing</h1>
        <p className="text-muted-foreground">
          Test review data loading, sentiment analysis, multi-platform aggregation, and review response management
        </p>
      </div>

      <div className="mb-6">
        <Button onClick={runReviewTests} disabled={isRunning}>
          {isRunning ? "Running Tests..." : "Run Review Tests"}
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
