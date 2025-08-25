"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Database, CheckCircle } from "lucide-react"

export function DatabaseInitButton() {
  const [isChecking, setIsChecking] = useState(false)
  const [status, setStatus] = useState<"idle" | "needs-setup" | "ready">("idle")

  const checkDatabaseStatus = async () => {
    setIsChecking(true)

    try {
      const response = await fetch("/api/initialize-db", {
        method: "POST",
      })

      const result = await response.json()

      if (result.success) {
        setStatus("ready")
        // Refresh the page after a short delay to show real data
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else if (result.requiresManualSetup) {
        setStatus("needs-setup")
      }
    } catch (error) {
      console.error("Database check error:", error)
      setStatus("needs-setup")
    } finally {
      setIsChecking(false)
    }
  }

  if (status === "ready") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Database Ready!</span>
          </div>
          <p className="text-sm text-green-600 mt-1">Refreshing to load real data...</p>
        </CardContent>
      </Card>
    )
  }

  if (status === "needs-setup") {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Database className="h-5 w-5" />
            Database Setup Required
          </CardTitle>
          <CardDescription className="text-orange-700">
            Run the database schema script to enable real data storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-orange-800">Follow these steps:</p>
            <ol className="text-sm text-orange-700 space-y-1 ml-4">
              <li>1. Go to your Supabase project dashboard</li>
              <li>2. Navigate to the SQL Editor</li>
              <li>
                3. Run the script:{" "}
                <code className="bg-orange-100 px-1 rounded">scripts/create-production-database-schema.sql</code>
              </li>
              <li>4. Return here and click "Check Status" when complete</li>
            </ol>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={checkDatabaseStatus}
              disabled={isChecking}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              {isChecking ? "Checking..." : "Check Status"}
            </Button>
            <Button
              onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
              variant="default"
              className="flex items-center gap-2"
            >
              Open Supabase <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="pt-6">
        <Button onClick={checkDatabaseStatus} disabled={isChecking} className="w-full">
          {isChecking ? "Checking Database..." : "Check Database Status"}
        </Button>
      </CardContent>
    </Card>
  )
}
