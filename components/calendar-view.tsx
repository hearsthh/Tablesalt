"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

interface CalendarViewProps {
  activities?: any[]
}

export function CalendarView({ activities = [] }: CalendarViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Activity Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-gray-900 mb-2">Calendar View</h3>
          <p className="text-xs text-gray-500">Activity calendar will be available soon</p>
        </div>
      </CardContent>
    </Card>
  )
}
