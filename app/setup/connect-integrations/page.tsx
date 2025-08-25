"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IntegrationSelector } from "@/components/integration-selector"
import { CustomIntegrationModal } from "@/components/custom-integration-modal"
import { useAuth } from "@/lib/auth/auth-provider"

export default function ConnectIntegrationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState("US")
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customIntegration, setCustomIntegration] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const handleIntegrationsSelected = (integrations: string[]) => {
    setSelectedIntegrations(integrations)
  }

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
  }

  const handleLocationDetected = (country: string, city: string) => {
    setSelectedCountry(country)
  }

  const handleCustomIntegration = (integration: any) => {
    setCustomIntegration(integration)
    setShowCustomModal(true)
  }

  const handleSaveAndContinue = async () => {
    if (selectedIntegrations.length === 0) return

    setSaving(true)
    try {
      const response = await fetch("/api/v1/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          integrations: selectedIntegrations,
          country: selectedCountry,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save integrations")
      }

      // Navigate to import data step
      const nextUrl = `/setup/import-data?integrations=${encodeURIComponent(JSON.stringify(selectedIntegrations))}`
      router.push(nextUrl)
    } catch (error) {
      console.error("Failed to save integrations:", error)
      alert("Failed to save integrations. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Link href="/setup">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold truncate">Connect Your Integrations</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Step 1 of 3: Connect your existing systems
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
              {selectedIntegrations.length} selected
            </span>
            <Button
              onClick={handleSaveAndContinue}
              disabled={selectedIntegrations.length === 0 || saving}
              size="sm"
              className="text-xs sm:text-sm"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  Saving...
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Next: Import Data</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-center sm:justify-between overflow-x-auto">
              <div className="flex items-center gap-2 sm:gap-4 min-w-max">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                    1
                  </div>
                  <span className="font-medium text-blue-600 text-xs sm:text-base">Connect</span>
                </div>
                <div className="w-4 sm:w-8 h-0.5 bg-gray-300"></div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs sm:text-sm">
                    2
                  </div>
                  <span className="text-gray-600 text-xs sm:text-base">Import</span>
                </div>
                <div className="w-4 sm:w-8 h-0.5 bg-gray-300"></div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs sm:text-sm">
                    3
                  </div>
                  <span className="text-gray-600 text-xs sm:text-base">Review</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase 0 Demo Notice */}
        <Card className="mb-4 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">β</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 text-sm mb-1">Phase 0 Testing Mode</h3>
                <p className="text-blue-700 text-xs leading-relaxed">
                  All integrations will start in demo mode with sample data. This allows you to explore the platform
                  without connecting real accounts. You can upgrade to live connections later.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Selector */}
        <IntegrationSelector
          onIntegrationsSelected={handleIntegrationsSelected}
          onLocationDetected={handleLocationDetected}
        />

        {/* Custom Integration Modal */}
        {showCustomModal && customIntegration && (
          <CustomIntegrationModal
            isOpen={showCustomModal}
            onClose={() => setShowCustomModal(false)}
            integration={customIntegration}
          />
        )}
      </div>
    </div>
  )
}
