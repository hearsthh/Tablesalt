import { jobScheduler } from "../jobs/job-scheduler"
import { InstagramBusinessProvider } from "../integrations/providers/instagram-business"
import { WhatsAppBusinessProvider } from "../integrations/providers/whatsapp-business"
import { TwitterBusinessProvider } from "../integrations/providers/twitter-business"
import { FacebookBusinessProvider } from "../integrations/providers/facebook-business"

export interface ScheduledPost {
  id: string
  restaurantId: string
  platforms: ("facebook" | "instagram" | "twitter" | "whatsapp")[]
  content: {
    text: string
    media_urls?: string[]
    media_type?: "image" | "video" | "carousel"
  }
  scheduledTime: string
  timezone: string
  status: "scheduled" | "published" | "failed" | "cancelled"
  recurring?: {
    frequency: "daily" | "weekly" | "monthly"
    interval: number
    endDate?: string
  }
  campaign?: {
    id: string
    name: string
    type: string
  }
  createdAt: string
  publishedAt?: string
  analytics?: {
    reach: number
    engagement: number
    clicks: number
  }
}

export interface BulkScheduleRequest {
  posts: Omit<ScheduledPost, "id" | "status" | "createdAt">[]
  template?: {
    platforms: string[]
    timezone: string
    campaign?: { id: string; name: string; type: string }
  }
}

export interface SchedulingConflict {
  postId: string
  conflictType: "time_overlap" | "platform_limit" | "content_duplicate"
  message: string
  suggestedTime?: string
}

class SocialMediaScheduler {
  private scheduledPosts: Map<string, ScheduledPost> = new Map()
  private providers: Map<string, any> = new Map()
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    console.log("[v0] Initializing social media scheduler...")

    // Initialize providers (would use real credentials in production)
    this.providers.set(
      "facebook",
      new FacebookBusinessProvider({
        name: "Facebook Business",
        credentials: { accessToken: "mock_token" },
        baseUrl: "https://graph.facebook.com/v18.0",
      }),
    )

    this.providers.set(
      "instagram",
      new InstagramBusinessProvider({
        name: "Instagram Business",
        credentials: { accessToken: "mock_token" },
        baseUrl: "https://graph.facebook.com/v18.0",
      }),
    )

    this.providers.set(
      "twitter",
      new TwitterBusinessProvider({
        name: "Twitter Business",
        credentials: { accessToken: "mock_token" },
        baseUrl: "https://api.twitter.com/2",
      }),
    )

    this.providers.set(
      "whatsapp",
      new WhatsAppBusinessProvider({
        name: "WhatsApp Business",
        credentials: { accessToken: "mock_token" },
        baseUrl: "https://graph.facebook.com/v18.0",
      }),
    )

    // Setup scheduler jobs
    this.setupSchedulerJobs()

    this.isInitialized = true
    console.log("[v0] Social media scheduler initialized")
  }

  private setupSchedulerJobs(): void {
    // Check for posts to publish every minute
    jobScheduler.addJob({
      id: "social-media-publisher",
      name: "Social Media Publisher",
      type: "scheduled",
      schedule: "* * * * *", // Every minute
      handler: this.processScheduledPosts.bind(this),
      enabled: true,
      retryCount: 0,
      maxRetries: 3,
    })

    // Generate recurring posts daily
    jobScheduler.addJob({
      id: "recurring-posts-generator",
      name: "Recurring Posts Generator",
      type: "scheduled",
      schedule: "0 0 * * *", // Daily at midnight
      handler: this.generateRecurringPosts.bind(this),
      enabled: true,
      retryCount: 0,
      maxRetries: 2,
    })

    // Analytics collection
    jobScheduler.addJob({
      id: "social-media-analytics",
      name: "Social Media Analytics Collection",
      type: "scheduled",
      schedule: "0 */6 * * *", // Every 6 hours
      handler: this.collectAnalytics.bind(this),
      enabled: true,
      retryCount: 0,
      maxRetries: 2,
    })
  }

  async schedulePost(post: Omit<ScheduledPost, "id" | "status" | "createdAt">): Promise<ScheduledPost> {
    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const scheduledPost: ScheduledPost = {
      ...post,
      id: postId,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    }

    // Validate scheduling conflicts
    const conflicts = await this.checkSchedulingConflicts(scheduledPost)
    if (conflicts.length > 0) {
      throw new Error(`Scheduling conflicts detected: ${conflicts.map((c) => c.message).join(", ")}`)
    }

    this.scheduledPosts.set(postId, scheduledPost)
    console.log(`[v0] Post scheduled: ${postId} for ${post.scheduledTime}`)

    return scheduledPost
  }

  async bulkSchedule(request: BulkScheduleRequest): Promise<{
    scheduled: ScheduledPost[]
    conflicts: SchedulingConflict[]
    failed: { post: any; error: string }[]
  }> {
    const results = {
      scheduled: [] as ScheduledPost[],
      conflicts: [] as SchedulingConflict[],
      failed: [] as { post: any; error: string }[],
    }

    for (const postData of request.posts) {
      try {
        // Apply template defaults
        const post = {
          ...postData,
          platforms: postData.platforms || request.template?.platforms || ["facebook"],
          timezone: postData.timezone || request.template?.timezone || "UTC",
          campaign: postData.campaign || request.template?.campaign,
        }

        const scheduledPost = await this.schedulePost(post)
        results.scheduled.push(scheduledPost)
      } catch (error) {
        if (error.message.includes("conflicts detected")) {
          // Extract conflicts (simplified for demo)
          results.conflicts.push({
            postId: "temp_id",
            conflictType: "time_overlap",
            message: error.message,
          })
        } else {
          results.failed.push({
            post: postData,
            error: error.message,
          })
        }
      }
    }

    console.log(
      `[v0] Bulk schedule completed: ${results.scheduled.length} scheduled, ${results.conflicts.length} conflicts, ${results.failed.length} failed`,
    )
    return results
  }

  private async checkSchedulingConflicts(post: ScheduledPost): Promise<SchedulingConflict[]> {
    const conflicts: SchedulingConflict[] = []
    const postTime = new Date(post.scheduledTime)

    // Check for time overlaps (within 5 minutes)
    for (const [existingId, existingPost] of this.scheduledPosts) {
      if (existingPost.status !== "scheduled") continue

      const existingTime = new Date(existingPost.scheduledTime)
      const timeDiff = Math.abs(postTime.getTime() - existingTime.getTime())

      if (timeDiff < 5 * 60 * 1000) {
        // 5 minutes
        const overlappingPlatforms = post.platforms.filter((p) => existingPost.platforms.includes(p))

        if (overlappingPlatforms.length > 0) {
          conflicts.push({
            postId: post.id,
            conflictType: "time_overlap",
            message: `Time overlap with post ${existingId} on platforms: ${overlappingPlatforms.join(", ")}`,
            suggestedTime: new Date(postTime.getTime() + 10 * 60 * 1000).toISOString(),
          })
        }
      }
    }

    // Check platform-specific limits
    for (const platform of post.platforms) {
      const dailyPosts = Array.from(this.scheduledPosts.values()).filter(
        (p) =>
          p.platforms.includes(platform) &&
          p.scheduledTime.startsWith(post.scheduledTime.split("T")[0]) &&
          p.status === "scheduled",
      )

      const platformLimits = {
        facebook: 25,
        instagram: 25,
        twitter: 300,
        whatsapp: 1000,
      }

      if (dailyPosts.length >= platformLimits[platform]) {
        conflicts.push({
          postId: post.id,
          conflictType: "platform_limit",
          message: `Daily limit reached for ${platform} (${platformLimits[platform]} posts)`,
        })
      }
    }

    return conflicts
  }

  private async processScheduledPosts(): Promise<void> {
    const now = new Date()
    const postsToPublish = Array.from(this.scheduledPosts.values()).filter(
      (post) => post.status === "scheduled" && new Date(post.scheduledTime) <= now,
    )

    console.log(`[v0] Processing ${postsToPublish.length} scheduled posts`)

    for (const post of postsToPublish) {
      try {
        await this.publishPost(post)
        post.status = "published"
        post.publishedAt = new Date().toISOString()
        console.log(`[v0] Published post: ${post.id}`)
      } catch (error) {
        post.status = "failed"
        console.error(`[v0] Failed to publish post ${post.id}:`, error)
      }
    }
  }

  private async publishPost(post: ScheduledPost): Promise<void> {
    const publishPromises = post.platforms.map(async (platform) => {
      const provider = this.providers.get(platform)
      if (!provider) {
        throw new Error(`Provider not found for platform: ${platform}`)
      }

      switch (platform) {
        case "facebook":
        case "instagram":
          return provider.postContent({
            type: post.content.media_type || "image",
            media_url: post.content.media_urls?.[0] || "",
            caption: post.content.text,
          })

        case "twitter":
          return provider.postTweet({
            text: post.content.text,
            media_ids: post.content.media_urls,
          })

        case "whatsapp":
          // WhatsApp requires recipient numbers - this would be handled differently
          return provider.sendMessage({
            to: "broadcast_list",
            type: "text",
            content: { body: post.content.text },
          })

        default:
          throw new Error(`Unsupported platform: ${platform}`)
      }
    })

    await Promise.all(publishPromises)
  }

  private async generateRecurringPosts(): Promise<void> {
    console.log("[v0] Generating recurring posts...")

    const recurringPosts = Array.from(this.scheduledPosts.values()).filter(
      (post) => post.recurring && post.status === "published",
    )

    for (const originalPost of recurringPosts) {
      if (!originalPost.recurring) continue

      const nextScheduleTime = this.calculateNextRecurrence(
        originalPost.publishedAt || originalPost.scheduledTime,
        originalPost.recurring,
      )

      if (nextScheduleTime && (!originalPost.recurring.endDate || nextScheduleTime <= originalPost.recurring.endDate)) {
        const newPost: Omit<ScheduledPost, "id" | "status" | "createdAt"> = {
          restaurantId: originalPost.restaurantId,
          platforms: originalPost.platforms,
          content: originalPost.content,
          scheduledTime: nextScheduleTime,
          timezone: originalPost.timezone,
          recurring: originalPost.recurring,
          campaign: originalPost.campaign,
        }

        try {
          await this.schedulePost(newPost)
          console.log(`[v0] Generated recurring post for ${nextScheduleTime}`)
        } catch (error) {
          console.error("[v0] Failed to generate recurring post:", error)
        }
      }
    }
  }

  private calculateNextRecurrence(lastTime: string, recurring: ScheduledPost["recurring"]): string | null {
    if (!recurring) return null

    const lastDate = new Date(lastTime)
    const nextDate = new Date(lastDate)

    switch (recurring.frequency) {
      case "daily":
        nextDate.setDate(nextDate.getDate() + recurring.interval)
        break
      case "weekly":
        nextDate.setDate(nextDate.getDate() + 7 * recurring.interval)
        break
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + recurring.interval)
        break
      default:
        return null
    }

    return nextDate.toISOString()
  }

  private async collectAnalytics(): Promise<void> {
    console.log("[v0] Collecting social media analytics...")

    const publishedPosts = Array.from(this.scheduledPosts.values()).filter(
      (post) => post.status === "published" && !post.analytics,
    )

    for (const post of publishedPosts) {
      try {
        // Mock analytics collection
        post.analytics = {
          reach: Math.floor(Math.random() * 1000) + 100,
          engagement: Math.floor(Math.random() * 100) + 10,
          clicks: Math.floor(Math.random() * 50) + 5,
        }
        console.log(`[v0] Collected analytics for post: ${post.id}`)
      } catch (error) {
        console.error(`[v0] Failed to collect analytics for post ${post.id}:`, error)
      }
    }
  }

  // Management methods
  async cancelPost(postId: string): Promise<boolean> {
    const post = this.scheduledPosts.get(postId)
    if (!post || post.status !== "scheduled") {
      return false
    }

    post.status = "cancelled"
    console.log(`[v0] Cancelled post: ${postId}`)
    return true
  }

  async updatePost(postId: string, updates: Partial<ScheduledPost>): Promise<ScheduledPost | null> {
    const post = this.scheduledPosts.get(postId)
    if (!post || post.status !== "scheduled") {
      return null
    }

    const updatedPost = { ...post, ...updates }

    // Check conflicts for updated post
    const conflicts = await this.checkSchedulingConflicts(updatedPost)
    if (conflicts.length > 0) {
      throw new Error(`Update conflicts detected: ${conflicts.map((c) => c.message).join(", ")}`)
    }

    this.scheduledPosts.set(postId, updatedPost)
    console.log(`[v0] Updated post: ${postId}`)
    return updatedPost
  }

  getScheduledPosts(restaurantId?: string, status?: ScheduledPost["status"]): ScheduledPost[] {
    let posts = Array.from(this.scheduledPosts.values())

    if (restaurantId) {
      posts = posts.filter((post) => post.restaurantId === restaurantId)
    }

    if (status) {
      posts = posts.filter((post) => post.status === status)
    }

    return posts.sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
  }

  getPostAnalytics(postId: string): ScheduledPost["analytics"] | null {
    const post = this.scheduledPosts.get(postId)
    return post?.analytics || null
  }

  getCampaignAnalytics(campaignId: string): {
    totalPosts: number
    publishedPosts: number
    totalReach: number
    totalEngagement: number
    avgEngagementRate: number
  } {
    const campaignPosts = Array.from(this.scheduledPosts.values()).filter((post) => post.campaign?.id === campaignId)

    const publishedPosts = campaignPosts.filter((post) => post.status === "published" && post.analytics)

    const totalReach = publishedPosts.reduce((sum, post) => sum + (post.analytics?.reach || 0), 0)
    const totalEngagement = publishedPosts.reduce((sum, post) => sum + (post.analytics?.engagement || 0), 0)

    return {
      totalPosts: campaignPosts.length,
      publishedPosts: publishedPosts.length,
      totalReach,
      totalEngagement,
      avgEngagementRate: totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0,
    }
  }

  getSystemStatus() {
    return {
      initialized: this.isInitialized,
      totalPosts: this.scheduledPosts.size,
      scheduledPosts: this.getScheduledPosts(undefined, "scheduled").length,
      publishedPosts: this.getScheduledPosts(undefined, "published").length,
      failedPosts: this.getScheduledPosts(undefined, "failed").length,
      connectedPlatforms: Array.from(this.providers.keys()),
    }
  }
}

export const socialMediaScheduler = new SocialMediaScheduler()
