"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  RefreshCw,
  Users,
  DollarSign,
  Search,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  MoreVertical,
  StickyNote,
  Clock,
} from "lucide-react"
import { NavigationDrawer } from "@/components/navigation-drawer"
import { enhancedApiClient } from "@/lib/api/enhanced-api-client"
import { useToast } from "@/hooks/use-toast"

export default function CustomerIntelligencePage() {
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filterSegment, setFilterSegment] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"overview" | "segment">("overview")
  const [selectedSegmentView, setSelectedSegmentView] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [restaurantId] = useState("rest_001")
  const [customersData, setCustomersData] = useState<any[]>([])
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  useEffect(() => {
    loadCustomerData()
  }, [])

  const loadCustomerData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading customer intelligence data from enhanced API client...")

      const [customersResponse, analyticsResponse] = await Promise.all([
        enhancedApiClient.getCustomers(restaurantId),
        enhancedApiClient.getCustomerAnalytics(restaurantId),
      ])

      if (customersResponse.success && analyticsResponse.success) {
        const customers = customersResponse.data
        const analytics = analyticsResponse.data

        console.log("[v0] Loaded customers:", customers)
        console.log("[v0] Loaded analytics:", analytics)

        setCustomersData(customers)
        setAnalyticsData(analytics)

        toast({
          title: "Customer Data Loaded",
          description: `Loaded ${customers.length} customers with AI insights`,
        })
      } else {
        throw new Error("Failed to load customer data")
      }
    } catch (error) {
      console.error("[v0] Failed to load customer data:", error)
      toast({
        title: "Loading Error",
        description: "Using offline data. Some features may be limited.",
        variant: "destructive",
      })

      // Fallback to existing hardcoded data
      setAnalyticsData({
        totalCustomers: 1247,
        avgSpend: 52.4,
        segments: segments,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadCustomerData()
    setIsRefreshing(false)
  }

  // Enhanced segments data with avg spend and frequency
  const segments = [
    {
      name: "Active",
      count: 456,
      percentage: 54,
      avgSpend: 62.0,
      avgFrequency: 4.5,
      color: "bg-green-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      description: "Regular customers with recent orders",
    },
    {
      name: "New",
      count: 127,
      percentage: 15,
      avgSpend: 35.5,
      avgFrequency: 1.2,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      description: "First-time customers exploring menu",
    },
    {
      name: "Inactive",
      count: 203,
      percentage: 24,
      avgSpend: 28.75,
      avgFrequency: 0.8,
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-50",
      description: "Haven't ordered in 30+ days",
    },
    {
      name: "At Risk",
      count: 58,
      percentage: 7,
      avgSpend: 15.2,
      avgFrequency: 0.3,
      color: "bg-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      description: "Declining engagement, needs attention",
    },
  ]

  // Simplified customers data
  const allCustomers = customersData

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCustomers = allCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSegment = filterSegment === "all" || customer.segment === filterSegment
    const matchesSegmentView = viewMode === "overview" || customer.segment === selectedSegmentView
    return matchesSearch && matchesSegment && matchesSegmentView
  })

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId],
    )
  }

  const selectAllCustomers = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.id))
    }
  }

  const viewSegmentCustomers = (segmentName: string) => {
    setViewMode("segment")
    setSelectedSegmentView(segmentName.toLowerCase())
    setFilterSegment(segmentName.toLowerCase())
  }

  const backToOverview = () => {
    setViewMode("overview")
    setSelectedSegmentView("")
    setFilterSegment("all")
  }

  const getSelectedCustomersData = () => {
    return allCustomers.filter((customer) => selectedCustomers.includes(customer.id))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer intelligence data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Mobile Header */}
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {viewMode === "segment" ? (
              <Button variant="ghost" size="sm" onClick={backToOverview} className="p-1 flex-shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : (
              <NavigationDrawer />
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {viewMode === "segment"
                  ? `${selectedSegmentView.charAt(0).toUpperCase() + selectedSegmentView.slice(1)} Customers`
                  : "Customer Intelligence"}
              </h1>
              <p className="text-sm text-gray-500 truncate">
                {viewMode === "segment" ? `${filteredCustomers.length} customers` : "AI insights & analytics"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* <NotificationCenter /> */}
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="p-2">
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6 max-w-6xl mx-auto">
        {viewMode === "overview" && (
          <>
            {/* Clean Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {analyticsData?.totalCustomers?.toLocaleString() || "1,247"}
                    </p>
                    <p className="text-sm text-gray-500">Total Customers</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      ${analyticsData?.avgSpend?.toFixed(2) || "52.40"}
                    </p>
                    <p className="text-sm text-gray-500">Avg Spend</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Enhanced Segments with Avg Spend and Frequency */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Customer Segments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {segments.map((segment) => (
                  <div
                    key={segment.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => viewSegmentCustomers(segment.name)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-3 h-3 rounded-full ${segment.color} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">{segment.name}</p>
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {segment.percentage}%
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 break-words">{segment.description}</p>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div>
                            <p className="text-gray-500">Count</p>
                            <p className="font-medium text-gray-900">{segment.count}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Avg Spend</p>
                            <p className="font-medium text-gray-900">${segment.avgSpend}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Frequency</p>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <p className="font-medium text-gray-900">{segment.avgFrequency}x</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* Clean Search */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                className="pl-10 border-gray-200 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {viewMode !== "segment" && (
              <Select value={filterSegment} onValueChange={setFilterSegment}>
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="All Segments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </Card>

        {/* Bulk Selection */}
        {filteredCustomers.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedCustomers.length === filteredCustomers.length}
                onCheckedChange={selectAllCustomers}
              />
              <span className="text-sm text-gray-600">
                {selectedCustomers.length > 0
                  ? `${selectedCustomers.length} selected`
                  : `Select all (${filteredCustomers.length})`}
              </span>
            </div>
            {/* Removed BulkCommunicationPanel */}
          </div>
        )}

        {/* Clean Customer Cards */}
        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Customer Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={() => toggleCustomerSelection(customer.id)}
                    />
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{customer.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{customer.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={`text-xs px-2 py-1 ${
                            customer.segment === "active"
                              ? "bg-green-100 text-green-800"
                              : customer.segment === "inactive"
                                ? "bg-yellow-100 text-yellow-800"
                                : customer.segment === "new"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {customer.segment}
                        </Badge>
                        <Badge className={`text-xs px-2 py-1 ${getChurnRiskColor(customer.churnRisk)}`}>
                          {customer.churnRisk} Risk
                        </Badge>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>{customer.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="truncate">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span>{customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="truncate">{customer.address}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Orders</p>
                              <p className="font-semibold">{customer.totalOrders}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Spent</p>
                              <p className="font-semibold">${customer.totalSpent}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Last Order</p>
                              <p className="font-semibold">{customer.lastOrder}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Joined</p>
                              <p className="font-semibold">{customer.joinDate}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 mb-2">AI Segment</p>
                            <Badge variant="outline" className="text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {customer.aiSegment}
                            </Badge>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 mb-2">Behavior Tags</p>
                            <div className="flex flex-wrap gap-1">
                              {(customer.behaviorTags || []).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Customer Stats */}
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Last Order</p>
                      <p className="font-medium text-gray-900">{customer.lastOrder}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Orders</p>
                      <p className="font-medium text-gray-900">{customer.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Spent</p>
                      <p className="font-medium text-gray-900">${customer.totalSpent}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Avg Order</p>
                      <p className="font-medium text-gray-900">${customer.avgOrderValue}</p>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-3 w-3 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">{customer.aiSegment}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(customer.behaviorTags || []).slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(customer.behaviorTags || []).length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{(customer.behaviorTags || []).length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Single Unified Communication Button */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    {/* Removed UnifiedCommunicationPanel */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <StickyNote className="h-4 w-4 mr-2" />
                          Note
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Add Note</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <textarea
                            className="w-full p-3 border rounded-lg text-sm resize-none"
                            rows={4}
                            placeholder="Add a note about this customer..."
                            defaultValue={customer.notes}
                          />
                          <Button className="w-full">Save Note</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </div>
  )
}
