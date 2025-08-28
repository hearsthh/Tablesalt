"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Search, Download, Mail, Phone, DollarSign, ShoppingCart, Star, Brain } from "lucide-react"
import { NavigationDrawer } from "@/components/navigation-drawer"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  total_orders: number
  total_spent: number
  avg_order_value: number
  loyalty_points: number
  customer_segment: string
  last_order_date: string
  created_at: string
  preferences?: any
  dietary_restrictions?: string[]
}

export default function CustomersPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSegment, setSelectedSegment] = useState("all")

  useEffect(() => {
    loadCustomersData()
  }, [])

  const loadCustomersData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading customers data...")

      const response = await fetch("/api/v1/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers || [])
        toast({
          title: "Customers Loaded",
          description: `Loaded ${data.customers?.length || 0} customer records`,
        })
      } else {
        throw new Error("Failed to load customers")
      }
    } catch (error) {
      console.error("[v0] Failed to load customers:", error)

      setCustomers([
        {
          id: "cu111111-1111-1111-1111-111111111111",
          first_name: "John",
          last_name: "Smith",
          email: "john.smith@email.com",
          phone: "+1-555-1001",
          total_orders: 15,
          total_spent: 487.5,
          avg_order_value: 32.5,
          loyalty_points: 150,
          customer_segment: "regular",
          last_order_date: "2024-01-20",
          created_at: "2023-07-15",
          preferences: { favorite_items: ["Spaghetti Carbonara", "Margherita Pizza"] },
          dietary_restrictions: [],
        },
        {
          id: "cu222222-2222-2222-2222-222222222222",
          first_name: "Sarah",
          last_name: "Johnson",
          email: "sarah.j@email.com",
          phone: "+1-555-1002",
          total_orders: 8,
          total_spent: 234.8,
          avg_order_value: 29.35,
          loyalty_points: 80,
          customer_segment: "occasional",
          last_order_date: "2024-01-18",
          created_at: "2023-09-22",
          preferences: { favorite_items: ["Bruschetta Trio"] },
          dietary_restrictions: ["vegetarian"],
        },
        {
          id: "cu333333-3333-3333-3333-333333333333",
          first_name: "Michael",
          last_name: "Chen",
          email: "michael.chen@email.com",
          phone: "+1-555-2001",
          total_orders: 22,
          total_spent: 678.9,
          avg_order_value: 30.86,
          loyalty_points: 220,
          customer_segment: "vip",
          last_order_date: "2024-01-21",
          created_at: "2023-05-10",
          preferences: { favorite_items: ["Pork Dumplings", "Kung Pao Chicken"] },
          dietary_restrictions: [],
        },
      ])

      toast({
        title: "Demo Data Loaded",
        description: "Using sample customer data for demonstration",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSegment = selectedSegment === "all" || customer.customer_segment === selectedSegment

    return matchesSearch && matchesSegment
  })

  const customerStats = {
    total: customers.length,
    vip: customers.filter((c) => c.customer_segment === "vip").length,
    regular: customers.filter((c) => c.customer_segment === "regular").length,
    occasional: customers.filter((c) => c.customer_segment === "occasional").length,
    avgSpent: customers.reduce((sum, c) => sum + c.total_spent, 0) / customers.length || 0,
    avgOrders: customers.reduce((sum, c) => sum + c.total_orders, 0) / customers.length || 0,
  }

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "vip":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "regular":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "occasional":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer intelligence...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <NavigationDrawer />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Customer Intelligence</h1>
              <p className="text-sm text-gray-500 hidden sm:block">AI-powered customer insights and management</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
            <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-700">
              <Brain className="h-3 w-3 mr-1" />
              AI Insights
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Customer Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-gray-500">Total Customers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{customerStats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-500">VIP Customers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{customerStats.vip}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-xs text-gray-500">Avg Spent</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">${customerStats.avgSpent.toFixed(0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingCart className="h-4 w-4 text-orange-600" />
                <span className="text-xs text-gray-500">Avg Orders</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{customerStats.avgOrders.toFixed(0)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Tabs value={selectedSegment} onValueChange={setSelectedSegment} className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="vip">VIP</TabsTrigger>
                  <TabsTrigger value="regular">Regular</TabsTrigger>
                  <TabsTrigger value="occasional">Occasional</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Customer List */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Directory ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {customer.first_name.charAt(0)}
                            {customer.last_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {customer.first_name} {customer.last_name}
                          </h3>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                        <Badge className={`text-xs ${getSegmentColor(customer.customer_segment)}`}>
                          {customer.customer_segment.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Orders:</span>
                          <span className="ml-1 font-medium">{customer.total_orders}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Spent:</span>
                          <span className="ml-1 font-medium">${customer.total_spent.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg Order:</span>
                          <span className="ml-1 font-medium">${customer.avg_order_value.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Points:</span>
                          <span className="ml-1 font-medium">{customer.loyalty_points}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Last order: {new Date(customer.last_order_date).toLocaleDateString()} • Customer since:{" "}
                        {new Date(customer.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Mail className="h-3 w-3" />
                      </Button>
                      {customer.phone && (
                        <Button variant="outline" size="sm">
                          <Phone className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
