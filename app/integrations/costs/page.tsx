"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Link2, ShieldCheck, DollarSign, Lock, AlertTriangle, CheckCircle, Info, Building2, PlugZap, Globe2 } from 'lucide-react'
import Link from "next/link"

type CostLevel = "none" | "quota" | "paid" | "partner"
type WhoPays = "user" | "platform" | "none" | "varies"

interface Provider {
  id: string
  name: string
  category: "Listing" | "Social" | "POS" | "Reservation" | "Delivery" | "Other"
  connectModel: "oauth" | "public-api" | "partner"
  endUserCost: WhoPays
  platformCost: CostLevel
  safeToAsk: boolean
  notes: string
  requirements?: string[]
}

const PROVIDERS: Provider[] = [
  {
    id: "google-business-profile",
    name: "Google Business Profile (Business Profile API)",
    category: "Listing",
    connectModel: "oauth",
    endUserCost: "none",
    platformCost: "none",
    safeToAsk: true,
    notes:
      "Free to connect for location managers via OAuth. App verification required. Do not confuse with Google Maps Places API billing.",
    requirements: ["Google Cloud project + OAuth verification", "User must manage the business location"],
  },
  {
    id: "google-maps-places",
    name: "Google Maps Places API (public data)",
    category: "Other",
    connectModel: "public-api",
    endUserCost: "none",
    platformCost: "paid",
    safeToAsk: false,
    notes:
      "Billed per request. Useful for public search/place details/photos when the user can’t connect their GBP. Consider carefully before enabling.",
    requirements: ["Billing enabled on Google Cloud", "Key restrictions and quota management"],
  },
  {
    id: "yelp-fusion",
    name: "Yelp Fusion API",
    category: "Listing",
    connectModel: "public-api",
    endUserCost: "none",
    platformCost: "quota",
    safeToAsk: true,
    notes:
      "Free tier with rate limits for common use (read-only). Commercial or high-volume usage may require a separate agreement.",
    requirements: ["API key + adherence to Yelp terms", "Respect rate limits"],
  },
  {
    id: "facebook-pages",
    name: "Facebook Pages (Graph API)",
    category: "Social",
    connectModel: "oauth",
    endUserCost: "none",
    platformCost: "none",
    safeToAsk: true,
    notes:
      "Free to connect a Page via OAuth. Certain permissions require App Review. Good for posts/events/photos owned by the Page.",
    requirements: ["Meta App + App Review for required scopes", "User must be a Page admin/editor"],
  },
  {
    id: "instagram-graph",
    name: "Instagram (Instagram Graph API)",
    category: "Social",
    connectModel: "oauth",
    endUserCost: "none",
    platformCost: "none",
    safeToAsk: true,
    notes:
      "Free to connect Business/Creator accounts linked to a Facebook Page. Permissions require App Review. Posting/content insights supported.",
    requirements: ["Meta App + App Review", "IG Business/Creator linked to a FB Page"],
  },
  {
    id: "square",
    name: "Square",
    category: "POS",
    connectModel: "oauth",
    endUserCost: "none",
    platformCost: "none",
    safeToAsk: true,
    notes:
      "Merchants can authorize your app via OAuth. APIs are free with rate limits. Great for payment methods, menus, orders owned by the merchant.",
    requirements: ["Square developer app", "OAuth + correct scopes"],
  },
  {
    id: "toast",
    name: "Toast",
    category: "POS",
    connectModel: "partner",
    endUserCost: "none",
    platformCost: "partner",
    safeToAsk: false,
    notes:
      "Partner-only access. Requires business and technical approval; often commercial terms. Gate with ‘Request access’.",
    requirements: ["Partner agreement", "Sandbox access from Toast"],
  },
  {
    id: "opentable",
    name: "OpenTable",
    category: "Reservation",
    connectModel: "partner",
    endUserCost: "none",
    platformCost: "partner",
    safeToAsk: false,
    notes:
      "Partner APIs are restricted. Typically requires commercial relationship. Good for reservations and curated amenities.",
    requirements: ["Partner agreement", "Approved use cases"],
  },
  {
    id: "ubereats",
    name: "Uber Eats",
    category: "Delivery",
    connectModel: "partner",
    endUserCost: "none",
    platformCost: "partner",
    safeToAsk: false,
    notes:
      "Merchant-partner APIs are restricted. Integration usually goes through Uber’s partner program. Gate as optional.",
    requirements: ["Partner agreement", "Merchant link process"],
  },
  {
    id: "doordash",
    name: "DoorDash",
    category: "Delivery",
    connectModel: "partner",
    endUserCost: "none",
    platformCost: "partner",
    safeToAsk: false,
    notes:
      "Similar to Uber Eats—restricted APIs for partners/merchants. Keep optional and show ‘Request access’.",
    requirements: ["Partner agreement"],
  },
  {
    id: "tripadvisor",
    name: "TripAdvisor",
    category: "Listing",
    connectModel: "partner",
    endUserCost: "none",
    platformCost: "partner",
    safeToAsk: false,
    notes:
      "Limited API programs; most use is via partnerships or licensed data. Treat as specialized.",
    requirements: ["Data license or partner program"],
  },
  {
    id: "website",
    name: "Official Website (Import/Scrape)",
    category: "Other",
    connectModel: "public-api",
    endUserCost: "none",
    platformCost: "quota",
    safeToAsk: true,
    notes:
      "No API fees, but you bear infra costs for crawling/AI extraction. Ensure ToS compliance and respect robots.txt.",
    requirements: ["Consent/compliance", "Scraping/ETL infra", "AI extraction pipeline"],
  },
]

function CostBadge({ level }: { level: CostLevel }) {
  switch (level) {
    case "none":
      return <Badge className="bg-green-50 text-green-700 border-green-200">No platform fees</Badge>
    case "quota":
      return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Free tier + quotas</Badge>
    case "paid":
      return <Badge className="bg-red-50 text-red-700 border-red-200">Billable API</Badge>
    case "partner":
      return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Partner-only</Badge>
  }
}

function WhoPaysBadge({ who }: { who: WhoPays }) {
  switch (who) {
    case "none":
      return <Badge variant="outline">User pays: $0</Badge>
    case "platform":
      return <Badge variant="outline" className="border-blue-200 text-blue-700">Platform pays</Badge>
    case "user":
      return <Badge variant="outline" className="border-amber-200 text-amber-700">User may pay</Badge>
    case "varies":
      return <Badge variant="outline" className="border-gray-200 text-gray-700">Varies</Badge>
  }
}

export default function IntegrationCostsPage() {
  const [hidePartnerOnly, setHidePartnerOnly] = useState(true)
  const [showOnlySafe, setShowOnlySafe] = useState(true)

  const filtered = useMemo(() => {
    return PROVIDERS.filter(p => {
      if (hidePartnerOnly && p.connectModel === "partner") return false
      if (showOnlySafe && !p.safeToAsk) return false
      return true
    })
  }, [hidePartnerOnly, showOnlySafe])

  const grouped = useMemo(() => {
    return filtered.reduce((acc, p) => {
      acc[p.category] ||= []
      acc[p.category].push(p)
      return acc
    }, {} as Record<string, Provider[]>)
  }, [filtered])

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <PlugZap className="h-5 w-5 text-gray-900" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Integration Costs and Access</h1>
              <p className="text-xs text-gray-600">
                Understand who pays and what’s required for each channel before prompting users to connect.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch id="safe-only" checked={showOnlySafe} onCheckedChange={setShowOnlySafe} />
              <Label htmlFor="safe-only" className="text-sm">Show only “safe to ask”</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="hide-partner" checked={hidePartnerOnly} onCheckedChange={setHidePartnerOnly} />
              <Label htmlFor="hide-partner" className="text-sm">Hide partner-only</Label>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>TL;DR</AlertTitle>
          <AlertDescription className="text-sm">
            Connecting a user’s own accounts (Google Business Profile, Facebook/Instagram, Square, Yelp free tier) is typically free for both the user and your platform, aside from rate limits. Partner-only platforms (Toast, OpenTable, Uber Eats, DoorDash) require agreements and may introduce costs or restrictions. Public data APIs like Google Maps Places are billable per request.
          </AlertDescription>
        </Alert>

        {Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-900">{category}</h2>
              <Separator className="flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(p => (
                <Card key={p.id} className="bg-white border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <CardDescription className="text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Link2 className="h-3 w-3" />
                        {p.connectModel === "oauth" ? "OAuth (user-owned data)" :
                         p.connectModel === "public-api" ? "Public API" : "Partner-only API"}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <WhoPaysBadge who={p.endUserCost} />
                      <CostBadge level={p.platformCost} />
                      {p.safeToAsk ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Safe to ask users to connect
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                          <Lock className="h-3 w-3 mr-1" />
                          Restricted or partner-only
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-700">{p.notes}</p>

                    {p.requirements && p.requirements.length > 0 && (
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="inline-flex items-center gap-1 font-medium">
                          <Info className="h-3 w-3" /> Requirements
                        </div>
                        <ul className="list-disc pl-5 space-y-1">
                          {p.requirements.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Recommended onboarding approach</CardTitle>
            <CardDescription>Minimize friction and avoid surprise costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p>
                Default to OAuth connections for user‑owned channels first: Google Business Profile, Facebook/Instagram Pages, Square, Yelp (free tier). These are typically zero-cost to connect and safest to prompt immediately after login.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p>
                Gate partner‑only platforms (Toast, OpenTable, Uber Eats, DoorDash) behind a “Request access” flow and mark them as optional. Don’t block setup on these.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-blue-600 mt-0.5" />
              <p>
                If you need public data (no user account to connect), prefer free tiers with quotas (Yelp Fusion) and be cautious with billable APIs like Google Maps Places. Add usage limits and caching to control spend.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 text-purple-600 mt-0.5" />
              <p>
                For reservation/delivery partners, start business development in parallel. Until approved, show the integration with “Partner access required” and a short description of benefits.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Globe2 className="h-4 w-4 text-gray-700 mt-0.5" />
              <p>
                If you import menu/amenities from the official website, ensure ToS compliance, allow opt‑in, and budget for your own scraping/AI processing costs rather than charging users.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-gray-500">
          Disclaimer: Cost and access models can change. Confirm current terms with each provider before launch.
        </div>
      </div>
    </main>
  )
}
