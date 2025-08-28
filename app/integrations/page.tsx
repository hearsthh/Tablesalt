"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, AlertCircle, Settings } from "lucide-react"
import Link from "next/link"

export default function IntegrationsPage() {
  const integrations = [
    { name: "Email Service", status: "connected", description: "SendGrid email delivery" },
    { name: "SMS Service", status: "connected", description: "Twilio SMS messaging" },
    { name: "Stripe Payments", status: "connected", description: "Payment processing" },
    { name: "Facebook Business", status: "error", description: "Facebook Pages & Instagram" },
    { name: "Google Analytics", status: "connected", description: "Website analytics" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Integrations</h1>
              <p className="text-sm text-muted-foreground">Manage your restaurant integrations</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{integration.name}</CardTitle>
                  <Badge variant={integration.status === "connected" ? "default" : "destructive"}>
                    {integration.status === "connected" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {integration.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
