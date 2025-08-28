"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

interface AICustomerInsightsProps {
  restaurantId: string
}

export function AICustomerInsights({ restaurantId }: AICustomerInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Customer Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-gray-900 mb-2">AI Insights</h3>
          <p className="text-xs text-gray-500">Customer insights will be available soon</p>
        </div>
      </CardContent>
    </Card>
  )
}
