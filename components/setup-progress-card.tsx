"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Settings,
  ArrowRight,
  ChevronRight,
  Store,
  ChefHat,
  Star,
  Users,
  Megaphone,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"

interface SetupSection {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  progress: number
  status: "complete" | "in-progress" | "not-started"
  fieldsCompleted: number
  totalFields: number
}

export function SetupProgressCard() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Mock setup sections data
  const setupSections: SetupSection[] = [
    {
      id: "restaurant-info",
      title: "Restaurant Info",
      description: "Basic restaurant details and contact information",
      icon: Store,
      progress: 85,
      status: "in-progress",
      fieldsCompleted: 7,
      totalFields: 8,
    },
    {
      id: "menu-setup",
      title: "Menu Setup",
      description: "Menu categories, items, and pricing",
      icon: ChefHat,
      progress: 60,
      status: "in-progress",
      fieldsCompleted: 12,
      totalFields: 20,
    },
    {
      id: "reviews-setup",
      title: "Reviews Setup",
      description: "Review platforms and response management",
      icon: Star,
      progress: 100,
      status: "complete",
      fieldsCompleted: 5,
      totalFields: 5,
    },
    {
      id: "channel-integrations",
      title: "Channel Integrations",
      description: "Social media and marketing channels",
      icon: Megaphone,
      progress: 40,
      status: "in-progress",
      fieldsCompleted: 4,
      totalFields: 10,
    },
    {
      id: "customer-data",
      title: "CRM/Customer Data",
      description: "Customer profiles and segmentation",
      icon: Users,
      progress: 20,
      status: "in-progress",
      fieldsCompleted: 2,
      totalFields: 10,
    },
    {
      id: "delivery-platforms",
      title: "Delivery Platforms",
      description: "Food delivery service integrations",
      icon: ShoppingCart,
      progress: 0,
      status: "not-started",
      fieldsCompleted: 0,
      totalFields: 6,
    },
    {
      id: "pos-integration",
      title: "POS Integration",
      description: "Point of sale system connection",
      icon: MapPin,
      progress: 75,
      status: "in-progress",
      fieldsCompleted: 3,
      totalFields: 4,
    },
  ]

  // Calculate overall progress
  const totalFields = setupSections.reduce((sum, section) => sum + section.totalFields, 0)
  const completedFields = setupSections.reduce((sum, section) => sum + section.fieldsCompleted, 0)
  const overallProgress = Math.round((completedFields / totalFields) * 100)

  const getStatusIcon = (status: SetupSection["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "not-started":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: SetupSection["status"]) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Complete</Badge>
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">In Progress</Badge>
      case "not-started":
        return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">Not Started</Badge>
    }
  }

  return (
    <>
      {/* Main Progress Card */}
      <Card className="ai-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-black rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Setup Progress</h3>
                <p className="text-xs text-gray-600">
                  {completedFields} of {totalFields} fields completed
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{overallProgress}%</div>
              {overallProgress < 100 && <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>}
            </div>
          </div>

          <Progress value={overallProgress} className="h-2 mb-3" />

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {overallProgress === 100 ? "Setup complete!" : "Continue setup to unlock all features"}
            </span>
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button size="sm" className="h-8 px-3 text-xs bg-black text-white hover:bg-gray-800">
                  View Details
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </SheetTrigger>

              <SheetContent side="bottom" className="h-[85vh] p-0">
                <div className="flex flex-col h-full">
                  <SheetHeader className="p-4 border-b bg-white">
                    <SheetTitle className="text-left flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Setup & Integrations</span>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Overall Progress Block */}
                  <div className="p-4 bg-white border-b">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {completedFields} of {totalFields} fields completed
                        </p>
                        <span className="text-lg font-bold">{overallProgress}%</span>
                      </div>
                      <Progress value={overallProgress} className="h-3 bg-gray-200" />
                      <p className="text-xs text-gray-600">
                        {overallProgress === 100
                          ? "All setup sections completed!"
                          : `${setupSections.filter((s) => s.status === "complete").length} of ${
                              setupSections.length
                            } sections complete`}
                      </p>
                    </div>
                  </div>

                  {/* Scrollable Setup Sections */}
                  <div className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-4 space-y-3">
                      {setupSections.map((section) => {
                        const IconComponent = section.icon
                        return (
                          <Link key={section.id} href={`/setup#${section.id}`} onClick={() => setDrawerOpen(false)}>
                            <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 flex-1">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                      <IconComponent className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <h4 className="font-medium text-sm">{section.title}</h4>
                                        {getStatusBadge(section.status)}
                                      </div>
                                      <p className="text-xs text-gray-600 truncate mb-2">{section.description}</p>
                                      <div className="flex items-center space-x-2">
                                        <Progress value={section.progress} className="h-1 flex-1" />
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                          {section.fieldsCompleted}/{section.totalFields}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(section.status)}
                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  <div className="p-4 bg-white border-t">
                    <Link href="/setup" className="block">
                      <Button
                        className="w-full h-10 bg-black text-white hover:bg-gray-800 text-sm"
                        onClick={() => setDrawerOpen(false)}
                      >
                        Go to Full Setup Page
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
