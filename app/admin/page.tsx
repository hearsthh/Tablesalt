"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Building2,
  Activity,
  AlertTriangle,
  CheckCircle,
  Search,
  Settings,
  BarChart3,
  Shield,
  Database,
  Zap,
  TrendingUp,
  Eye,
  UserPlus,
  Mail,
} from "lucide-react"

export default function AdminPanel() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [adminData, setAdminData] = useState({
    systemOverview: {
      totalRestaurants: 10,
      activeUsers: 23,
      systemHealth: "healthy",
      totalRevenue: 284750,
      activeIntegrations: 45,
    },
    restaurants: [],
    recentActivity: [],
    systemAlerts: [],
  })

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading admin panel data...")

      const mockData = {
        systemOverview: {
          totalRestaurants: 10,
          activeUsers: 23,
          systemHealth: "healthy",
          totalRevenue: 284750,
          activeIntegrations: 45,
        },
        restaurants: [
          {
            id: "rest_001",
            name: "Bella Vista Italian",
            owner: "Marco Rossi",
            status: "active",
            setupProgress: 100,
            lastActive: "2 hours ago",
            revenue: 28475,
            integrations: 5,
          },
          {
            id: "rest_002",
            name: "Dragon Palace",
            owner: "Li Wei",
            status: "active",
            setupProgress: 85,
            lastActive: "1 hour ago",
            revenue: 31250,
            integrations: 4,
          },
          {
            id: "rest_003",
            name: "Taco Libre",
            owner: "Carlos Rodriguez",
            status: "setup",
            setupProgress: 60,
            lastActive: "30 minutes ago",
            revenue: 18900,
            integrations: 2,
          },
          {
            id: "rest_004",
            name: "Burger Junction",
            owner: "Sarah Johnson",
            status: "active",
            setupProgress: 95,
            lastActive: "4 hours ago",
            revenue: 42100,
            integrations: 6,
          },
          {
            id: "rest_005",
            name: "Sushi Zen",
            owner: "Takeshi Yamamoto",
            status: "inactive",
            setupProgress: 25,
            lastActive: "2 days ago",
            revenue: 8750,
            integrations: 1,
          },
        ],
        recentActivity: [
          {
            id: "act_001",
            type: "restaurant_signup",
            message: "New restaurant registered: Spice Garden",
            timestamp: "10 minutes ago",
            severity: "info",
          },
          {
            id: "act_002",
            type: "integration_error",
            message: "Square POS connection failed for Dragon Palace",
            timestamp: "1 hour ago",
            severity: "warning",
          },
          {
            id: "act_003",
            type: "system_update",
            message: "Database backup completed successfully",
            timestamp: "2 hours ago",
            severity: "success",
          },
          {
            id: "act_004",
            type: "user_support",
            message: "Support ticket created by Bella Vista Italian",
            timestamp: "3 hours ago",
            severity: "info",
          },
        ],
        systemAlerts: [
          {
            id: "alert_001",
            type: "performance",
            message: "API response time increased by 15%",
            severity: "medium",
            timestamp: "1 hour ago",
          },
          {
            id: "alert_002",
            type: "integration",
            message: "Yelp API rate limit approaching",
            severity: "low",
            timestamp: "2 hours ago",
          },
        ],
      }

      setAdminData(mockData)
      toast({
        title: "Admin Panel Loaded",
        description: "Phase 0 management data loaded successfully.",
      })
    } catch (error) {
      console.error("[v0] Failed to load admin data:", error)
      toast({
        title: "Loading Error",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
      case "setup":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Setup</Badge>
      case "inactive":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Inactive</Badge>
      default:
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Unknown</Badge>
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  const filteredRestaurants = adminData.restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.owner.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-900 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500">Phase 0 Launch Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-50 text-green-700 border-green-200">System Healthy</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: "System Status", description: "All systems operational" })}
            >
              <Activity className="h-4 w-4 mr-2" />
              Status
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Restaurants</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{adminData.systemOverview.totalRestaurants}</div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+2 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Active Users</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{adminData.systemOverview.activeUsers}</div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+5 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Total Revenue</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${adminData.systemOverview.totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+12% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">Integrations</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{adminData.systemOverview.activeIntegrations}</div>
              <div className="flex items-center space-x-1 mt-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">All healthy</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">System Health</span>
              </div>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <div className="flex items-center space-x-1 mt-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">99.9% uptime</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Restaurant Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Restaurant Management</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search restaurants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRestaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{restaurant.name}</h3>
                          <p className="text-sm text-gray-500">Owner: {restaurant.owner}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">Setup: {restaurant.setupProgress}%</span>
                            <span className="text-xs text-gray-500">
                              Revenue: ${restaurant.revenue.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">{restaurant.integrations} integrations</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(restaurant.status)}
                        <span className="text-xs text-gray-500">{restaurant.lastActive}</span>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Activity & Alerts */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adminData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="mt-1">{getSeverityIcon(activity.severity)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>System Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {adminData.systemAlerts.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No active alerts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {adminData.systemAlerts.map((alert) => (
                      <div key={alert.id} className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-900">{alert.message}</p>
                            <p className="text-xs text-yellow-700">{alert.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite New Restaurant
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Send System Update
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <Database className="h-4 w-4 mr-2" />
                    Run System Backup
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
