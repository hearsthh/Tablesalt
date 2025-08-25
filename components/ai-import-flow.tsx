"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  CheckCircle,
  Clock,
  Loader2,
  Database,
  Users,
  Star,
  ShoppingCart,
  Store,
  Mail,
  Share2,
  ArrowRight,
  Zap,
} from "lucide-react"

interface ImportData {
  type: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  sources: ImportSource[]
  status: "pending" | "importing" | "completed" | "conflict" | "error"
  progress: number
  itemCount?: number
  confidence?: number
}

interface ImportSource {
  id: string
  name: string
  logo?: string
  itemCount: number
  confidence: number
  lastUpdated: string
  selected?: boolean
}

interface AIImportFlowProps {
  selectedIntegrations: string[]
  onImportComplete: (importedData: any) => void
  onBack: () => void
}

const dataTypeConfig = {
  restaurantInfo: {
    label: "Restaurant Info",
    icon: Store,
    description: "Business details, hours, contact info",
  },
  menu: {
    label: "Menu Items",
    icon: ShoppingCart,
    description: "Menu items, prices, categories",
  },
  customers: {
    label: "Customer Data",
    icon: Users,
    description: "Customer profiles and preferences",
  },
  reviews: {
    label: "Reviews",
    icon: Star,
    description: "Customer feedback and ratings",
  },
  orders: {
    label: "Order History",
    icon: Database,
    description: "Transaction history and analytics",
  },
  marketing: {
    label: "Marketing Data",
    icon: Mail,
    description: "Campaigns and customer engagement",
  },
  social: {
    label: "Social Media",
    icon: Share2,
    description: "Social posts and engagement metrics",
  },
}

export function AIImportFlow({ selectedIntegrations, onImportComplete, onBack }: AIImportFlowProps) {
  const [importData, setImportData] = useState<ImportData[]>([])
  const [currentStep, setCurrentStep] = useState<"connecting" | "importing" | "conflicts" | "completed">("connecting")
  const [overallProgress, setOverallProgress] = useState(0)
  const [conflictResolutions, setConflictResolutions] = useState<Record<string, string>>({})

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const initializeAndStartImport = async () => {
      console.log("[v0] Starting AI import flow")

      // Initialize mock data
      const mockImportData: ImportData[] = [
        {
          type: "restaurantInfo",
          label: dataTypeConfig.restaurantInfo.label,
          icon: dataTypeConfig.restaurantInfo.icon,
          sources: [
            {
              id: "google-business",
              name: "Google My Business",
              itemCount: 1,
              confidence: 95,
              lastUpdated: "2024-01-15",
            },
          ],
          status: "pending",
          progress: 0,
        },
        {
          type: "menu",
          label: dataTypeConfig.menu.label,
          icon: dataTypeConfig.menu.icon,
          sources: [
            {
              id: "square-pos",
              name: "Square POS",
              itemCount: 247,
              confidence: 98,
              lastUpdated: "2024-01-15",
            },
          ],
          status: "pending",
          progress: 0,
        },
        {
          type: "customers",
          label: dataTypeConfig.customers.label,
          icon: dataTypeConfig.customers.icon,
          sources: [
            {
              id: "square-pos",
              name: "Square POS",
              itemCount: 1247,
              confidence: 92,
              lastUpdated: "2024-01-15",
            },
          ],
          status: "pending",
          progress: 0,
        },
        {
          type: "reviews",
          label: dataTypeConfig.reviews.label,
          icon: dataTypeConfig.reviews.icon,
          sources: [
            {
              id: "google-reviews",
              name: "Google Reviews",
              itemCount: 342,
              confidence: 96,
              lastUpdated: "2024-01-14",
            },
          ],
          status: "pending",
          progress: 0,
        },
      ]

      setImportData(mockImportData)

      // Start importing after connection phase
      timeoutId = setTimeout(() => {
        setCurrentStep("importing")
        startImportProcess(mockImportData)
      }, 2000)
    }

    initializeAndStartImport()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, []) // Empty dependency array - runs once on mount only

  const startImportProcess = async (data: ImportData[]) => {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]

      // Start importing
      setImportData((prev) => prev.map((d) => (d.type === item.type ? { ...d, status: "importing" } : d)))

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setImportData((prev) =>
          prev.map((d) =>
            d.type === item.type
              ? {
                  ...d,
                  progress,
                  itemCount: progress === 100 ? item.sources[0].itemCount : undefined,
                  confidence: progress === 100 ? item.sources[0].confidence : undefined,
                }
              : d,
          ),
        )
      }

      // Mark as completed
      setImportData((prev) => prev.map((d) => (d.type === item.type ? { ...d, status: "completed" } : d)))
      setOverallProgress(((i + 1) / data.length) * 100)
    }

    setCurrentStep("completed")
  }

  const handleConflictResolution = (dataType: string, sourceId: string) => {
    setConflictResolutions((prev) => ({
      ...prev,
      [dataType]: sourceId,
    }))
  }

  const resolveConflicts = async () => {
    const conflictItems = importData.filter((item) => item.status === "conflict")

    for (const item of conflictItems) {
      const selectedSourceId = conflictResolutions[item.type]
      const selectedSource = item.sources.find((s) => s.id === selectedSourceId)

      if (selectedSource) {
        // Start importing from selected source
        setImportData((prev) =>
          prev.map((d) => (d.type === item.type ? { ...d, status: "importing", progress: 0 } : d)),
        )

        // Simulate import progress
        for (let progress = 0; progress <= 100; progress += 25) {
          await new Promise((resolve) => setTimeout(resolve, 200))
          setImportData((prev) =>
            prev.map((d) =>
              d.type === item.type
                ? {
                    ...d,
                    progress,
                    itemCount: progress === 100 ? selectedSource.itemCount : undefined,
                    confidence: progress === 100 ? selectedSource.confidence : undefined,
                  }
                : d,
            ),
          )
        }

        setImportData((prev) => prev.map((d) => (d.type === item.type ? { ...d, status: "completed" } : d)))
      }
    }

    setCurrentStep("completed")
  }

  const renderImportItem = (item: ImportData) => {
    const Icon = item.icon

    return (
      <Card key={item.type} className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-semibold">{item.label}</CardTitle>
              <CardDescription className="text-xs">
                {dataTypeConfig[item.type as keyof typeof dataTypeConfig]?.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {item.status === "completed" && <CheckCircle className="w-4 h-4 text-green-600" />}
              {item.status === "importing" && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
              {item.status === "pending" && <Clock className="w-4 h-4 text-gray-400" />}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {item.status === "importing" && (
            <div className="space-y-2">
              <Progress value={item.progress} className="h-2" />
              <p className="text-xs text-gray-600">Importing from {item.sources[0]?.name}...</p>
            </div>
          )}

          {item.status === "completed" && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-600 font-medium">{item.itemCount} items imported</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {item.confidence}% confidence
              </Badge>
            </div>
          )}

          {item.status === "conflict" && (
            <div className="space-y-3">
              <p className="text-xs text-orange-600 font-medium">
                Multiple sources found. Choose your preferred source:
              </p>
              <RadioGroup
                value={conflictResolutions[item.type] || ""}
                onValueChange={(value) => handleConflictResolution(item.type, value)}
              >
                {item.sources.map((source) => (
                  <div key={source.id} className="flex items-center space-x-2 p-2 rounded-lg border">
                    <RadioGroupItem value={source.id} id={`${item.type}-${source.id}`} />
                    <Label htmlFor={`${item.type}-${source.id}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium">{source.name}</p>
                          <p className="text-xs text-gray-600">
                            {source.itemCount} items • Updated {source.lastUpdated}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {source.confidence}%
                        </Badge>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "connecting") {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Connecting to Your Systems</CardTitle>
            <CardDescription>Establishing secure connections to your selected integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm">Preparing connections...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">AI Data Import</CardTitle>
              <CardDescription>
                {currentStep === "importing" && "Importing and analyzing your data"}
                {currentStep === "completed" && "Import completed successfully"}
              </CardDescription>
            </div>
            {currentStep !== "completed" && (
              <Button variant="outline" size="sm" onClick={onBack}>
                Back
              </Button>
            )}
          </div>
          {currentStep === "importing" && (
            <div className="mt-3">
              <Progress value={overallProgress} className="h-2" />
              <p className="text-xs text-gray-600 mt-1">{Math.round(overallProgress)}% complete</p>
            </div>
          )}
        </CardHeader>
      </Card>

      <div className="space-y-3">{importData.map(renderImportItem)}</div>

      {currentStep === "conflicts" && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-semibold text-orange-900 text-sm">Resolve Conflicts</h4>
                <p className="text-xs text-orange-700">Select preferred sources for duplicate data</p>
              </div>
              <Button
                size="sm"
                onClick={resolveConflicts}
                disabled={Object.keys(conflictResolutions).length === 0}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Continue Import
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "completed" && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-semibold text-green-900 text-sm">Import Complete</h4>
                <p className="text-xs text-green-700">
                  {importData.reduce((sum, item) => sum + (item.itemCount || 0), 0)} items imported
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => onImportComplete(importData)}
                className="bg-green-600 hover:bg-green-700"
              >
                <ArrowRight className="w-4 h-4 mr-1" />
                Review Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
