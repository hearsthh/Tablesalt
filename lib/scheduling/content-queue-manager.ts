import type { ScheduledPost } from "./social-media-scheduler"

export interface ContentQueue {
  id: string
  name: string
  restaurantId: string
  platforms: string[]
  posts: QueuedPost[]
  settings: {
    autoPublish: boolean
    approvalRequired: boolean
    timezone: string
    postingSchedule: {
      days: string[]
      times: string[]
      maxPostsPerDay: number
    }
  }
  createdAt: string
  updatedAt: string
}

export interface QueuedPost {
  id: string
  queueId: string
  content: {
    text: string
    media_urls?: string[]
    media_type?: "image" | "video" | "carousel"
  }
  priority: "low" | "medium" | "high" | "urgent"
  tags: string[]
  approvalStatus: "pending" | "approved" | "rejected"
  scheduledTime?: string
  position: number
  createdAt: string
}

class ContentQueueManager {
  private queues: Map<string, ContentQueue> = new Map()
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    console.log("[v0] Initializing content queue manager...")
    this.isInitialized = true
    console.log("[v0] Content queue manager initialized")
  }

  async createQueue(queue: Omit<ContentQueue, "id" | "createdAt" | "updatedAt">): Promise<ContentQueue> {
    const queueId = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newQueue: ContentQueue = {
      ...queue,
      id: queueId,
      posts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.queues.set(queueId, newQueue)
    console.log(`[v0] Created content queue: ${queueId}`)
    return newQueue
  }

  async addToQueue(
    queueId: string,
    post: Omit<QueuedPost, "id" | "queueId" | "position" | "createdAt">,
  ): Promise<QueuedPost> {
    const queue = this.queues.get(queueId)
    if (!queue) {
      throw new Error(`Queue not found: ${queueId}`)
    }

    const postId = `queued_post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const queuedPost: QueuedPost = {
      ...post,
      id: postId,
      queueId,
      position: queue.posts.length,
      createdAt: new Date().toISOString(),
    }

    queue.posts.push(queuedPost)
    queue.updatedAt = new Date().toISOString()

    console.log(`[v0] Added post to queue ${queueId}: ${postId}`)
    return queuedPost
  }

  async processQueue(queueId: string): Promise<{
    scheduled: ScheduledPost[]
    skipped: { post: QueuedPost; reason: string }[]
  }> {
    const queue = this.queues.get(queueId)
    if (!queue) {
      throw new Error(`Queue not found: ${queueId}`)
    }

    const results = {
      scheduled: [] as ScheduledPost[],
      skipped: [] as { post: QueuedPost; reason: string }[],
    }

    // Filter posts ready for scheduling
    const readyPosts = queue.posts.filter(
      (post) => post.approvalStatus === "approved" || !queue.settings.approvalRequired,
    )

    // Sort by priority and position
    readyPosts.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      return priorityDiff !== 0 ? priorityDiff : a.position - b.position
    })

    // Generate posting schedule
    const postingTimes = this.generatePostingSchedule(queue.settings.postingSchedule)

    for (let i = 0; i < Math.min(readyPosts.length, postingTimes.length); i++) {
      const post = readyPosts[i]
      const scheduledTime = postingTimes[i]

      try {
        // Convert queued post to scheduled post format
        const scheduledPost: Omit<ScheduledPost, "id" | "status" | "createdAt"> = {
          restaurantId: queue.restaurantId,
          platforms: queue.platforms as any[],
          content: post.content,
          scheduledTime,
          timezone: queue.settings.timezone,
        }

        // This would integrate with socialMediaScheduler.schedulePost()
        console.log(`[v0] Would schedule post ${post.id} for ${scheduledTime}`)

        // Mock scheduled post for demo
        const mockScheduledPost: ScheduledPost = {
          ...scheduledPost,
          id: `scheduled_${post.id}`,
          status: "scheduled",
          createdAt: new Date().toISOString(),
        }

        results.scheduled.push(mockScheduledPost)

        // Remove from queue
        queue.posts = queue.posts.filter((p) => p.id !== post.id)
      } catch (error) {
        results.skipped.push({
          post,
          reason: error.message,
        })
      }
    }

    queue.updatedAt = new Date().toISOString()
    console.log(
      `[v0] Processed queue ${queueId}: ${results.scheduled.length} scheduled, ${results.skipped.length} skipped`,
    )

    return results
  }

  private generatePostingSchedule(schedule: ContentQueue["settings"]["postingSchedule"]): string[] {
    const times: string[] = []
    const now = new Date()

    // Generate posting times for the next 7 days
    for (let day = 0; day < 7; day++) {
      const targetDate = new Date(now)
      targetDate.setDate(targetDate.getDate() + day)

      const dayName = targetDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()

      if (schedule.days.includes(dayName)) {
        const dailyTimes = schedule.times.slice(0, schedule.maxPostsPerDay)

        for (const time of dailyTimes) {
          const [hours, minutes] = time.split(":").map(Number)
          const scheduledTime = new Date(targetDate)
          scheduledTime.setHours(hours, minutes, 0, 0)

          if (scheduledTime > now) {
            times.push(scheduledTime.toISOString())
          }
        }
      }
    }

    return times.sort()
  }

  async approvePost(queueId: string, postId: string): Promise<boolean> {
    const queue = this.queues.get(queueId)
    if (!queue) return false

    const post = queue.posts.find((p) => p.id === postId)
    if (!post) return false

    post.approvalStatus = "approved"
    queue.updatedAt = new Date().toISOString()

    console.log(`[v0] Approved post: ${postId}`)
    return true
  }

  async rejectPost(queueId: string, postId: string, reason?: string): Promise<boolean> {
    const queue = this.queues.get(queueId)
    if (!queue) return false

    const post = queue.posts.find((p) => p.id === postId)
    if (!post) return false

    post.approvalStatus = "rejected"
    queue.updatedAt = new Date().toISOString()

    console.log(`[v0] Rejected post: ${postId} - ${reason || "No reason provided"}`)
    return true
  }

  async reorderQueue(queueId: string, postIds: string[]): Promise<boolean> {
    const queue = this.queues.get(queueId)
    if (!queue) return false

    // Reorder posts based on provided order
    const reorderedPosts: QueuedPost[] = []

    postIds.forEach((postId, index) => {
      const post = queue.posts.find((p) => p.id === postId)
      if (post) {
        post.position = index
        reorderedPosts.push(post)
      }
    })

    // Add any posts not in the reorder list at the end
    queue.posts.forEach((post) => {
      if (!postIds.includes(post.id)) {
        post.position = reorderedPosts.length
        reorderedPosts.push(post)
      }
    })

    queue.posts = reorderedPosts
    queue.updatedAt = new Date().toISOString()

    console.log(`[v0] Reordered queue: ${queueId}`)
    return true
  }

  getQueue(queueId: string): ContentQueue | null {
    return this.queues.get(queueId) || null
  }

  getQueues(restaurantId?: string): ContentQueue[] {
    let queues = Array.from(this.queues.values())

    if (restaurantId) {
      queues = queues.filter((queue) => queue.restaurantId === restaurantId)
    }

    return queues.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  getQueueStats(queueId: string): {
    totalPosts: number
    pendingApproval: number
    approved: number
    rejected: number
    byPriority: Record<string, number>
  } | null {
    const queue = this.queues.get(queueId)
    if (!queue) return null

    const stats = {
      totalPosts: queue.posts.length,
      pendingApproval: 0,
      approved: 0,
      rejected: 0,
      byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
    }

    queue.posts.forEach((post) => {
      stats.byPriority[post.priority]++

      switch (post.approvalStatus) {
        case "pending":
          stats.pendingApproval++
          break
        case "approved":
          stats.approved++
          break
        case "rejected":
          stats.rejected++
          break
      }
    })

    return stats
  }
}

export const contentQueueManager = new ContentQueueManager()
