'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Send, Users, MessageSquare, Mail, Phone, Heart, RotateCcw, AlertTriangle, Gift, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
  aiSegment: string
  avatar: string
}

interface UnifiedCommunicationPanelProps {
  customer: Customer
}

type CommunicationType = 'ai_offer' | 'thank_you' | 'win_back' | 'apology' | 'birthday' | 'feedback' | 'custom'
type Channel = 'email' | 'sms' | 'whatsapp'

const communicationTypes = [
  {
    id: 'ai_offer' as CommunicationType,
    name: 'AI Personalized Offer',
    description: 'Generate a personalized offer based on customer behavior',
    icon: Sparkles,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    id: 'thank_you' as CommunicationType,
    name: 'Thank You Note',
    description: 'Express gratitude for their loyalty',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  },
  {
    id: 'win_back' as CommunicationType,
    name: 'Win-Back Message',
    description: 'Re-engage inactive customer',
    icon: RotateCcw,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'apology' as CommunicationType,
    name: 'Apology Note',
    description: 'Address service issues professionally',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  {
    id: 'birthday' as CommunicationType,
    name: 'Birthday Wishes',
    description: 'Celebrate their special day',
    icon: Gift,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  {
    id: 'feedback' as CommunicationType,
    name: 'Feedback Request',
    description: 'Gather reviews and feedback',
    icon: MessageSquare,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  }
]

export function UnifiedCommunicationPanel({ customer }: UnifiedCommunicationPanelProps) {
  const [currentStep, setCurrentStep] = useState<'type' | 'customize' | 'preview' | 'sending' | 'complete'>('type')
  const [selectedType, setSelectedType] = useState<CommunicationType | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<Channel>('email')
  const [customMessage, setCustomMessage] = useState('')
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [isSending, setIsSending] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generateContent = async (type: CommunicationType) => {
    setIsGenerating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const content = generateContentBasedOnType(type, customer)
      setGeneratedContent(content)
      setCurrentStep('preview')
    } catch (error) {
      toast({
        title: "Failed to generate content",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateContentBasedOnType = (type: CommunicationType, customer: Customer) => {
    const isHighValue = customer.totalSpent > 1000
    const isFrequent = customer.totalOrders > 20
    const isAtRisk = customer.churnRisk === "High"
    const hasHealthyPreferences = customer.behaviorTags.includes("Health-Conscious")

    let title = ""
    let description = ""
    let value = ""
    let personalizedMessage = ""
    let reasoning = ""

    switch (type) {
      case 'ai_offer':
        if (isAtRisk) {
          title = "We Miss You! Come Back Special"
          description = "Exclusive 25% off your next order"
          value = "25% OFF"
          personalizedMessage = `Hi ${customer.name}! We noticed you haven't visited us in a while. We'd love to welcome you back with this special offer.`
          reasoning = "Customer is at high churn risk, offering significant discount to win them back"
        } else if (isHighValue && isFrequent) {
          title = "VIP Loyalty Bonus"
          description = "Double loyalty points + free premium item"
          value = "2x Points + Free Item"
          personalizedMessage = `${customer.name}, as one of our most valued customers, enjoy this exclusive VIP reward!`
          reasoning = "High-value frequent customer deserves premium loyalty rewards"
        } else if (hasHealthyPreferences) {
          title = "Healthy Choice Bundle"
          description = "Get our new superfood bowl + green smoothie for just $15"
          value = "$15 Bundle"
          personalizedMessage = `Hi ${customer.name}! We know you love healthy options, so we created this special bundle just for you.`
          reasoning = "Customer prefers healthy options, offering relevant healthy bundle"
        } else {
          title = "Try Something New"
          description = "Free appetizer with your next order"
          value = "Free Appetizer"
          personalizedMessage = `Hi ${customer.name}! We have some amazing new appetizers we think you'll love. Try one on us!`
          reasoning = "Standard customer, offering free item to encourage trial and increase order value"
        }
        break

      case 'thank_you':
        title = `Thank you for being amazing, ${customer.name}!`
        personalizedMessage = `Hi ${customer.name},\n\nWe wanted to take a moment to thank you for being such a wonderful customer. Your ${customer.totalOrders} orders and continued support mean the world to us!\n\nAs a token of our appreciation, enjoy 15% off your next order.\n\nWith gratitude,\nThe TableSalt Team`
        reasoning = "Expressing genuine gratitude to build customer loyalty"
        break

      case 'win_back':
        title = `We miss you, ${customer.name}!`
        personalizedMessage = `Hi ${customer.name},\n\nWe noticed you haven't visited us in a while, and we miss you! We've added some exciting new items to our menu that we think you'll love.\n\nCome back and enjoy 25% off your next order - it's our way of saying welcome back!\n\nHope to see you soon,\nThe TableSalt Team`
        reasoning = "Re-engaging inactive customer with compelling offer"
        break

      case 'apology':
        title = `Our sincere apologies, ${customer.name}`
        personalizedMessage = `Dear ${customer.name},\n\nWe sincerely apologize for any inconvenience you may have experienced during your recent visit. Your feedback is invaluable to us, and we're taking immediate steps to improve.\n\nAs an apology, we'd like to offer you a complimentary meal on your next visit.\n\nThank you for your patience and understanding.\n\nSincerely,\nThe TableSalt Team`
        reasoning = "Professional apology with compensation to rebuild trust"
        break

      case 'birthday':
        title = `Happy Birthday, ${customer.name}! 🎉`
        personalizedMessage = `Happy Birthday, ${customer.name}! 🎂\n\nWishing you a fantastic day filled with joy and celebration. To make your special day even sweeter, we're treating you to a free birthday dessert with any meal!\n\nValid for the entire month - because birthdays should be celebrated all month long!\n\nCheers to another amazing year!\nThe TableSalt Team`
        reasoning = "Celebrating customer's birthday to strengthen emotional connection"
        break

      case 'feedback':
        title = `How was your experience, ${customer.name}?`
        personalizedMessage = `Hi ${customer.name},\n\nThank you for your recent visit! We hope you enjoyed your meal and had a great experience with us.\n\nWould you mind taking 2 minutes to share your feedback? Your input helps us serve you better.\n\nAs a thank you for your time, enjoy 10% off your next order!\n\nBest regards,\nThe TableSalt Team`
        reasoning = "Gathering feedback while incentivizing future visits"
        break

      default:
        title = `Special message for ${customer.name}`
        personalizedMessage = customMessage || `Hi ${customer.name}, we have something special for you!`
        reasoning = "Custom message tailored to specific needs"
    }

    const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()

    return {
      type,
      title,
      description,
      value,
      personalizedMessage,
      reasoning,
      validUntil,
      whatsappMessage: `🍽️ *${title}*\n\n${personalizedMessage}\n\n${description ? `✨ *${description}*\n` : ''}${validUntil ? `📅 Valid until: ${validUntil}\n` : ''}\n*Tap to order now!* 👆`,
      emailSubject: title,
      emailContent: generateEmailHTML(title, personalizedMessage, description, value, validUntil),
      smsMessage: `🍽️ ${title}: ${description || personalizedMessage}. ${validUntil ? `Valid until ${validUntil}.` : ''} Order now!`
    }
  }

  const generateEmailHTML = (title: string, message: string, description?: string, value?: string, validUntil?: string) => {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
          <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 36px;">🍽️</span>
          </div>
          <h1 style="margin: 0; font-size: 32px; font-weight: bold; line-height: 1.2;">${title}</h1>
        </div>
        
        <div style="padding: 40px 30px;">
          <div style="margin-bottom: 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          ${description && value ? `
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px; border: 2px solid #e9ecef;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">${description}</h2>
            <div style="font-size: 48px; font-weight: bold; color: #28a745; margin: 15px 0; text-shadow: 0 2px 4px rgba(40,167,69,0.2);">${value}</div>
            <div style="background: #28a745; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: 600;">EXCLUSIVE OFFER</div>
          </div>
          ` : ''}
          
          ${validUntil ? `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <p style="margin: 0; color: #856404; font-weight: 600; text-align: center;">
              ⏰ Valid until: <strong>${validUntil}</strong>
            </p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="#" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 4px 15px rgba(40,167,69,0.3); transition: all 0.3s ease;">
              🚀 Order Now!
            </a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="margin: 0 0 10px 0; color: #666; font-size: 16px; font-weight: 600;">TableSalt Restaurant</p>
          <p style="margin: 0; color: #999; font-size: 14px;">Thank you for being a valued customer!</p>
        </div>
      </div>
    `
  }

  const handleSend = async () => {
    if (!generatedContent) return
    
    setCurrentStep('sending')
    setIsSending(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setCurrentStep('complete')
      
      toast({
        title: "Message sent successfully!",
        description: `${generatedContent.title} sent via ${selectedChannel.toUpperCase()} to ${customer.name}`,
      })

    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  const resetFlow = () => {
    setCurrentStep('type')
    setSelectedType(null)
    setGeneratedContent(null)
    setCustomMessage('')
  }

  const getChannelIcon = (channel: Channel) => {
    switch (channel) {
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <Phone className="h-4 w-4" />
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="flex-1">
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] p-0 mx-4">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-4 pb-2 border-b">
            <div className="flex items-center gap-2">
              {currentStep !== 'type' && currentStep !== 'complete' && (
                <Button variant="ghost" size="sm" onClick={resetFlow} className="p-1 h-6 w-6">
                  <ArrowLeft className="h-3 w-3" />
                </Button>
              )}
              <div>
                <DialogTitle className="text-sm font-medium">
                  Contact {customer.name}
                </DialogTitle>
                <p className="text-xs text-gray-500">
                  {customer.aiSegment} • {customer.churnRisk} Risk
                </p>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="p-4">
              {/* Step 1: Select Communication Type */}
              {currentStep === 'type' && (
                <div className="space-y-4">
                  {/* Customer Context */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <span className="text-gray-500">Orders:</span>
                        <span className="font-medium ml-1">{customer.totalOrders}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Spent:</span>
                        <span className="font-medium ml-1">${customer.totalSpent}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Order:</span>
                        <span className="font-medium ml-1">{customer.lastOrder}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Segment:</span>
                        <Badge variant="outline" className="text-xs ml-1 px-1 py-0">
                          {customer.segment}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {customer.behaviorTags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-3">Choose Communication Type</h3>
                    <div className="space-y-2">
                      {communicationTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <div
                            key={type.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedType === type.id 
                                ? `${type.borderColor} ${type.bgColor}` 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedType(type.id)}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className={`h-4 w-4 mt-0.5 ${type.color}`} />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-gray-900">{type.name}</h4>
                                <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {selectedType && (
                    <Button 
                      onClick={() => generateContent(selectedType)} 
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}

              {/* Step 2: Preview & Customize */}
              {currentStep === 'preview' && generatedContent && (
                <div className="space-y-4">
                  {/* Generated Content */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border">
                    <div className="flex items-start gap-2 mb-2">
                      <Gift className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 leading-tight">{generatedContent.title}</h3>
                        {generatedContent.description && (
                          <p className="text-xs text-gray-600 mt-1">{generatedContent.description}</p>
                        )}
                      </div>
                      {generatedContent.value && (
                        <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 shrink-0">
                          {generatedContent.value}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="bg-blue-100/50 p-2 rounded">
                      <p className="text-xs text-blue-700 font-medium mb-1">AI Reasoning</p>
                      <p className="text-xs text-blue-600">{generatedContent.reasoning}</p>
                    </div>
                  </div>

                  {/* Channel Selection */}
                  <div>
                    <Label className="text-xs text-gray-600">Send Via</Label>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      {(['whatsapp', 'email', 'sms'] as Channel[]).map((channel) => (
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

                  {/* Message Preview */}
                  <div>
                    <Label className="text-xs text-gray-600">Preview</Label>
                    <div className="mt-1 bg-white border rounded-lg max-h-40 overflow-y-auto">
                      {selectedChannel === "whatsapp" && (
                        <div className="p-3">
                          <div className="bg-green-100 p-3 rounded-lg inline-block max-w-full">
                            <div className="whitespace-pre-line text-xs leading-relaxed">
                              {generatedContent.whatsappMessage}
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedChannel === "email" && (
                        <div className="p-3">
                          <div className="border-b pb-2 mb-3">
                            <p className="font-medium text-xs">Subject: {generatedContent.emailSubject}</p>
                          </div>
                          
                          <div className="bg-white border rounded-lg overflow-hidden text-xs">
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 text-center">
                              <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                                <span className="text-sm">🍽️</span>
                              </div>
                              <h1 className="font-bold text-sm mb-1">{generatedContent.title}</h1>
                            </div>
                            
                            <div className="p-4">
                              <div className="text-xs text-gray-700 mb-3 leading-relaxed">
                                {generatedContent.personalizedMessage.split('\n').map((line: string, index: number) => (
                                  <p key={index} className={index > 0 ? 'mt-2' : ''}>{line}</p>
                                ))}
                              </div>
                              
                              {generatedContent.description && generatedContent.value && (
                                <div className="bg-gray-100 p-3 rounded-lg text-center mb-3">
                                  <h2 className="font-medium text-xs mb-1">{generatedContent.description}</h2>
                                  <div className="text-green-600 font-bold text-lg">{generatedContent.value}</div>
                                  <div className="bg-green-500 text-white px-2 py-1 rounded-full inline-block text-xs mt-1">
                                    EXCLUSIVE OFFER
                                  </div>
                                </div>
                              )}
                              
                              {generatedContent.validUntil && (
                                <div className="bg-yellow-50 border border-yellow-200 p-2 rounded mb-3">
                                  <p className="text-yellow-800 text-xs text-center">
                                    ⏰ Valid until: <strong>{generatedContent.validUntil}</strong>
                                  </p>
                                </div>
                              )}
                              
                              <div className="text-center">
                                <div className="bg-green-500 text-white px-4 py-2 rounded-full inline-block text-xs font-medium">
                                  🚀 Order Now!
                                </div>
                              </div>
                            </div>
                            
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
                              {generatedContent.smsMessage}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSend} 
                    disabled={isSending}
                    className="w-full"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Step 3: Sending */}
              {currentStep === 'sending' && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Send className="h-8 w-8 text-blue-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-2">Sending Message...</h3>
                    <p className="text-xs text-gray-600">
                      Sending {generatedContent?.title} to {customer.name} via {selectedChannel.toUpperCase()}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Complete */}
              {currentStep === 'complete' && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-2">Message Sent Successfully!</h3>
                    <p className="text-xs text-gray-600 mb-4">
                      {generatedContent?.title} sent to {customer.name} via {selectedChannel.toUpperCase()}
                    </p>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-700">
                        You can track delivery status and responses in the notification center.
                      </p>
                    </div>
                  </div>
                  <Button onClick={resetFlow} className="w-full">
                    Send Another Message
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
