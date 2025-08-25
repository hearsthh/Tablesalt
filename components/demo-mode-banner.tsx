"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Info, Sparkles, Database, Zap } from "lucide-react"

export function DemoModeBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Card className="border-blue-200 bg-blue-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-blue-900 text-sm">Demo Mode Active</h3>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">Fully Functional</Badge>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                You're experiencing Tablesalt AI with realistic mock data and fully functional AI features. All
                interactions work as they would in production.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Database className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-700">Mock restaurant data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-700">AI features active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-700">Real-time interactions</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="p-1 h-6 w-6 text-blue-600 hover:bg-blue-100 flex-shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
