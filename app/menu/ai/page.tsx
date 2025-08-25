"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Wand2,
  Palette,
  Star,
  Calendar,
  Percent,
  BarChart3,
  Sparkles,
  Eye,
  Settings,
  Zap,
  TrendingUp,
  Users,
  Target,
} from "lucide-react"
import Link from "next/link"

interface AITool {
  id: string
  name: string
  description: string
  icon: any
  path: string
  category: "design" | "optimization" | "analytics" | "automation"
  status: "available" | "coming_soon" | "beta"
  estimatedImpact: string
  features: string[]
}

export default function AIMenuToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const aiTools: AITool[] = [
    {
      id: "design",
      name: "AI Menu Designer",
      description: "Create beautiful menu designs with AI-powered templates and customization",
      icon: Palette,
      path: "/menu/ai/design",
      category: "design",
      status: "available",
      estimatedImpact: "+$600-1,500/month",
      features: ["Color scheme optimization", "Typography enhancement", "Layout templates", "Brand consistency"],
    },
    {
      id: "highlighting",
      name: "Smart Item Highlighting",
      description: "AI-powered highlighting and badges based on performance and trends",
      icon: Star,
      path: "/menu/ai/tags",
      category: "optimization",
      status: "available",
      estimatedImpact: "+$800-1,200/month",
      features: ["Performance-based badges", "Dynamic highlighting", "Seasonal tags", "Profit optimization"],
    },
    {
      id: "seasonal",
      name: "Seasonal Menu Manager",
      description: "Automatic seasonal themes and menu layouts with AI recommendations",
      icon: Calendar,
      path: "/menu/ai/seasonal",
      category: "automation",
      status: "available",
      estimatedImpact: "+$1,000-2,000/month",
      features: ["Seasonal themes", "Auto item suggestions", "Date-based activation", "Weather integration"],
    },
    {
      id: "promotions",
      name: "Smart Promotions",
      description: "AI-generated promotional offers based on customer behavior and inventory",
      icon: Percent,
      path: "/menu/ai/promotions",
      category: "optimization",
      status: "available",
      estimatedImpact: "+$1,500-3,000/month",
      features: ["Dynamic pricing", "Combo suggestions", "Happy hour optimization", "Inventory-based offers"],
    },
    {
      id: "combos",
      name: "AI Combo Generator",
      description: "Intelligent combo meal suggestions to increase average order value",
      icon: Zap,
      path: "/menu/ai/combos",
      category: "optimization",
      status: "available",
      estimatedImpact: "+$500-1,000/month",
      features: ["Smart pairing", "Profit optimization", "Customer preferences", "Seasonal combos"],
    },
    {
      id: "analytics",
      name: "Menu Performance Analytics",
      description: "Deep insights into menu item performance with AI-powered recommendations",
      icon: BarChart3,
      path: "/menu/ai/analytics",
      category: "analytics",
      status: "beta",
      estimatedImpact: "+$800-1,500/month",
      features: ["Performance tracking", "Trend analysis", "Profit insights", "Customer behavior"],
    },
    {
      id: "personalization",
      name: "Customer Personalization",
      description: "Personalized menu experiences based on customer preferences and history",
      icon: Users,
      path: "/menu/ai/personalization",
      category: "automation",
      status: "coming_soon",
      estimatedImpact: "+$2,000-4,000/month",
      features: ["Personal recommendations", "Dietary preferences", "Order history", "Dynamic menus"],
    },
    {
      id: "optimization",
      name: "Menu Optimization Engine",
      description: "Continuous AI optimization of menu layout, pricing, and item placement",
      icon: Target,
      path: "/menu/ai/optimization",
      category: "optimization",
      status: "coming_soon",
      estimatedImpact: "+$1,200-2,500/month",
      features: ["A/B testing", "Layout optimization", "Price optimization", "Item positioning"],
    },
  ]

  const categories = [
    { id: "all", name: "All Tools", count: aiTools.length },
    { id: "design", name: "Design", count: aiTools.filter((t) => t.category === "design").length },
    { id: "optimization", name: "Optimization", count: aiTools.filter((t) => t.category === "optimization").length },
    { id: "analytics", name: "Analytics", count: aiTools.filter((t) => t.category === "analytics").length },
    { id: "automation", name: "Automation", count: aiTools.filter((t) => t.category === "automation").length },
  ]

  const filteredTools =
    selectedCategory === "all" ? aiTools : aiTools.filter((tool) => tool.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "beta":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "coming_soon":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "design":
        return "text-purple-600"
      case "optimization":
        return "text-blue-600"
      case "analytics":
        return "text-green-600"
      case "automation":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/menu">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Menu
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Menu Tools</h1>
              <p className="text-sm text-gray-600">Enhance your menu with artificial intelligence</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">
              <Sparkles className="h-3 w-3 mr-1" />
              {aiTools.filter((t) => t.status === "available").length} Tools Available
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {aiTools.filter((t) => t.status === "available").length}
              </div>
              <div className="text-sm text-gray-600">Available Tools</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">$5K+</div>
              <div className="text-sm text-gray-600">Potential Monthly Revenue</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">4</div>
              <div className="text-sm text-gray-600">AI Categories</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">Automated Optimization</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
              <Badge className="ml-2 bg-white/20 text-current">{category.count}</Badge>
            </Button>
          ))}
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="border border-gray-200 bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100`}>
                      <tool.icon className={`h-5 w-5 ${getCategoryColor(tool.category)}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <Badge className={`text-xs ${getStatusColor(tool.status)}`}>
                        {tool.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{tool.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Key Features:</div>
                  <div className="space-y-1">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Impact */}
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-green-800">Revenue Impact</div>
                      <div className="text-lg font-bold text-green-900">{tool.estimatedImpact}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {tool.status === "available" ? (
                    <>
                      <Link href={tool.path} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <Wand2 className="h-4 w-4 mr-2" />
                          Use Tool
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="px-3 bg-transparent">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </>
                  ) : tool.status === "beta" ? (
                    <Button variant="outline" className="w-full bg-transparent" disabled>
                      <Settings className="h-4 w-4 mr-2" />
                      Beta Access
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full bg-transparent" disabled>
                      Coming Soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works Section */}
        <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How AI Menu Tools Work</h2>
              <p className="text-gray-600">Understanding the AI enhancement process</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analyze</h3>
                <p className="text-sm text-gray-600">
                  AI analyzes your menu data, customer behavior, and performance metrics
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Generate</h3>
                <p className="text-sm text-gray-600">Creates personalized recommendations and design enhancements</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Preview</h3>
                <p className="text-sm text-gray-600">See changes in real-time before applying to your live menu</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Optimize</h3>
                <p className="text-sm text-gray-600">Continuously learns and improves based on results</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
