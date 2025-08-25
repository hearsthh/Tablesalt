"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AIImportFlow } from "@/components/ai-import-flow"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ImportDataPage() {
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const integrationsParam = searchParams.get("integrations")
    if (integrationsParam) {
      try {
        const integrations = JSON.parse(decodeURIComponent(integrationsParam))
        setSelectedIntegrations((prev) => {
          // Compare arrays to prevent unnecessary re-renders
          if (JSON.stringify(prev) !== JSON.stringify(integrations)) {
            return integrations
          }
          return prev
        })
      } catch (error) {
        console.error("Failed to parse integrations:", error)
        setSelectedIntegrations((prev) => (prev.length > 0 ? [] : prev))
      }
    } else {
      setSelectedIntegrations((prev) => (prev.length > 0 ? [] : prev))
    }
  }, [searchParams])

  const handleImportComplete = (importedData: any) => {
    const reviewUrl = `/setup/review-data?data=${encodeURIComponent(JSON.stringify(importedData))}`
    router.push(reviewUrl)
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 min-w-0">
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold">AI Data Import</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Step 2 of 4: Import and analyze your data
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        <AIImportFlow
          selectedIntegrations={selectedIntegrations}
          onImportComplete={handleImportComplete}
          onBack={handleBack}
        />
      </div>
    </div>
  )
}
