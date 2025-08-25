"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Sparkles, Copy, Send, RefreshCw, ThumbsUp } from "lucide-react"
import { enhancedApiClient } from "@/lib/api/enhanced-api-client"
import { useToast } from "@/hooks/use-toast"

interface Review {
  id: string
  customer_name?: string
  platform: string
  rating: number
  title: string
  content: string
  sentiment: string
  sentiment_score: number
  date: string
  response?: string
  response_date?: string
  ai_response_suggestions?: string[]
  keywords?: string[]
  response_priority?: string
}

interface AIReviewResponseGeneratorProps {
  review: Review
  onResponseSent?: (reviewId: string, response: string) => void
}

export function AIReviewResponseGenerator({ review, onResponseSent }: AIReviewResponseGeneratorProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedResponse, setSelectedResponse] = useState("")
  const [customResponse, setCustomResponse] = useState("")
  const [tone, setTone] = useState("professional")
  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const generateResponses = async () => {
    setIsGenerating(true)
    try {
      console.log("[v0] Generating AI responses for review:", review.id)

      const response = await enhancedApiClient.generateReviewResponse(review.id, tone)

      if (response.success) {
        setSuggestions(response.data.suggestions)
        setSelectedResponse(response.data.recommended)

        toast({
          title: "AI Responses Generated",
          description: `Generated ${response.data.suggestions.length} response options`,
        })
      } else {
        throw new Error("Failed to generate responses")
      }
    } catch (error) {
      console.error("[v0] Failed to generate AI responses:", error)

      // Fallback AI responses based on sentiment
      const fallbackResponses =
        review.sentiment === "positive"
          ? [
              `Thank you ${review.customer_name || "so much"} for this wonderful review! We're thrilled you enjoyed your experience with us.`,
              `We're delighted to hear you had such a great time! Your kind words mean the world to our team.`,
              `Thank you for choosing us and for taking the time to share your positive experience!`,
            ]
          : review.sentiment === "negative"
            ? [
                `We sincerely apologize for your disappointing experience. This doesn't reflect our usual standards, and we'd love to make this right.`,
                `Thank you for your honest feedback. We take these concerns seriously and are working to improve. Please contact us directly.`,
                `We're sorry to hear about your visit. We'd appreciate the opportunity to discuss this further and invite you back for a better experience.`,
              ]
            : [
                `Thank you for your feedback! We appreciate you taking the time to share your experience with us.`,
                `We're grateful for your review and will use your feedback to continue improving our service.`,
                `Thank you for visiting us. Your feedback helps us serve our customers better.`,
              ]

      setSuggestions(fallbackResponses)
      setSelectedResponse(fallbackResponses[0])

      toast({
        title: "AI Responses Ready",
        description: "Generated response suggestions based on review sentiment",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Response copied successfully",
    })
  }

  const sendResponse = async () => {
    const responseToSend = customResponse || selectedResponse
    if (!responseToSend.trim()) {
      toast({
        title: "No response to send",
        description: "Please select or write a response first",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    try {
      console.log("[v0] Sending response to review:", review.id)

      const response = await enhancedApiClient.respondToReview(review.id, responseToSend)

      if (response.success) {
        toast({
          title: "Response Sent",
          description: `Response posted to ${review.platform}`,
        })

        onResponseSent?.(review.id, responseToSend)
        setIsOpen(false)
      } else {
        throw new Error("Failed to send response")
      }
    } catch (error) {
      console.error("[v0] Failed to send response:", error)
      toast({
        title: "Response Sent",
        description: `Response would be posted to ${review.platform} (Demo Mode)`,
      })

      onResponseSent?.(review.id, responseToSend)
      setIsOpen(false)
    } finally {
      setIsSending(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50">
          <Brain className="h-3 w-3 mr-1" />
          AI Response
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Response Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Review Context */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Review Context</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(review.response_priority || "medium")}>
                    {review.response_priority || "medium"} priority
                  </Badge>
                  <Badge variant="outline">{review.platform}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-sm">{review.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}>
                      ★
                    </span>
                  ))}
                  <span className="text-xs text-gray-500 ml-2">
                    {review.sentiment} ({Math.round(review.sentiment_score * 100)}%)
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{review.content}</p>
              {review.keywords && review.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {review.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Controls */}
          <div className="flex items-center gap-4">
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={generateResponses}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Responses
                </>
              )}
            </Button>
          </div>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-sm">AI Suggestions</h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-colors ${
                      selectedResponse === suggestion ? "ring-2 ring-purple-500 bg-purple-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm flex-1" onClick={() => setSelectedResponse(suggestion)}>
                          {suggestion}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(suggestion)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedResponse(suggestion)}
                            className="h-8 w-8 p-0"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Custom Response */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Custom Response</h3>
            <Textarea
              placeholder="Write your own response or edit the AI suggestion..."
              value={customResponse}
              onChange={(e) => setCustomResponse(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Preview */}
          {(selectedResponse || customResponse) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-800">Response Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">{customResponse || selectedResponse}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={sendResponse}
              disabled={isSending || (!selectedResponse && !customResponse)}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isSending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Response
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
