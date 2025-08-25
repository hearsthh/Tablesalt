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
  ChevronRight,
  Store,
  ChefHat,
  Star,
  Users,
  Megaphone,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react"
import Link from "next/link"

interface SetupArea {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  fieldsCompleted: number
  totalFields: number
  status: "not-started" | "in-progress" | "complete"
  description: string
}

export function SetupIntegrationsCard() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Mock data for setup areas
  const setupAreas: SetupArea[] = [
    {
      id: "profile",
      title: "Restaurant Profile",
      icon: Store,
      fieldsCompleted: 7,
      totalFields: 9,
      status: "in-progress",
      description: "Basic restaurant information and details",
    },
    {
      id: "menu",
      title: "Menu & Items",
      icon: ChefHat,
      fieldsCompleted: 4,
      totalFields: 6,
      status: "in-progress",
      description: "Menu categories, items, and pricing",
    },
    {
      id: "reviews",
      title: "Reviews & Insights",
      icon: Star,
      fieldsCompleted: 6,
      totalFields: 6,
      status: "complete",
      description: "Review management and customer feedback",
    },
    {
      id: "customers",
      title: "Customer Data",
      icon: Users,
      fieldsCompleted: 2,
      totalFields: 6,
      status: "in-progress",
      description: "Customer profiles and loyalty programs",
    },
    {
      id: "campaigns",
      title: "Marketing Campaigns",
      icon: Megaphone,
      fieldsCompleted: 0,
      totalFields: 6,
      status: "not-started",
      description: "Marketing goals and promotional strategies",
    },
  ]

  // Calculate overall progress
  const totalFieldsAll = setupAreas.reduce((sum, area) => sum + area.totalFields, 0)
  const completedFieldsAll = setupAreas.reduce((sum, area) => sum + area.fieldsCompleted, 0)
  const overallProgress = Math.round((completedFieldsAll / totalFieldsAll) * 100)

  const getStatusBadge = (status: SetupArea["status"]) => {
    switch (status) {
      case "complete":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "not-started":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Not Started
          </Badge>
        )
    }
  }

  return (
    <>
      {/* Main Dashboard Card */}
      <Card className="ai-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-black rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Setup & Integrations</h3>
                <p className="text-xs text-gray-600">
                  {completedFieldsAll} of {totalFieldsAll} fields completed • {overallProgress}%
                </p>
              </div>
            </div>
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button size="sm" className="h-8 px-3 text-xs bg-black text-white hover:bg-gray-800">
                  View Details
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] p-0">
                <div className="flex flex-col h-full">
                  <SheetHeader className="p-4 border-b bg-white">
                    <SheetTitle className="text-left">Setup & Integrations</SheetTitle>
                  </SheetHeader>

                  {/* Overall Progress Block */}
                  <div className="p-4 bg-white border-b">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {completedFieldsAll} of {totalFieldsAll} fields completed
                        </p>
                        <span className="text-sm font-bold">{overallProgress}%</span>
                      </div>
                      <Progress value={overallProgress} className="h-2 bg-gray-200" />
                    </div>
                  </div>

                  {/* Scrollable Setup Areas */}
                  <div className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-4 space-y-3">
                      {setupAreas.map((area) => {
                        const IconComponent = area.icon
                        const completionPercentage = Math.round((area.fieldsCompleted / area.totalFields) * 100)

                        return (
                          <Link key={area.id} href={`/setup/${area.id}`} onClick={() => setDrawerOpen(false)}>
                            <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 flex-1">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                      <IconComponent className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-sm">{area.title}</h4>
                                      <p className="text-xs text-gray-600 truncate">{area.description}</p>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-xs text-gray-500">
                                          {area.fieldsCompleted}/{area.totalFields} fields completed
                                        </span>
                                        {getStatusBadge(area.status)}
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        )
                      })}
                    </div>
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
