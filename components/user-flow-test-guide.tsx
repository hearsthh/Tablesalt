"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, ArrowRight } from "lucide-react"

interface TestStep {
  id: string
  title: string
  description: string
  page: string
  actions: string[]
  completed: boolean
}

export function UserFlowTestGuide() {
  const [currentStep, setCurrentStep] = useState(0)
  const [testSteps, setTestSteps] = useState<TestStep[]>([
    {
      id: "landing",
      title: "Landing Page Experience",
      description: "Test the marketing site and initial impression",
      page: "/",
      actions: [
        "View hero section and value proposition",
        "Explore 6 feature cards (Menu, Reviews, Customer Intelligence, Analytics, Marketing, AI Insights)",
        "Click 'Start Free Trial' or 'Get Started' button",
      ],
      completed: false,
    },
    {
      id: "signup",
      title: "User Registration",
      description: "Create a new restaurant account",
      page: "/signup",
      actions: [
        "Fill in restaurant owner name",
        "Enter email address",
        "Set restaurant name",
        "Create secure password",
        "Complete registration and verify form validation",
      ],
      completed: false,
    },
    {
      id: "dashboard",
      title: "Dashboard Overview",
      description: "Explore the main command center",
      page: "/dashboard",
      actions: [
        "View revenue, customers, activities, and rating metrics",
        "Check AI insights panel with smart recommendations",
        "Explore 6 main module cards with status badges",
        "Review recent activity feed",
        "Check setup progress tracker",
      ],
      completed: false,
    },
    {
      id: "menu",
      title: "Menu Management",
      description: "Test comprehensive menu engineering features",
      page: "/menu",
      actions: [
        "Add new menu categories",
        "Create menu items with images, pricing, and details",
        "Use AI optimization tools (combos, tags, descriptions, pricing)",
        "Test drag-and-drop reordering",
        "Try bulk operations and search/filtering",
      ],
      completed: false,
    },
    {
      id: "customers",
      title: "Customer Management",
      description: "Manage customer relationships and communications",
      page: "/customers",
      actions: [
        "Browse customer database",
        "View customer profiles and order history",
        "Test communication panel (email/SMS)",
        "Try customer segmentation features",
        "Review customer analytics",
      ],
      completed: false,
    },
    {
      id: "reviews",
      title: "Review Intelligence",
      description: "Monitor and manage customer reviews",
      page: "/reviews",
      actions: [
        "View aggregated reviews from multiple platforms",
        "Test AI sentiment analysis",
        "Try automated response suggestions",
        "Use review filtering and search",
        "Check performance metrics",
      ],
      completed: false,
    },
    {
      id: "marketing",
      title: "Marketing Campaigns",
      description: "Create and manage marketing campaigns",
      page: "/marketing",
      actions: [
        "Create new marketing campaign",
        "Use AI-generated content suggestions",
        "Set up multi-channel campaigns (email, SMS, social)",
        "Review campaign performance analytics",
        "Test ROI tracking features",
      ],
      completed: false,
    },
  ])

  const markStepCompleted = (stepIndex: number) => {
    const updatedSteps = [...testSteps]
    updatedSteps[stepIndex].completed = true
    setTestSteps(updatedSteps)
    if (stepIndex < testSteps.length - 1) {
      setCurrentStep(stepIndex + 1)
    }
  }

  const completedSteps = testSteps.filter((step) => step.completed).length
  const progressPercentage = (completedSteps / testSteps.length) * 100

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Complete User Flow Test Guide</span>
          <Badge variant="outline">
            {completedSteps}/{testSteps.length} Complete
          </Badge>
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {testSteps.map((step, index) => (
          <Card key={step.id} className={`border-2 ${index === currentStep ? "border-blue-500" : "border-gray-200"}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {step.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                <Badge variant={step.completed ? "default" : "secondary"}>{step.page}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium text-sm">Test Actions:</p>
                <ul className="space-y-1">
                  {step.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-start space-x-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
                {!step.completed && index === currentStep && (
                  <Button onClick={() => markStepCompleted(index)} className="mt-3" size="sm">
                    Mark as Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {completedSteps === testSteps.length && (
          <Card className="border-green-500 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Complete User Flow Test Finished!</h3>
                <p className="text-green-700">
                  You've successfully tested all core features of the Tablesalt AI restaurant management system. The app
                  is ready for production deployment with comprehensive functionality.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
