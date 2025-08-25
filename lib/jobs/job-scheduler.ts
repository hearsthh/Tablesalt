interface Job {
  id: string
  name: string
  type: "scheduled" | "triggered" | "webhook"
  schedule?: string // cron expression
  handler: () => Promise<void>
  enabled: boolean
  lastRun?: string
  nextRun?: string
  retryCount: number
  maxRetries: number
}

interface JobResult {
  jobId: string
  success: boolean
  duration: number
  error?: string
  timestamp: string
}

class JobScheduler {
  private jobs: Map<string, Job> = new Map()
  private results: JobResult[] = []
  private timers: Map<string, NodeJS.Timeout> = new Map()
  private isRunning = false

  constructor() {
    this.setupDefaultJobs()
  }

  private setupDefaultJobs() {
    // Daily analytics report
    this.addJob({
      id: "daily-analytics",
      name: "Daily Analytics Report",
      type: "scheduled",
      schedule: "0 9 * * *", // 9 AM daily
      handler: this.generateDailyAnalytics,
      enabled: true,
      retryCount: 0,
      maxRetries: 3,
    })

    // Weekly menu performance report
    this.addJob({
      id: "weekly-menu-report",
      name: "Weekly Menu Performance",
      type: "scheduled",
      schedule: "0 10 * * 1", // 10 AM every Monday
      handler: this.generateWeeklyMenuReport,
      enabled: true,
      retryCount: 0,
      maxRetries: 3,
    })

    // Customer engagement automation
    this.addJob({
      id: "customer-engagement",
      name: "Customer Engagement Automation",
      type: "scheduled",
      schedule: "0 18 * * *", // 6 PM daily
      handler: this.runCustomerEngagement,
      enabled: true,
      retryCount: 0,
      maxRetries: 2,
    })

    // Data cleanup
    this.addJob({
      id: "data-cleanup",
      name: "Data Cleanup",
      type: "scheduled",
      schedule: "0 2 * * 0", // 2 AM every Sunday
      handler: this.cleanupOldData,
      enabled: true,
      retryCount: 0,
      maxRetries: 1,
    })

    // Integration sync
    this.addJob({
      id: "integration-sync",
      name: "Integration Sync",
      type: "scheduled",
      schedule: "*/30 * * * *", // Every 30 minutes
      handler: this.syncIntegrations,
      enabled: true,
      retryCount: 0,
      maxRetries: 2,
    })
  }

  addJob(job: Job) {
    this.jobs.set(job.id, job)
    if (job.type === "scheduled" && job.schedule) {
      this.scheduleJob(job)
    }
  }

  removeJob(jobId: string) {
    const timer = this.timers.get(jobId)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(jobId)
    }
    this.jobs.delete(jobId)
  }

  private scheduleJob(job: Job) {
    if (!job.schedule || !job.enabled) return

    // Simple scheduling - in production, use a proper cron library
    const interval = this.parseCronToInterval(job.schedule)
    if (interval > 0) {
      const timer = setInterval(() => {
        this.runJob(job.id)
      }, interval)
      this.timers.set(job.id, timer)
    }
  }

  private parseCronToInterval(cron: string): number {
    // Simplified cron parsing for demo
    // In production, use a proper cron parser like node-cron
    if (cron === "0 9 * * *") return 24 * 60 * 60 * 1000 // Daily
    if (cron === "0 10 * * 1") return 7 * 24 * 60 * 60 * 1000 // Weekly
    if (cron === "0 18 * * *") return 24 * 60 * 60 * 1000 // Daily
    if (cron === "0 2 * * 0") return 7 * 24 * 60 * 60 * 1000 // Weekly
    if (cron === "*/30 * * * *") return 30 * 60 * 1000 // Every 30 minutes
    return 0
  }

  async runJob(jobId: string): Promise<JobResult> {
    const job = this.jobs.get(jobId)
    if (!job || !job.enabled) {
      throw new Error(`Job ${jobId} not found or disabled`)
    }

    const startTime = Date.now()
    console.log(`[v0] Starting job: ${job.name}`)

    try {
      await job.handler()
      const duration = Date.now() - startTime

      const result: JobResult = {
        jobId,
        success: true,
        duration,
        timestamp: new Date().toISOString(),
      }

      this.results.push(result)
      job.lastRun = result.timestamp
      job.retryCount = 0

      console.log(`[v0] Job completed: ${job.name} (${duration}ms)`)
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      const result: JobResult = {
        jobId,
        success: false,
        duration,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }

      this.results.push(result)
      job.retryCount++

      console.error(`[v0] Job failed: ${job.name} - ${errorMessage}`)

      // Retry logic
      if (job.retryCount < job.maxRetries) {
        console.log(`[v0] Retrying job: ${job.name} (attempt ${job.retryCount + 1}/${job.maxRetries})`)
        setTimeout(() => this.runJob(jobId), 5000) // Retry after 5 seconds
      }

      return result
    }
  }

  // Job handlers
  private generateDailyAnalytics = async () => {
    console.log("[v0] Generating daily analytics report...")

    // Mock analytics calculation
    const analytics = {
      totalRevenue: Math.floor(Math.random() * 5000) + 1000,
      totalOrders: Math.floor(Math.random() * 100) + 20,
      avgOrderValue: Math.floor(Math.random() * 50) + 25,
      topItems: ["Butter Chicken", "Caesar Salad", "Margherita Pizza"],
      customerSatisfaction: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In production, this would:
    // 1. Calculate real analytics from database
    // 2. Generate PDF/email report
    // 3. Send to restaurant owners
    // 4. Update dashboard metrics

    console.log("[v0] Daily analytics generated:", analytics)
  }

  private generateWeeklyMenuReport = async () => {
    console.log("[v0] Generating weekly menu performance report...")

    const menuReport = {
      topPerformers: [
        { name: "Butter Chicken", orders: 45, revenue: 854.55 },
        { name: "Margherita Pizza", orders: 38, revenue: 645.62 },
        { name: "Caesar Salad", orders: 32, revenue: 415.68 },
      ],
      underperformers: [{ name: "Mushroom Risotto", orders: 3, revenue: 47.97 }],
      recommendations: [
        "Consider promoting Mushroom Risotto with a discount",
        "Butter Chicken is trending - consider adding variations",
        "Weekend specials could boost overall performance",
      ],
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))

    console.log("[v0] Weekly menu report generated:", menuReport)
  }

  private runCustomerEngagement = async () => {
    console.log("[v0] Running customer engagement automation...")

    // Mock customer segmentation and engagement
    const engagementTasks = [
      "Send welcome email to new customers",
      "Send loyalty rewards to frequent customers",
      "Send re-engagement email to inactive customers",
      "Send birthday offers to customers",
      "Send review requests to recent diners",
    ]

    for (const task of engagementTasks) {
      console.log(`[v0] Processing: ${task}`)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    console.log("[v0] Customer engagement automation completed")
  }

  private cleanupOldData = async () => {
    console.log("[v0] Starting data cleanup...")

    const cleanupTasks = [
      "Archive orders older than 2 years",
      "Clean up temporary files",
      "Compress old log files",
      "Remove expired sessions",
      "Update search indexes",
    ]

    for (const task of cleanupTasks) {
      console.log(`[v0] ${task}`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log("[v0] Data cleanup completed")
  }

  private syncIntegrations = async () => {
    console.log("[v0] Syncing integrations...")

    const integrations = [
      "Uber Eats menu sync",
      "DoorDash availability update",
      "Grubhub pricing sync",
      "POS system inventory check",
      "Payment processor reconciliation",
    ]

    for (const integration of integrations) {
      console.log(`[v0] Syncing: ${integration}`)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    console.log("[v0] Integration sync completed")
  }

  // Management methods
  start() {
    if (this.isRunning) return
    this.isRunning = true

    this.jobs.forEach((job) => {
      if (job.type === "scheduled" && job.enabled) {
        this.scheduleJob(job)
      }
    })

    console.log("[v0] Job scheduler started")
  }

  stop() {
    this.isRunning = false

    this.timers.forEach((timer) => {
      clearTimeout(timer)
    })
    this.timers.clear()

    console.log("[v0] Job scheduler stopped")
  }

  getJobs(): Job[] {
    return Array.from(this.jobs.values())
  }

  getJobResults(limit = 50): JobResult[] {
    return this.results.slice(-limit).reverse()
  }

  getJobStatus(jobId: string): Job | undefined {
    return this.jobs.get(jobId)
  }
}

export const jobScheduler = new JobScheduler()
