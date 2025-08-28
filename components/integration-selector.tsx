"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, ShoppingCart, Star, Mail } from "lucide-react"

interface IntegrationSelectorProps {
  onIntegrationsSelected: (integrations: string[]) => void
  onLocationDetected?: (country: string, city: string) => void
}

export function IntegrationSelector({ onIntegrationsSelected }: IntegrationSelectorProps) {
  const integrations = [
    { id: "pos", name: "POS System", icon: Store, category: "Restaurant Info" },
    { id: "orders", name: "Order Management", icon: ShoppingCart, category: "Menu & Orders" },
    { id: "reviews", name: "Review Platforms", icon: Star, category: "Reviews" },
    { id: "email", name: "Email Marketing", icon: Mail, category: "Marketing" },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => {
              const IconComponent = integration.icon
              return (
                <div key={integration.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <IconComponent className="h-5 w-5" />
                  <div className="flex-1">
                    <h4 className="font-medium">{integration.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {integration.category}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Connect
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
