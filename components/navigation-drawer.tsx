"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Menu,
  Home,
  ChefHat,
  MessageSquare,
  BarChart3,
  Settings,
  HelpCircle,
  FileText,
  Palette,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export function NavigationDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  const mainNavItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard", badge: null },
    { href: "/menu", icon: ChefHat, label: "Menu Intelligence", badge: "AI" },
    { href: "/customers", icon: Users, label: "Customer Intelligence", badge: "AI" },
    { href: "/reviews", icon: MessageSquare, label: "Reviews", badge: "3" },
    { href: "/marketing", icon: BarChart3, label: "Marketing Hub", badge: null },
    { href: "/analytics", icon: TrendingUp, label: "Analytics", badge: null },
  ]

  const aiToolsItems = [
    { href: "/menu/ai/combos", icon: Sparkles, label: "AI Combos", badge: "New" },
    { href: "/menu/ai/tags", icon: Sparkles, label: "Smart Tags", badge: null },
    { href: "/menu/ai/descriptions", icon: Sparkles, label: "Descriptions", badge: null },
    { href: "/menu/ai/pricing", icon: Sparkles, label: "Pricing", badge: null },
    { href: "/menu/ai/ordering", icon: Sparkles, label: "Reordering", badge: null },
    { href: "/menu/ai/design", icon: Palette, label: "Menu Design", badge: null },
  ]

  const dataItems = [{ href: "/content", icon: FileText, label: "Content", badge: null }]

  const settingsItems = [
    { href: "/restaurant-profile", icon: Settings, label: "Restaurant Profile", badge: null },
    { href: "/setup", icon: Settings, label: "Setup", badge: null },
    { href: "/help", icon: HelpCircle, label: "Help & Support", badge: null },
  ]

  const handleNavigation = (href: string) => {
    setIsOpen(false)
    // Navigation will be handled by Link component
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 flex-shrink-0 bg-white border-b">
          <SheetTitle className="text-left">Tablesalt AI</SheetTitle>
          <p className="text-sm text-gray-500 text-left">Restaurant Intelligence Platform</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Main</h3>
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => handleNavigation(item.href)}>
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge
                        className={`text-xs ${
                          item.badge === "AI"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : item.badge === "New"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          <Separator />

          {/* AI Tools */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">AI Tools</h3>
            <nav className="space-y-1">
              {aiToolsItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => handleNavigation(item.href)}>
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">{item.badge}</Badge>
                    )}
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          <Separator />

          {/* Data & Integrations */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Data & Integrations</h3>
            <nav className="space-y-1">
              {dataItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => handleNavigation(item.href)}>
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge className="bg-gray-50 text-gray-700 border-gray-200 text-xs">{item.badge}</Badge>
                    )}
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          <Separator />

          {/* Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Settings</h3>
            <nav className="space-y-1">
              {settingsItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => handleNavigation(item.href)}>
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge className="bg-gray-50 text-gray-700 border-gray-200 text-xs">{item.badge}</Badge>
                    )}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
