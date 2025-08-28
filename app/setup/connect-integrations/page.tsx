"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ConnectIntegrationsPage() {
  const router = useRouter()
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])

  const integrations = [
    { id: "pos", name: "POS System", description: "Connect your point of sale system" },
    { id: "email", name: "Email Marketing", description: "Email campaign management" },
    { id: "social", name: "Social Media", description: "Social media management" },
    { id: "reviews", name: "Review Platforms", description: "Google, Yelp, TripAdvisor" },
  ]

  const handleContinue = () => {
    router.push("/setup/import-data")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Link href="/setup">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Connect Integrations</h1>
              <p className="text-sm text-gray-600">Step 1 of 3: Connect your systems</p>
            </div>
          </div>
          <Button onClick={handleContinue} size="sm">
            Next: Import Data
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">{integration.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
