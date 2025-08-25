"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Send, RefreshCw, Gift, MessageSquare, Mail, Phone, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { logEvent } from "@/lib/analytics"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  segment: string
  behaviorTags: string[]
  favoriteItems: string[]
  lastOrder: string
  totalOrders: number
  totalSpent: number
  avgOrderValue: number
  churnRisk: string
}

interface GeneratedOffer {
  type: "discount" | "free_item" | "loyalty" | "bundle" | "cashback"
  title: string
  description: string
  value: string
  validUntil: string
  conditions: string[]
  personalizedMessage: string
  whatsappMessage: string
  emailSubject: string
  emailContent: string
  smsMessage: string
  reasoning: string
}

interface AIOfferGeneratorProps {
  customer: Customer
  onOfferSent?: (offer: GeneratedOffer, channel: string) => void
}

export function AIOfferGenerator({ customer, onOfferSent }: AIOfferGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [generatedOffer, setGeneratedOffer] = useState<GeneratedOffer | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<"whatsapp" | "email" | "sms">("whatsapp")
  const [customInstructions, setCustomInstructions] = useState("")
  const [currentStep, setCurrentStep] = useState<"generate" | "preview" | "send">("generate")
  const { toast } = useToast()

  const generateAIOffer = async () => {
    setIsGenerating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const offer = generateOfferBasedOnCustomer(customer, customInstructions)
      setGeneratedOffer(offer)
      setCurrentStep("preview")

      logEvent("ai_offer_generated", {
        customerId: customer.id,
        offerType: offer.type,
        channel: selectedChannel,
      })
    } catch (error) {
      console.error("Failed to generate offer:", error)
      toast({
        title: "Failed to generate offer",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateOfferBasedOnCustomer = (customer: Customer, instructions: string): GeneratedOffer => {
    const isHighValue = customer.totalSpent > 1000
    const isFrequent = customer.totalOrders > 20
    const isAtRisk = customer.churnRisk === "High"
    const hasHealthyPreferences = customer.behaviorTags.includes("Health-Conscious")
    const isWeekendRegular = customer.behaviorTags.includes("Weekend Regular")

    let offerType: GeneratedOffer["type"] = "discount"
    let title = ""
    let description = ""
    let value = ""
    let personalizedMessage = ""
    let reasoning = ""

    if (isAtRisk) {
      offerType = "discount"
      title = "We Miss You! Come Back Special"
      description = "Exclusive 25% off your next order"
      value = "25%"
      personalizedMessage = `Hi ${customer.name}! We noticed you haven't visited us in a while. We'd love to welcome you back with this special offer.`
      reasoning = "Customer is at high churn risk, offering significant discount to win them back"
    } else if (isHighValue && isFrequent) {
      offerType = "loyalty"
      title = "VIP Loyalty Bonus"
      description = "Double loyalty points + free premium item"
      value = "2x Points + Free Item"
      personalizedMessage = `${customer.name}, as one of our most valued customers, enjoy this exclusive VIP reward!`
      reasoning = "High-value frequent customer deserves premium loyalty rewards"
    } else if (hasHealthyPreferences) {
      offerType = "bundle"
      title = "Healthy Choice Bundle"
      description = "Get our new superfood bowl + green smoothie for just $15"
      value = "$15 Bundle"
      personalizedMessage = `Hi ${customer.name}! We know you love healthy options, so we created this special bundle just for you.`
      reasoning = "Customer prefers healthy options, offering relevant healthy bundle"
    } else {
      offerType = "free_item"
      title = "Try Something New"
      description = "Free appetizer with your next order"
      value = "Free Appetizer"
      personalizedMessage = `Hi ${customer.name}! We have some amazing new appetizers we think you'll love. Try one on us!`
      reasoning = "Standard customer, offering free item to encourage trial and increase order value"
    }

    const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()

    return {
      type: offerType,
      title,
      description,
      value,
      validUntil,
      conditions: [
        "Valid for one-time use only",
        "Cannot be combined with other offers",
        "Valid for dine-in and takeaway",
      ],
      personalizedMessage,
      whatsappMessage: `🍽️ *${title}*\n\n${personalizedMessage}\n\n✨ *${description}*\n📅 Valid until: ${validUntil}\n\n*Tap to order now!* 👆`,
      emailSubject: `${title} - Exclusive for You, ${customer.name}!`,
      emailContent: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
            <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 36px;">🍽️</span>
            </div>
            <h1 style="margin: 0; font-size: 32px; font-weight: bold; line-height: 1.2;">${title}</h1>
            <p style="margin: 20px 0 0 0; font-size: 18px; opacity: 0.95; line-height: 1.4;">${personalizedMessage}</p>
          </div>
          
          <div style="padding: 40px 30px;">
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px; border: 2px solid #e9ecef;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">${description}</h2>
              <div style="font-size: 48px; font-weight: bold; color: #28a745; margin: 15px 0; text-shadow: 0 2px 4px rgba(40,167,69,0.2);">${value}</div>
              <div style="background: #28a745; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: 600;">EXCLUSIVE OFFER</div>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
              <p style="margin: 0; color: #856404; font-weight: 600; text-align: center;">
                ⏰ Valid until: <strong>${validUntil}</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="#" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 4px 15px rgba(40,167,69,0.3); transition: all 0.3s ease;">
                🚀 Order Now & Save!
              </a>
            </div>
            
            <div style="border-top: 1px solid #e9ecef; padding-top: 20px;">
              <h3 style="color: #666; font-size: 16px; margin: 0 0 10px 0;">Terms & Conditions:</h3>
              <ul style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Valid for one-time use only</li>
                <li>Cannot be combined with other offers</li>
                <li>Valid for dine-in and takeaway</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 16px; font-weight: 600;">TableSalt Restaurant</p>
            <p style="margin: 0; color: #999; font-size: 14px;">Thank you for being a valued customer!</p>
          </div>
        </div>
      `,
      smsMessage: `🍽️ ${title}: ${description}. ${personalizedMessage} Valid until ${validUntil}. Order now!`,
      reasoning,
    }
  }

  const sendOffer = async () => {
    if (!generatedOffer) return

    setIsSending(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      logEvent("ai_offer_sent", {
        customerId: customer.id,
        offerType: generatedOffer.type,
        channel: selectedChannel,
        offerTitle: generatedOffer.title,
      })

      if (onOfferSent) {
        onOfferSent(generatedOffer, selectedChannel)
      }

      toast({
        title: "Offer sent successfully!",
        description: `${generatedOffer.title} sent via ${selectedChannel.toUpperCase()} to ${customer.name}`,
      })

      setCurrentStep("generate")
      setGeneratedOffer(null)
    } catch (error) {
      toast({
        title: "Failed to send offer",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <Phone className="h-4 w-4" />
      default:
        return <Send className="h-4 w-4" />
    }
  }

  const resetToGenerate = () => {
    setCurrentStep("generate")
    setGeneratedOffer(null)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <Sparkles className="h-4 w-4 mr-2" />
          AI Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] p-0 mx-4">
        <div className="flex flex-col h-full">
          {/* Compact Header */}
          <DialogHeader className="p-4 pb-2 border-b">
            <div className="flex items-center gap-2">
              {currentStep !== "generate" && (
                <Button variant="ghost" size="sm" onClick={resetToGenerate} className="p-1 h-6 w-6">
                  <ArrowLeft className="h-3 w-3" />
                </Button>
              )}
              <DialogTitle className="text-sm font-medium">
                AI Offer • {customer.name}
              </DialogTitle>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="p-4 space-y-4">
              {currentStep === "generate" && (
                <>
                  {/* Compact Customer Context */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <span className="text-gray-500">Segment:</span>
                        <Badge variant="outline" className="text-xs ml-1 px-1 py-0">
                          {customer.segment}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-500">Risk:</span>
                        <Badge
                          className={`text-xs ml-1 px-1 py-0 ${customer.churnRisk === "High" ? "bg-red-100 text-red-700" : customer.churnRisk === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
                        >
                          {customer.churnRisk}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Orders:</span>
                        <span className="font-medium ml-1">{customer.totalOrders}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Spent:</span>
                        <span className="font-medium ml-1">${customer.totalSpent}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Custom Instructions */}
                  <div>
                    <Label className="text-xs text-gray-600">Custom Instructions (Optional)</Label>
                    <Textarea
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder="Birthday offer, new menu promotion..."
                      rows={2}
                      className="mt-1 text-xs resize-none"
                    />
                  </div>

                  {/* Generate Button */}
                  <Button onClick={generateAIOffer} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate AI Offer
                      </>
                    )}
                  </Button>
                </>
              )}

              {currentStep === "preview" && generatedOffer && (
                <>
                  {/* Compact Generated Offer */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border">
                    <div className="flex items-start gap-2 mb-2">
                      <Gift className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 leading-tight">{generatedOffer.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{generatedOffer.description}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 shrink-0">
                        {generatedOffer.value}
                      </Badge>
                    </div>
                    
                    <div className="bg-white/70 p-2 rounded text-xs text-gray-700 mb-2">
                      {generatedOffer.personalizedMessage}
                    </div>

                    <div className="bg-blue-100/50 p-2 rounded">
                      <p className="text-xs text-blue-700 font-medium mb-1">AI Reasoning</p>
                      <p className="text-xs text-blue-600">{generatedOffer.reasoning}</p>
                    </div>
                  </div>

                  {/* Compact Channel Selection */}
                  <div>
                    <Label className="text-xs text-gray-600">Send Via</Label>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      {(["whatsapp", "email", "sms"] as const).map((channel) => (
                        <Button
                          key={channel}
                          variant={selectedChannel === channel ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedChannel(channel)}
                          className="flex flex-col items-center gap-1 h-12 text-xs p-1"
                        >
                          {getChannelIcon(channel)}
                          <span className="capitalize">{channel}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Message Preview */}
                  <div>
                    <Label className="text-xs text-gray-600">Preview</Label>
                    <div className="mt-1 bg-white border rounded-lg max-h-40 overflow-y-auto">
                      {selectedChannel === "whatsapp" && (
                        <div className="p-3">
                          <div className="bg-green-100 p-3 rounded-lg inline-block max-w-full">
                            <div className="whitespace-pre-line text-xs leading-relaxed">
                              {generatedOffer.whatsappMessage}
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedChannel === "email" && (
                        <div className="p-3">
                          <div className="border-b pb-2 mb-3">
                            <p className="font-medium text-xs">Subject: {generatedOffer.emailSubject}</p>
                          </div>
                          
                          {/* Actual Email Preview */}
                          <div className="bg-white border rounded-lg overflow-hidden text-xs">
                            {/* Email Header */}
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 text-center">
                              <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                                <span className="text-sm">🍽️</span>
                              </div>
                              <h1 className="font-bold text-sm mb-1">{generatedOffer.title}</h1>
                              <p className="text-xs opacity-90">{generatedOffer.personalizedMessage}</p>
                            </div>
                            
                            {/* Email Body */}
                            <div className="p-4">
                              <div className="bg-gray-100 p-3 rounded-lg text-center mb-3">
                                <h2 className="font-medium text-xs mb-1">{generatedOffer.description}</h2>
                                <div className="text-green-600 font-bold text-lg">{generatedOffer.value}</div>
                                <div className="bg-green-500 text-white px-2 py-1 rounded-full inline-block text-xs mt-1">
                                  EXCLUSIVE OFFER
                                </div>
                              </div>
                              
                              <div className="bg-yellow-50 border border-yellow-200 p-2 rounded mb-3">
                                <p className="text-yellow-800 text-xs text-center">
                                  ⏰ Valid until: <strong>{generatedOffer.validUntil}</strong>
                                </p>
                              </div>
                              
                              <div className="text-center mb-3">
                                <div className="bg-green-500 text-white px-4 py-2 rounded-full inline-block text-xs font-medium">
                                  🚀 Order Now & Save!
                                </div>
                              </div>
                              
                              <div className="border-t pt-2">
                                <p className="text-xs text-gray-600 mb-1 font-medium">Terms & Conditions:</p>
                                <ul className="text-xs text-gray-500 space-y-0.5">
                                  {generatedOffer.conditions.map((condition, index) => (
                                    <li key={index}>• {condition}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            {/* Email Footer */}
                            <div className="bg-gray-50 p-3 text-center border-t">
                              <p className="text-xs font-medium text-gray-700">TableSalt Restaurant</p>
                              <p className="text-xs text-gray-500">Thank you for being a valued customer!</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedChannel === "sms" && (
                        <div className="p-3">
                          <div className="bg-blue-100 p-3 rounded-lg inline-block max-w-full">
                            <div className="text-xs leading-relaxed">
                              {generatedOffer.smsMessage}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compact Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button onClick={sendOffer} disabled={isSending} className="flex-1 text-sm">
                      {isSending ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3 mr-1" />
                          Send
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={generateAIOffer} disabled={isGenerating} className="px-3">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Compact Conditions */}
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <p className="font-medium mb-1">Valid until: {generatedOffer.validUntil}</p>
                    <div className="space-y-0.5">
                      {generatedOffer.conditions.map((condition, index) => (
                        <p key={index}>• {condition}</p>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
