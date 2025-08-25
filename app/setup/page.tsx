"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, ChevronRight, Zap, Download, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-provider"

interface SetupProgress {
  restaurant_info: boolean
  integrations: boolean
  data_import: boolean
}

export default function SetupPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [setupProgress, setSetupProgress] = useState<SetupProgress>({
    restaurant_info: false,
    integrations: false,
    data_import: false,
  })
  const [loading, setLoading] = useState(true)

  const setupSteps = [
    {
      id: "connect-integrations",
      key: "integrations",
      title: "Connect Integrations",
      description: "Connect your POS, reviews, and delivery platforms",
      icon: Zap,
      estimatedTime: "5 min",
      flow: "Connect your existing systems to import data automatically",
    },
    {
      id: "import-data",
      key: "data_import",
      title: "AI Data Import",
      description: "Import and analyze your existing data",
      icon: Download,
      estimatedTime: "3 min",
      flow: "AI imports your menu, customers, reviews, and orders",
    },
    {
      id: "restaurant-info",
      key: "restaurant_info",
      title: "Review Restaurant Info",
      description: "Review and edit your restaurant details",
      icon: Eye,
      estimatedTime: "5 min",
      flow: "Verify and edit your restaurant information",
    },
  ]

  useEffect(() => {
    const loadSetupProgress = async () => {
      if (!user) return

      try {
        const response = await fetch("/api/v1/setup/progress")
        if (response.ok) {
          const { data } = await response.json()
          setSetupProgress(data)
        }
      } catch (error) {
        console.error("Failed to load setup progress:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      loadSetupProgress()
    }
  }, [user, authLoading])

  const handleStepClick = (stepIndex: number) => {
    const step = setupSteps[stepIndex]
    router.push(`/setup/${step.id}`)
  }

  const completedStepsCount = Object.values(setupProgress).filter(Boolean).length
  const overallProgress = Math.round((completedStepsCount / setupSteps.length) * 100)
  const isSetupComplete = completedStepsCount === setupSteps.length

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Restaurant Setup</h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-tight">
              Connect your systems and import your data automatically
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Setup Progress</CardTitle>
              <span className="text-xl sm:text-2xl font-bold text-blue-600">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2 sm:h-3" />
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {completedStepsCount} of {setupSteps.length} steps completed • Est. 13 minutes total
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-3 sm:space-y-4">
          {setupSteps.map((step, index) => {
            const isCompleted = setupProgress[step.key as keyof SetupProgress]

            return (
              <Card
                key={step.id}
                className={`transition-all cursor-pointer ${
                  isCompleted ? "bg-green-50 border-green-200" : "hover:shadow-md"
                }`}
                onClick={() => handleStepClick(index)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div
                      className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-sm sm:text-base flex-shrink-0 ${
                        isCompleted ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">{step.title}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{step.description}</p>
                        </div>
                      </div>

                      <p className="text-blue-600 text-xs font-medium mb-3 leading-relaxed">{step.flow}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-500">Est. {step.estimatedTime}</span>
                        <Button
                          variant={isCompleted ? "outline" : "default"}
                          size="sm"
                          className="flex items-center space-x-1 text-xs sm:text-sm"
                        >
                          <span>{isCompleted ? "Review" : "Start"}</span>
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {isSetupComplete && (
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg text-green-900 mb-2">Setup Complete!</h3>
              <p className="text-sm text-green-700 mb-4">
                Your restaurant is now connected and ready. View your profile to manage all imported data.
              </p>
              <Button onClick={() => router.push("/restaurant-profile")} className="bg-green-600 hover:bg-green-700">
                Go to Restaurant Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
