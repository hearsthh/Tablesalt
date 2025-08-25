"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Activity {
  id: number
  title: string
  channel: string
  type: string
  status: string
  scheduledDate: string
  metrics?: {
    reach: number
    engagement: number
    clicks: number
  }
}

interface CalendarViewProps {
  activities?: Activity[]
}

export function CalendarView({ activities = [] }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState("January")
  const [currentYear, setCurrentYear] = useState("2024")

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const daysInMonth = 31 // Simplified for demo
    const startDay = 1 // Monday start
    const days = []

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getActivitiesForDay = (day: number | null) => {
    if (!day) return []

    return activities.filter((activity) => {
      const activityDate = new Date(activity.scheduledDate)
      return activityDate.getDate() === day
    })
  }

  const calendarDays = generateCalendarDays()

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Activity Calendar</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-900">
              {currentMonth} {currentYear}
            </span>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayActivities = getActivitiesForDay(day)
            return (
              <div key={index} className="min-h-[80px] p-1 border border-gray-100 rounded">
                {day && (
                  <>
                    <div className="text-xs font-medium text-gray-900 mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayActivities.slice(0, 2).map((activity) => (
                        <div key={activity.id} className="text-xs p-1 rounded bg-blue-50 text-blue-700 truncate">
                          {activity.title}
                        </div>
                      ))}
                      {dayActivities.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayActivities.length - 2} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
