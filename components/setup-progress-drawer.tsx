"use client"

import type React from "react"
import { useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, Clock, ArrowRight } from "lucide-react"
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
  integrations: string[]
  lastUpdated?: string
}

interface SetupProgressDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sections: SetupSection[]
  onSectionClick: (sectionId: string) => void
}

export function SetupProgressDrawer({ open, onOpenChange, sections, onSectionClick }: SetupProgressDrawerProps) {
  // Memoize calculations to prevent recalculation on every render
  const { overallProgress, completedSections, totalSections } = useMemo(() => {
    const progress = Math.round(sections.reduce((acc, section) => acc + section.progress, 0) / sections.length)
    const completed = sections.filter((section) => section.status === "complete").length
    const total = sections.length

    return {
      overallProgress: progress,
      completedSections: completed,
      totalSections: total,
    }
  }, [sections])

  const handleSectionClick = (sectionId: string) => {
    onOpenChange(false)
    onSectionClick(sectionId)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b bg-white">
            <SheetTitle className="text-base">Setup Progress Overview</SheetTitle>
          </SheetHeader>

          {/* Overall Progress */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-sm">Overall Progress</h3>
                <Badge variant={overallProgress === 100 ? "default" : "secondary"} className="text-xs">
                  {completedSections}/{totalSections} Complete
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span className="font-medium">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-1.5" />
              </div>
            </div>
          </div>

          {/* Sections List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {sections.map((section) => {
                const IconComponent = section.icon
                return (
                  <Card
                    key={section.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSectionClick(section.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-4 w-4" />
                          <div>
                            <h4 className="font-medium text-sm">{section.title}</h4>
                            <p className="text-xs text-gray-600 line-clamp-1">{section.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {section.fieldsCompleted}/{section.totalFields} fields
                              </span>
                              {section.integrations.length > 0 && (
                                <span className="text-xs text-gray-500">
                                  • {section.integrations.length} integrations
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {section.status === "complete" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : section.status === "in-progress" ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                          <div className="text-right">
                            <p className="text-xs font-medium">{section.progress}%</p>
                            <Progress value={section.progress} className="w-12 h-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 bg-white border-t">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-9 text-sm">
                Close
              </Button>
              <Link href="/setup" className="flex-1">
                <Button className="w-full h-9 text-sm bg-black text-white hover:bg-gray-800">
                  Go to Full Setup
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
