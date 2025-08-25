"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Clock } from "lucide-react"

interface HealthCheck {
  service: string
  status: "healthy" | "unhealthy" | "degraded"
  message: string
  responseTime?: number
  details?: any
}

interface HealthResponse {
  status: "healthy" | "unhealthy" | "degraded"
  timestamp: string
  responseTime: number
  version: string
  environment: string
  checks: HealthCheck[]
  summary: {
    total: number
    healthy: number
    degraded: number
    unhealthy: number
  }
}

export function EnvironmentValidator() {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/v1/health")
      const data = await response.json()
      setHealthData(data)
    } catch (err) {
      setError("Failed to check system health")
      console.error("Health check error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "unhealthy":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: "default",
      degraded: "secondary",
      unhealthy: "destructive",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status.toUpperCase()}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Environment Validation</h2>
          <p className="text-gray-600">System health and configuration status</p>
        </div>
        <Button onClick={checkHealth} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Checking..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {healthData && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(healthData.status)}
                  <span>Overall System Status</span>
                </CardTitle>
                {getStatusBadge(healthData.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Environment</p>
                  <p className="font-semibold">{healthData.environment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Version</p>
                  <p className="font-semibold">{healthData.version}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Response Time</p>
                  <p className="font-semibold">{healthData.responseTime}ms</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Check</p>
                  <p className="font-semibold">{new Date(healthData.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{healthData.summary.healthy}</div>
                  <p className="text-sm text-gray-600">Healthy</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{healthData.summary.degraded}</div>
                  <p className="text-sm text-gray-600">Degraded</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{healthData.summary.unhealthy}</div>
                  <p className="text-sm text-gray-600">Unhealthy</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{healthData.summary.total}</div>
                  <p className="text-sm text-gray-600">Total Checks</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Health Checks</h3>
            {healthData.checks.map((check, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <h4 className="font-semibold">{check.service}</h4>
                        <p className="text-sm text-gray-600">{check.message}</p>
                        {check.responseTime && (
                          <p className="text-xs text-gray-500 mt-1">Response time: {check.responseTime}ms</p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(check.status)}
                  </div>

                  {check.details && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <details>
                        <summary className="text-sm font-medium cursor-pointer">View Details</summary>
                        <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(check.details, null, 2)}</pre>
                      </details>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
