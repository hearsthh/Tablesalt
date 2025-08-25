"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Play } from "lucide-react"

const REQUIRED_SCRIPTS = [
  {
    id: "schema",
    name: "create-production-database-schema.sql",
    description: "Creates all database tables and relationships",
    required: true,
    order: 1,
  },
  {
    id: "data",
    name: "seed-sample-production-data.sql",
    description: "Adds sample restaurant data for testing",
    required: true,
    order: 2,
  },
  {
    id: "test",
    name: "test-supabase-connection.js",
    description: "Verifies database connection is working",
    required: false,
    order: 3,
  },
]

export function DatabaseSetupGuide() {
  const [completedScripts, setCompletedScripts] = useState<string[]>([])

  const markCompleted = (scriptId: string) => {
    setCompletedScripts((prev) => [...prev, scriptId])
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Database Setup Guide</CardTitle>
        <CardDescription>Run these scripts in order to set up your Supabase database</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {REQUIRED_SCRIPTS.map((script) => {
          const isCompleted = completedScripts.includes(script.id)
          const canRun = script.order === 1 || completedScripts.includes(REQUIRED_SCRIPTS[script.order - 2]?.id)

          return (
            <div key={script.id} className="flex items-center gap-3 p-3 border rounded-lg">
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}

              <div className="flex-1">
                <div className="font-medium">
                  {script.order}. {script.name}
                </div>
                <div className="text-sm text-muted-foreground">{script.description}</div>
                {script.required && <div className="text-xs text-blue-600 font-medium">Required</div>}
              </div>

              <Button
                size="sm"
                variant={isCompleted ? "secondary" : "default"}
                disabled={!canRun || isCompleted}
                onClick={() => markCompleted(script.id)}
              >
                {isCompleted ? (
                  "Completed"
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" /> Run Script
                  </>
                )}
              </Button>
            </div>
          )
        })}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Click on each script name in the v0 interface sidebar</li>
            <li>2. Wait for the script to complete successfully</li>
            <li>3. Mark it as completed here to track your progress</li>
            <li>4. Run scripts in the exact order shown above</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
