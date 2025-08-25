"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  CheckCircle,
  XCircle,
  Edit3,
  ChevronDown,
  Star,
  Users,
  ShoppingCart,
  Store,
  AlertTriangle,
  Check,
  ArrowRight,
  TrendingUp,
} from "lucide-react"

interface ReviewData {
  type: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  items: ReviewItem[]
  summary: DataSummary
  confidence: number
}

interface ReviewItem {
  id: string
  data: Record<string, any>
  confidence: number
  status: "approved" | "rejected" | "pending" | "edited"
  source: string
  lastUpdated: string
  editable: boolean
}

interface DataSummary {
  total: number
  approved: number
  rejected: number
  edited: number
  highConfidence: number
  mediumConfidence: number
  lowConfidence: number
}

interface DataReviewInterfaceProps {
  importedData: any[]
  onReviewComplete: (reviewedData: any) => void
  onBack: () => void
}

const dataTypeConfig = {
  restaurantInfo: {
    label: "Restaurant Info",
    icon: Store,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  menu: {
    label: "Menu Items",
    icon: ShoppingCart,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  customers: {
    label: "Customer Data",
    icon: Users,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  reviews: {
    label: "Reviews",
    icon: Star,
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  orders: {
    label: "Order History",
    icon: TrendingUp,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
}

export function DataReviewInterface({ importedData, onReviewComplete, onBack }: DataReviewInterfaceProps) {
  const [reviewData, setReviewData] = useState<ReviewData[]>(() => {
    // Mock data transformation from imported data
    return [
      {
        type: "restaurantInfo",
        label: "Restaurant Info",
        icon: Store,
        confidence: 95,
        summary: {
          total: 1,
          approved: 0,
          rejected: 0,
          edited: 0,
          highConfidence: 1,
          mediumConfidence: 0,
          lowConfidence: 0,
        },
        items: [
          {
            id: "rest-info-1",
            data: {
              name: "Bella Vista Italian Restaurant",
              address: "123 Main Street, Downtown",
              phone: "(555) 123-4567",
              email: "info@bellavista.com",
              website: "www.bellavista.com",
              cuisine: "Italian",
              priceRange: "$$",
              hours: "Mon-Sun: 11:00 AM - 10:00 PM",
            },
            confidence: 95,
            status: "pending",
            source: "Google My Business",
            lastUpdated: "2024-01-15",
            editable: true,
          },
        ],
      },
      {
        type: "menu",
        label: "Menu Items",
        icon: ShoppingCart,
        confidence: 92,
        summary: {
          total: 247,
          approved: 0,
          rejected: 0,
          edited: 0,
          highConfidence: 198,
          mediumConfidence: 35,
          lowConfidence: 14,
        },
        items: [
          {
            id: "menu-1",
            data: {
              name: "Margherita Pizza",
              description: "Fresh mozzarella, tomato sauce, basil",
              price: 18.99,
              category: "Pizza",
              allergens: ["Gluten", "Dairy"],
              available: true,
            },
            confidence: 98,
            status: "pending",
            source: "Square POS",
            lastUpdated: "2024-01-15",
            editable: true,
          },
          {
            id: "menu-2",
            data: {
              name: "Caesar Salad",
              description: "Romaine lettuce, parmesan, croutons, caesar dressing",
              price: 12.99,
              category: "Salads",
              allergens: ["Gluten", "Dairy"],
              available: true,
            },
            confidence: 85,
            status: "pending",
            source: "Square POS",
            lastUpdated: "2024-01-15",
            editable: true,
          },
        ],
      },
      {
        type: "customers",
        label: "Customer Data",
        icon: Users,
        confidence: 88,
        summary: {
          total: 1247,
          approved: 0,
          rejected: 0,
          edited: 0,
          highConfidence: 892,
          mediumConfidence: 255,
          lowConfidence: 100,
        },
        items: [
          {
            id: "customer-1",
            data: {
              name: "John Smith",
              email: "john.smith@email.com",
              phone: "(555) 987-6543",
              totalOrders: 23,
              totalSpent: 487.65,
              lastVisit: "2024-01-10",
              preferences: ["Italian", "Vegetarian options"],
            },
            confidence: 92,
            status: "pending",
            source: "Square POS",
            lastUpdated: "2024-01-15",
            editable: true,
          },
        ],
      },
    ]
  })

  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("overview")

  const handleItemAction = (dataType: string, itemId: string, action: "approve" | "reject" | "edit") => {
    setReviewData((prev) =>
      prev.map((section) => {
        if (section.type === dataType) {
          const updatedItems = section.items.map((item) => {
            if (item.id === itemId) {
              if (action === "edit") {
                setEditingItem(itemId)
                return item
              }
              return { ...item, status: action === "approve" ? "approved" : "rejected" }
            }
            return item
          })

          // Update summary
          const summary = {
            total: updatedItems.length,
            approved: updatedItems.filter((i) => i.status === "approved").length,
            rejected: updatedItems.filter((i) => i.status === "rejected").length,
            edited: updatedItems.filter((i) => i.status === "edited").length,
            highConfidence: updatedItems.filter((i) => i.confidence >= 90).length,
            mediumConfidence: updatedItems.filter((i) => i.confidence >= 70 && i.confidence < 90).length,
            lowConfidence: updatedItems.filter((i) => i.confidence < 70).length,
          }

          return { ...section, items: updatedItems, summary }
        }
        return section
      }),
    )
  }

  const handleItemEdit = (dataType: string, itemId: string, newData: Record<string, any>) => {
    setReviewData((prev) =>
      prev.map((section) => {
        if (section.type === dataType) {
          const updatedItems = section.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, data: newData, status: "edited" }
            }
            return item
          })
          return { ...section, items: updatedItems }
        }
        return section
      }),
    )
    setEditingItem(null)
  }

  const toggleSection = (sectionType: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionType]: !prev[sectionType],
    }))
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return <Badge className="bg-green-100 text-green-700 text-xs">High ({confidence}%)</Badge>
    }
    if (confidence >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-700 text-xs">Medium ({confidence}%)</Badge>
    }
    return <Badge className="bg-red-100 text-red-700 text-xs">Low ({confidence}%)</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "edited":
        return <Edit3 className="w-4 h-4 text-blue-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
    }
  }

  const renderOverview = () => {
    const totalItems = reviewData.reduce((sum, section) => sum + section.summary.total, 0)
    const totalApproved = reviewData.reduce((sum, section) => sum + section.summary.approved, 0)
    const totalRejected = reviewData.reduce((sum, section) => sum + section.summary.rejected, 0)
    const totalEdited = reviewData.reduce((sum, section) => sum + section.summary.edited, 0)
    const overallProgress = ((totalApproved + totalRejected + totalEdited) / totalItems) * 100

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Summary</CardTitle>
            <CardDescription>
              {totalItems} items imported • {Math.round(overallProgress)}% reviewed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
                <div className="text-xs text-gray-600">Total Items</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{totalApproved}</div>
                <div className="text-xs text-green-600">Approved</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalEdited}</div>
                <div className="text-xs text-blue-600">Edited</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
                <div className="text-xs text-red-600">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {reviewData.map((section) => {
            const config = dataTypeConfig[section.type as keyof typeof dataTypeConfig]
            const Icon = section.icon
            const isExpanded = expandedSections[section.type]

            return (
              <Collapsible key={section.type} open={isExpanded} onOpenChange={() => toggleSection(section.type)}>
                <CollapsibleTrigger asChild>
                  <Card className={`cursor-pointer transition-all duration-200 ${config?.color}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">{section.label}</CardTitle>
                            <CardDescription className="text-xs">
                              {section.summary.total} items • {section.confidence}% avg confidence
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {section.summary.approved > 0 && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              {section.summary.approved} approved
                            </Badge>
                          )}
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-2 space-y-2">
                    {section.items.slice(0, 3).map((item) => (
                      <Card key={item.id} className="bg-white">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {getStatusIcon(item.status)}
                                <h4 className="font-medium text-sm truncate">
                                  {item.data.name || item.data.title || "Unnamed Item"}
                                </h4>
                                {getConfidenceBadge(item.confidence)}
                              </div>
                              <p className="text-xs text-gray-600 truncate">
                                From {item.source} • Updated {item.lastUpdated}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 bg-transparent"
                                onClick={() => handleItemAction(section.type, item.id, "approve")}
                                disabled={item.status === "approved"}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 bg-transparent"
                                onClick={() => handleItemAction(section.type, item.id, "reject")}
                                disabled={item.status === "rejected"}
                              >
                                <XCircle className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {section.items.length > 3 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => setActiveTab(section.type)}
                      >
                        View all {section.items.length} items
                      </Button>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDetailedView = (sectionType: string) => {
    const section = reviewData.find((s) => s.type === sectionType)
    if (!section) return null

    return (
      <div className="space-y-3">
        {section.items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <h4 className="font-medium text-sm">{item.data.name || item.data.title || "Unnamed Item"}</h4>
                  {getConfidenceBadge(item.confidence)}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleItemAction(section.type, item.id, "edit")}>
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleItemAction(section.type, item.id, "approve")}
                    disabled={item.status === "approved"}
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleItemAction(section.type, item.id, "reject")}
                    disabled={item.status === "rejected"}
                  >
                    <XCircle className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {editingItem === item.id ? (
                <div className="space-y-3">
                  {Object.entries(item.data).map(([key, value]) => (
                    <div key={key}>
                      <Label className="text-xs font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                      {typeof value === "string" && value.length > 50 ? (
                        <Textarea
                          defaultValue={value as string}
                          className="mt-1"
                          onBlur={(e) => handleItemEdit(section.type, item.id, { ...item.data, [key]: e.target.value })}
                        />
                      ) : (
                        <Input
                          defaultValue={value as string}
                          className="mt-1"
                          onBlur={(e) => handleItemEdit(section.type, item.id, { ...item.data, [key]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setEditingItem(null)}>
                      Save Changes
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(item.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                      <span className="font-medium truncate ml-2">{String(value)}</span>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Source: {item.source} • Updated: {item.lastUpdated}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const canProceed = reviewData.every(
    (section) => section.summary.approved + section.summary.rejected + section.summary.edited > 0,
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Review Imported Data</CardTitle>
              <CardDescription>Review, edit, and approve your imported data before finalizing</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onBack}>
              Back
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="restaurantInfo">Info</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {renderOverview()}
        </TabsContent>

        {reviewData.map((section) => (
          <TabsContent key={section.type} value={section.type} className="mt-4">
            {renderDetailedView(section.type)}
          </TabsContent>
        ))}
      </Tabs>

      {canProceed && (
        <Card className="bg-green-50 border-green-200 sticky bottom-4 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-semibold text-green-900 text-sm">Ready to Proceed</h4>
                <p className="text-xs text-green-700">All data has been reviewed</p>
              </div>
              <Button
                size="sm"
                onClick={() => onReviewComplete(reviewData)}
                className="bg-green-600 hover:bg-green-700"
              >
                <ArrowRight className="w-4 h-4 mr-1" />
                Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
