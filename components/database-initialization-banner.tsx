"use client"

import { useDatabaseSetup } from "@/lib/hooks/use-database-setup"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"

export function DatabaseInitializationBanner() {
  const { isInitialized, isInitializing, error } = useDatabaseSetup()

  if (isInitialized) {
    return null // Don't show banner when database is ready
  }

  if (isInitializing) {
    return (
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <div>
              <h3 className="font-medium text-blue-900">Setting up your database...</h3>
              <p className="text-sm text-blue-700">This will only take a moment. Please don't refresh the page.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-6 border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-900">Database setup failed</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
