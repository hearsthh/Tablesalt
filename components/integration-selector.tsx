"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  getIntegrationsForCountry,
  getAllCountries,
  type Integration,
  type CountryIntegrations,
} from "@/lib/data/integration-matrix"
import { useLocationDetection } from "@/lib/hooks/use-location-detection"
import {
  Store,
  ShoppingCart,
  Star,
  Mail,
  Share2,
  Users,
  Zap,
  Check,
  AlertCircle,
  ChevronDown,
  MapPin,
  Loader2,
} from "lucide-react"

interface IntegrationSelectorProps {
  onIntegrationsSelected: (integrations: string[]) => void
  onLocationDetected?: (country: string, city: string) => void
}

const categoryConfig = {
  restaurantInfo: {
    icon: Store,
    label: "Restaurant Info",
    description: "Business listings and basic information",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  menuOrders: {
    icon: ShoppingCart,
    label: "Menu & Orders",
    description: "POS systems and order management",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  reviews: {
    icon: Star,
    label: "Reviews",
    description: "Customer feedback and ratings",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  marketing: {
    icon: Mail,
    label: "Marketing",
    description: "Email campaigns and promotions",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  socialMedia: {
    icon: Share2,
    label: "Social Media",
    description: "Social platforms and engagement",
    color: "bg-pink-50 text-pink-700 border-pink-200",
  },
  customerInfo: {
    icon: Users,
    label: "Customer Data",
    description: "Customer profiles and loyalty",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
}

export function IntegrationSelector({ onIntegrationsSelected, onLocationDetected }: IntegrationSelectorProps) {
  const { location, isLoading: locationLoading } = useLocationDetection()
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [countryData, setCountryData] = useState<CountryIntegrations | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [country, setCountry] = useState("")

  const countries = getAllCountries()

  useEffect(() => {
    if (location.detected && location.countryCode) {
      setCountry(location.countryCode)
      onLocationDetected?.(location.country, location.city)
    }
  }, [location, onLocationDetected])

  useEffect(() => {
    if (country) {
      const data = getIntegrationsForCountry(country)
      setCountryData(data)
    }
  }, [country])

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry)
    setSelectedIntegrations([])
  }

  const handleIntegrationToggle = (integrationId: string) => {
    const updated = selectedIntegrations.includes(integrationId)
      ? selectedIntegrations.filter((id) => id !== integrationId)
      : [...selectedIntegrations, integrationId]

    setSelectedIntegrations(updated)
    onIntegrationsSelected(updated)
  }

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }))
  }

  const renderIntegrationCard = (integration: Integration) => {
    const isSelected = selectedIntegrations.includes(integration.id)

    return (
      <div
        key={integration.id}
        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
          isSelected ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => handleIntegrationToggle(integration.id)}
      >
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <img
              src={integration.logo || "/integration-logo.png"}
              alt={integration.name}
              className="w-6 h-6"
              onError={(e) => {
                e.currentTarget.src = "/integration-logo.png"
              }}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{integration.name}</h4>
            {integration.apiAvailable ? (
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5">
                <Zap className="w-3 h-3 mr-1" />
                API
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5">
                Manual
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600 truncate">{integration.description}</p>
        </div>

        <div className="flex-shrink-0">
          <Checkbox checked={isSelected} onChange={() => {}} className="pointer-events-none" />
        </div>
      </div>
    )
  }

  const renderCategorySection = (categoryKey: keyof CountryIntegrations, integrations: Integration[]) => {
    if (!integrations.length) return null

    const config = categoryConfig[categoryKey as keyof typeof categoryConfig]
    const isExpanded = expandedCategories[categoryKey]
    const selectedCount = integrations.filter((int) => selectedIntegrations.includes(int.id)).length

    return (
      <Collapsible key={categoryKey} open={isExpanded} onOpenChange={() => toggleCategory(categoryKey)}>
        <CollapsibleTrigger asChild>
          <Card className={`cursor-pointer transition-all duration-200 ${config.color}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center">
                    <config.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">{config.label}</CardTitle>
                    <CardDescription className="text-xs">{config.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCount > 0 && (
                    <Badge variant="secondary" className="bg-white/70 text-xs">
                      {selectedCount} selected
                    </Badge>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-2 space-y-2">{integrations.map(renderIntegrationCard)}</div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  if (!countryData && !locationLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No integrations available</h3>
          <p className="text-gray-600 text-sm">Please select a country to see available integrations.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <CardTitle className="text-base">Restaurant Location</CardTitle>
            {locationLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
          </div>
          {location.detected && (
            <CardDescription className="text-xs text-green-600">
              Auto-detected: {location.city}, {location.country}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select value={country} onValueChange={handleCountryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {countryData && (
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                <span>Currency:</span>
                <span className="font-medium">{countryData.currency}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {countryData && (
        <div className="space-y-3">
          {renderCategorySection("restaurantInfo", countryData.restaurantInfo)}
          {renderCategorySection("menuOrders", countryData.menuOrders)}
          {renderCategorySection("reviews", countryData.reviews)}
          {renderCategorySection("marketing", countryData.marketing)}
          {renderCategorySection("socialMedia", countryData.socialMedia)}
          {renderCategorySection("customerInfo", countryData.customerInfo)}
        </div>
      )}

      {selectedIntegrations.length > 0 && (
        <Card className="bg-blue-50 border-blue-200 sticky bottom-4 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-semibold text-blue-900 text-sm">{selectedIntegrations.length} selected</h4>
                <p className="text-xs text-blue-700 truncate">Ready to connect and import</p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-shrink-0">
                <Check className="w-4 h-4 mr-1" />
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
