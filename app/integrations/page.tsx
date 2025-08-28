"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Settings,
  Activity,
  Mail,
  MessageSquare,
  CreditCard,
  Share2,
  BarChart3,
  Zap,
  RefreshCw,
  Wifi,
  WifiOff,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Integration {
  id: string
  name: string
  category: "communication" | "payment" | "social" | "analytics"
  status: "connected" | "disconnected" | "error" | "syncing"
  lastSync: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  health: number
  config: Record<string, any>
  metrics?: {
    requests: number
    errors: number
    uptime: number
  }
}

export default function IntegrationsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [configOpen, setConfigOpen] = useState(false)
  const [healthChecking, setHealthChecking] = useState<string | null>(null)

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "email-service",
      name: "Email Service",
      category: "communication",
      status: "connected",
      lastSync: "2 minutes ago",
      description: "SendGrid & Mailgun email delivery",
      icon: Mail,
      health: 98,
      config: { provider: "sendgrid", apiKey: "sk_***", fromEmail: "noreply@tablesalt.ai" },
      metrics: { requests: 1247, errors: 3, uptime: 99.8 },
    },
    {
      id: "sms-service",
      name: "SMS Service",
      category: "communication",
      status: "connected",
      lastSync: "5 minutes ago",
      description: "Twilio SMS messaging",
      icon: MessageSquare,
      health: 95,
      config: { provider: "twilio", accountSid: "AC***", authToken: "***" },
      metrics: { requests: 892, errors: 12, uptime: 98.2 },
    },
    {
      id: "stripe-payments",
      name: "Stripe Payments",
      category: "payment",
      status: "connected",
      lastSync: "1 minute ago",
      description: "Payment processing & subscriptions",
      icon: CreditCard,
      health: 100,
      config: { publishableKey: "pk_***", secretKey: "sk_***", webhookSecret: "whsec_***" },
      metrics: { requests: 2341, errors: 0, uptime: 100 },
    },
    {
      id: "facebook-business",
      name: "Facebook Business",
      category: "social",
      status: "error",
      lastSync: "2 hours ago",
      description: "Facebook Pages & Instagram",
      icon: Share2,
      health: 45,
      config: { appId: "123***", appSecret: "***", accessToken: "EAA***" },
      metrics: { requests: 156, errors: 23, uptime: 87.3 },
    },
    {
      id: "google-analytics",
      name: "Google Analytics",
      category: "analytics",
      status: "syncing",
      lastSync: "Syncing now",
      description: "Website & app analytics",
      icon: BarChart3,
      health: 92,
      config: { measurementId: "G-***", apiSecret: "***" },
      metrics: { requests: 3456, errors: 8, uptime: 99.1 },
    },
  ])

  const getStatusColor = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "syncing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "disconnected":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-3 w-3" />
      case "error":
        return <AlertCircle className="h-3 w-3" />
      case "syncing":
        return <RefreshCw className="h-3 w-3 animate-spin" />
      case "disconnected":
        return <WifiOff className="h-3 w-3" />
    }
  }

  const getCategoryIcon = (category: Integration["category"]) => {
    switch (category) {
      case "communication":
        return <Mail className="h-4 w-4" />
      case "payment":
        return <CreditCard className="h-4 w-4" />
      case "social":
        return <Share2 className="h-4 w-4" />
      case "analytics":
        return <BarChart3 className="h-4 w-4" />
    }
  }

  const runHealthCheck = async (integrationId: string) => {
    setHealthChecking(integrationId)

    try {
      // Simulate health check API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === integrationId
            ? { ...integration, health: Math.random() * 100, lastSync: "Just now" }
            : integration,
        ),
      )

      toast({
        title: "Health Check Complete",
        description: "Integration status updated successfully",
      })
    } catch (error) {
      toast({
        title: "Health Check Failed",
        description: "Unable to check integration status",
        variant: "destructive",
      })
    } finally {
      setHealthChecking(null)
    }
  }

  const saveConfiguration = () => {
    if (!selectedIntegration) return

    toast({
      title: "Configuration Saved",
      description: `${selectedIntegration.name} settings updated successfully`,
    })
    setConfigOpen(false)
  }

  const groupedIntegrations = integrations.reduce(
    (acc, integration) => {
      if (!acc[integration.category]) {
        acc[integration.category] = []
      }
      acc[integration.category].push(integration)
      return acc
    },
    {} as Record<string, Integration[]>,
  )

  const overallHealth = Math.round(integrations.reduce((sum, int) => sum + int.health, 0) / integrations.length)
  const connectedCount = integrations.filter((int) => int.status === "connected").length
  const errorCount = integrations.filter((int) => int.status === "error").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Integration Management</h1>
              <p className="text-sm text-muted-foreground">Monitor and configure your restaurant integrations</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">{connectedCount} Connected</span>
              </div>
              {errorCount > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-muted-foreground">{errorCount} Issues</span>
                </div>
              )}
            </div>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              Health: {overallHealth}%
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health Checks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">System Health</p>
                      <p className="text-2xl font-bold text-card-foreground">{overallHealth}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Active Integrations</p>
                      <p className="text-2xl font-bold text-card-foreground">
                        {connectedCount}/{integrations.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Total Requests</p>
                      <p className="text-2xl font-bold text-card-foreground">
                        {integrations.reduce((sum, int) => sum + (int.metrics?.requests || 0), 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Integration Categories */}
            {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(category as Integration["category"])}
                  <h2 className="text-lg font-semibold text-foreground capitalize">{category}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryIntegrations.map((integration) => {
                    const IconComponent = integration.icon
                    return (
                      <Card key={integration.id} className="bg-card border-border hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-muted rounded-lg">
                                <IconComponent className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <CardTitle className="text-base text-card-foreground">{integration.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{integration.description}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(integration.status)}>
                              {getStatusIcon(integration.status)}
                              <span className="ml-1 capitalize">{integration.status}</span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Health</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={integration.health} className="w-16 h-2" />
                              <span className="text-card-foreground font-medium">{integration.health}%</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Last sync</span>
                            <span className="text-card-foreground">{integration.lastSync}</span>
                          </div>

                          <div className="flex items-center space-x-2 pt-2">
                            <Dialog
                              open={configOpen && selectedIntegration?.id === integration.id}
                              onOpenChange={setConfigOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 bg-transparent"
                                  onClick={() => setSelectedIntegration(integration)}
                                >
                                  <Settings className="h-4 w-4 mr-1" />
                                  Configure
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Configure {integration.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  {Object.entries(integration.config).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                      <Label htmlFor={key} className="capitalize">
                                        {key.replace(/([A-Z])/g, " $1").trim()}
                                      </Label>
                                      <div className="relative">
                                        <Input
                                          id={key}
                                          type={
                                            key.includes("secret") || key.includes("key") || key.includes("token")
                                              ? "password"
                                              : "text"
                                          }
                                          defaultValue={typeof value === "string" ? value : JSON.stringify(value)}
                                          className="pr-10"
                                        />
                                        {(key.includes("secret") || key.includes("key") || key.includes("token")) && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3"
                                          >
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  <div className="flex items-center space-x-2">
                                    <Switch id="enabled" defaultChecked />
                                    <Label htmlFor="enabled">Enable Integration</Label>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => setConfigOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={saveConfiguration}>Save Changes</Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => runHealthCheck(integration.id)}
                              disabled={healthChecking === integration.id}
                            >
                              {healthChecking === integration.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Activity className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">System Health Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {integrations.map((integration) => {
                  const IconComponent = integration.icon
                  return (
                    <div key={integration.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-card-foreground">{integration.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {integration.metrics?.requests.toLocaleString()} requests • {integration.metrics?.errors}{" "}
                            errors
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-card-foreground">{integration.health}%</p>
                          <p className="text-xs text-muted-foreground">{integration.metrics?.uptime}% uptime</p>
                        </div>
                        <Progress value={integration.health} className="w-20 h-2" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runHealthCheck(integration.id)}
                          disabled={healthChecking === integration.id}
                        >
                          {healthChecking === integration.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Check"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {integrations.reduce((sum, int) => sum + (int.metrics?.requests || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Errors</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {integrations.reduce((sum, int) => sum + (int.metrics?.errors || 0), 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Avg Uptime</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {Math.round(
                        integrations.reduce((sum, int) => sum + (int.metrics?.uptime || 0), 0) / integrations.length,
                      )}
                      %
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {(
                        (integrations.reduce((sum, int) => sum + (int.metrics?.errors || 0), 0) /
                          integrations.reduce((sum, int) => sum + (int.metrics?.requests || 0), 0)) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Global Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">Auto Health Checks</p>
                    <p className="text-sm text-muted-foreground">Automatically run health checks every hour</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">Error Notifications</p>
                    <p className="text-sm text-muted-foreground">Send alerts when integrations fail</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">Performance Monitoring</p>
                    <p className="text-sm text-muted-foreground">Track detailed performance metrics</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
