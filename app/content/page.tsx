import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Plus, Edit, Eye } from "lucide-react"
import Link from "next/link"

export default function ContentPage() {
  const contentItems = [
    {
      id: 1,
      title: "Weekend Special Promotion",
      type: "Social Media Post",
      status: "draft",
      platform: "Instagram",
      scheduledFor: "Tomorrow 6 PM",
    },
    {
      id: 2,
      title: "New Menu Launch Announcement",
      type: "Email Newsletter",
      status: "scheduled",
      platform: "Email",
      scheduledFor: "Friday 10 AM",
    },
    {
      id: 3,
      title: "Customer Review Highlight",
      type: "Social Media Story",
      status: "published",
      platform: "Facebook",
      scheduledFor: "Published 2 hours ago",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Content Management</h1>
      <p className="text-gray-600">Content management features coming soon...</p>
      <header className="bg-white border-b border-gray-200 px-4 py-4 mt-8">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <h1 className="text-xl font-bold">Content</h1>
            </div>
          </div>
          <Button className="bg-black text-white hover:bg-gray-800">
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 mt-8">
        <div className="space-y-4">
          {contentItems.map((item) => (
            <Card key={item.id} className="ai-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      <Badge
                        variant={
                          item.status === "published"
                            ? "default"
                            : item.status === "scheduled"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {item.type} • {item.platform}
                    </p>
                    <p className="text-xs text-gray-500">{item.scheduledFor}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
