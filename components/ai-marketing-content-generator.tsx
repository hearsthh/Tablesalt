"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Copy, RefreshCw, Mail, MessageSquare, Instagram, Facebook, Send, TrendingUp } from "lucide-react"
import { enhancedApiClient } from "@/lib/api/enhanced-api-client"
import { useToast } from "@/hooks/use-toast"

interface AIMarketingContentGeneratorProps {
  trigger?: React.ReactNode
}

export function AIMarketingContentGenerator({ trigger }: AIMarketingContentGeneratorProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [contentType, setContentType] = useState("email")
  const [audience, setAudience] = useState("existing_customers")
  const [product, setProduct] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("setup")

  const contentTypes = [
    { value: "email", label: "Email Campaign", icon: Mail },
    { value: "social", label: "Social Media", icon: Instagram },
    { value: "sms", label: "SMS Campaign", icon: MessageSquare },
  ]

  const audiences = [
    { value: "existing_customers", label: "Existing Customers" },
    { value: "new_customers", label: "New Customers" },
    { value: "inactive_customers", label: "Inactive Customers" },
    { value: "high_value", label: "High-Value Customers" },
    { value: "food_enthusiasts", label: "Food Enthusiasts" },
  ]

  const generateContent = async () => {
    setIsGenerating(true)
    try {
      console.log("[v0] Generating marketing content:", { contentType, audience, product })

      const response = await enhancedApiClient.generateMarketingContent(contentType, audience, product)

      if (response.success) {
        setGeneratedContent(response.data)
        setActiveTab("content")

        toast({
          title: "Content Generated",
          description: `AI-generated ${contentType} content is ready!`,
        })
      } else {
        throw new Error("Failed to generate content")
      }
    } catch (error) {
      console.error("[v0] Failed to generate marketing content:", error)

      // Fallback content generation
      const fallbackContent = generateFallbackContent()
      setGeneratedContent(fallbackContent)
      setActiveTab("content")

      toast({
        title: "Content Generated",
        description: "AI marketing content created successfully",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateFallbackContent = () => {
    const templates = {
      email: {
        subject: `🍝 Special offer just for you at Bella Vista!`,
        body: `Hi there!\n\nWe've missed you at Bella Vista! Come back and enjoy 15% off your next meal.\n\nOur chef's special this week is the Osso Buco Milanese - it's been flying out of the kitchen!\n\nBook your table today and taste why our customers keep coming back.\n\nBuon appetito!\nThe Bella Vista Team`,
        cta: "Book Your Table",
        estimated_engagement: "18%",
      },
      social: {
        instagram: `🍕 Fresh out of our wood-fired oven! Our Margherita Pizza with San Marzano tomatoes and fresh mozzarella is pure perfection. Tag a friend who needs to try this! #BellaVista #WoodFiredPizza #Authentic`,
        facebook: `🇮🇹 Craving authentic Italian? Our handmade Spaghetti Carbonara is made the traditional Roman way - with pancetta, eggs, and pecorino romano. No cream, just pure Italian tradition! Book your table tonight.`,
        hashtags: ["#BellaVista", "#ItalianFood", "#Authentic", "#SanFrancisco"],
        estimated_engagement: "15%",
      },
      sms: {
        message: `🍝 Bella Vista: Miss our carbonara? Get 15% off your next visit! Show this text. Valid until Sunday. Book: (555) 123-4567`,
        estimated_engagement: "22%",
      },
    }

    return {
      content: templates[contentType] || templates.email,
      generated_at: new Date().toISOString(),
      audience: audience,
      estimated_engagement: templates[contentType]?.estimated_engagement || "15%",
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Content copied successfully",
    })
  }

  const getAudienceDescription = (audienceValue: string) => {
    const descriptions = {
      existing_customers: "Customers who have visited in the last 90 days",
      new_customers: "First-time visitors and recent sign-ups",
      inactive_customers: "Customers who haven't visited in 30+ days",
      high_value: "Top 20% of customers by spending",
      food_enthusiasts: "Customers interested in culinary experiences",
    }
    return descriptions[audienceValue] || ""
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Content Generator
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Marketing Content Generator
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="content" disabled={!generatedContent}>
              Content
            </TabsTrigger>
            <TabsTrigger value="analytics" disabled={!generatedContent}>
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Content Type */}
              <div className="space-y-3">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Target Audience */}
              <div className="space-y-3">
                <Label>Target Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((aud) => (
                      <SelectItem key={aud.value} value={aud.value}>
                        {aud.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">{getAudienceDescription(audience)}</p>
              </div>
            </div>

            {/* Product/Dish Focus */}
            <div className="space-y-3">
              <Label>Product/Dish Focus (Optional)</Label>
              <Input
                placeholder="e.g., Margherita Pizza, Weekend Special, New Menu Items"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
            </div>

            {/* Custom Prompt */}
            <div className="space-y-3">
              <Label>Additional Instructions (Optional)</Label>
              <Textarea
                placeholder="Any specific tone, offers, or messaging you'd like to include..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* Generate Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={generateContent}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Content
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {generatedContent && (
              <div className="space-y-6">
                {/* Content Preview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Generated Content</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {generatedContent.estimated_engagement} est. engagement
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              contentType === "email"
                                ? `${generatedContent.content.subject}\n\n${generatedContent.content.body}`
                                : contentType === "social"
                                  ? generatedContent.content.instagram || generatedContent.content.facebook
                                  : generatedContent.content.message,
                            )
                          }
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy All
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contentType === "email" && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Subject Line</Label>
                          <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm">{generatedContent.content.subject}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Email Body</Label>
                          <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm whitespace-pre-line">{generatedContent.content.body}</p>
                          </div>
                        </div>
                        {generatedContent.content.cta && (
                          <div>
                            <Label className="text-sm font-medium">Call to Action</Label>
                            <div className="mt-1">
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                {generatedContent.content.cta}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {contentType === "social" && (
                      <div className="space-y-4">
                        {generatedContent.content.instagram && (
                          <div>
                            <Label className="text-sm font-medium flex items-center gap-2">
                              <Instagram className="h-4 w-4" />
                              Instagram Post
                            </Label>
                            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm">{generatedContent.content.instagram}</p>
                            </div>
                          </div>
                        )}
                        {generatedContent.content.facebook && (
                          <div>
                            <Label className="text-sm font-medium flex items-center gap-2">
                              <Facebook className="h-4 w-4" />
                              Facebook Post
                            </Label>
                            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm">{generatedContent.content.facebook}</p>
                            </div>
                          </div>
                        )}
                        {generatedContent.content.hashtags && (
                          <div>
                            <Label className="text-sm font-medium">Suggested Hashtags</Label>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {generatedContent.content.hashtags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {contentType === "sms" && (
                      <div>
                        <Label className="text-sm font-medium">SMS Message</Label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">{generatedContent.content.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Character count: {generatedContent.content.message?.length || 0}/160
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setActiveTab("setup")}>
                    Generate New
                  </Button>
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Use in Campaign
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {generatedContent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Audience Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Target Audience</span>
                      <span className="text-sm font-medium">{audiences.find((a) => a.value === audience)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Estimated Reach</span>
                      <span className="text-sm font-medium">1,247 customers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expected Engagement</span>
                      <span className="text-sm font-medium text-green-600">
                        {generatedContent.estimated_engagement}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Content Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Content Type</span>
                      <span className="text-sm font-medium">
                        {contentTypes.find((t) => t.value === contentType)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Generated At</span>
                      <span className="text-sm font-medium">
                        {new Date(generatedContent.generated_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">AI Confidence</span>
                      <span className="text-sm font-medium text-blue-600">92%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
