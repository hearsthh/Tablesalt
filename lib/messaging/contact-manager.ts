import type { MessageRecipient } from "./multi-channel-messenger"

export interface ContactSegment {
  id: string
  name: string
  description: string
  criteria: {
    tags?: string[]
    channels?: string[]
    lastOrderBefore?: string
    totalSpent?: { min?: number; max?: number }
    visitFrequency?: "new" | "regular" | "vip" | "inactive"
    location?: string[]
  }
  contactCount: number
  createdAt: string
  updatedAt: string
}

export interface ContactList {
  id: string
  name: string
  description: string
  contacts: string[] // contact IDs
  segments: string[] // segment IDs
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ContactInteraction {
  id: string
  contactId: string
  type: "message_sent" | "message_opened" | "message_clicked" | "order_placed" | "review_left" | "visit"
  channel?: string
  campaignId?: string
  metadata: Record<string, any>
  timestamp: string
}

class ContactManager {
  private contacts: Map<string, MessageRecipient> = new Map()
  private segments: Map<string, ContactSegment> = new Map()
  private lists: Map<string, ContactList> = new Map()
  private interactions: Map<string, ContactInteraction[]> = new Map()
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    console.log("[v0] Initializing contact manager...")

    // Setup default segments
    this.setupDefaultSegments()

    // Setup default lists
    this.setupDefaultLists()

    this.isInitialized = true
    console.log("[v0] Contact manager initialized")
  }

  private setupDefaultSegments(): void {
    const defaultSegments: ContactSegment[] = [
      {
        id: "new_customers",
        name: "New Customers",
        description: "Customers who joined in the last 30 days",
        criteria: {
          tags: ["new_customer"],
          visitFrequency: "new",
        },
        contactCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "vip_customers",
        name: "VIP Customers",
        description: "High-value customers with frequent visits",
        criteria: {
          visitFrequency: "vip",
          totalSpent: { min: 500 },
        },
        contactCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "inactive_customers",
        name: "Inactive Customers",
        description: "Customers who haven't visited in 60+ days",
        criteria: {
          visitFrequency: "inactive",
          lastOrderBefore: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        contactCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "email_subscribers",
        name: "Email Subscribers",
        description: "Contacts who prefer email communication",
        criteria: {
          channels: ["email"],
        },
        contactCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "whatsapp_users",
        name: "WhatsApp Users",
        description: "Contacts who use WhatsApp",
        criteria: {
          channels: ["whatsapp"],
        },
        contactCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    defaultSegments.forEach((segment) => {
      this.segments.set(segment.id, segment)
    })
  }

  private setupDefaultLists(): void {
    const defaultLists: ContactList[] = [
      {
        id: "all_customers",
        name: "All Customers",
        description: "Complete customer database",
        contacts: [],
        segments: ["new_customers", "vip_customers", "inactive_customers"],
        tags: ["customer"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "marketing_list",
        name: "Marketing List",
        description: "Customers who opted in for marketing messages",
        contacts: [],
        segments: ["email_subscribers", "whatsapp_users"],
        tags: ["marketing", "opted_in"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    defaultLists.forEach((list) => {
      this.lists.set(list.id, list)
    })
  }

  async addContact(contact: Omit<MessageRecipient, "id">): Promise<string> {
    const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newContact: MessageRecipient = {
      ...contact,
      id: contactId,
    }

    this.contacts.set(contactId, newContact)
    this.interactions.set(contactId, [])

    // Update segment counts
    await this.updateSegmentCounts()

    console.log(`[v0] Contact added: ${contact.name}`)
    return contactId
  }

  async updateContact(contactId: string, updates: Partial<MessageRecipient>): Promise<boolean> {
    const contact = this.contacts.get(contactId)
    if (!contact) return false

    const updatedContact = { ...contact, ...updates }
    this.contacts.set(contactId, updatedContact)

    // Update segment counts
    await this.updateSegmentCounts()

    console.log(`[v0] Contact updated: ${contactId}`)
    return true
  }

  async deleteContact(contactId: string): Promise<boolean> {
    const deleted = this.contacts.delete(contactId)
    if (deleted) {
      this.interactions.delete(contactId)
      await this.updateSegmentCounts()
      console.log(`[v0] Contact deleted: ${contactId}`)
    }
    return deleted
  }

  async createSegment(
    segment: Omit<ContactSegment, "id" | "contactCount" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    const segmentId = `segment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newSegment: ContactSegment = {
      ...segment,
      id: segmentId,
      contactCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.segments.set(segmentId, newSegment)

    // Calculate initial contact count
    const contacts = await this.getContactsBySegment(segmentId)
    newSegment.contactCount = contacts.length

    console.log(`[v0] Segment created: ${segment.name}`)
    return segmentId
  }

  async getContactsBySegment(segmentId: string): Promise<MessageRecipient[]> {
    const segment = this.segments.get(segmentId)
    if (!segment) return []

    const allContacts = Array.from(this.contacts.values())

    return allContacts.filter((contact) => {
      // Check if contact matches segment criteria
      const criteria = segment.criteria

      if (criteria.tags && !criteria.tags.some((tag) => contact.segments.includes(tag))) {
        return false
      }

      if (criteria.channels && !criteria.channels.some((channel) => contact.preferences.channels.includes(channel))) {
        return false
      }

      if (criteria.lastOrderBefore && contact.lastContactedAt) {
        const lastContact = new Date(contact.lastContactedAt)
        const beforeDate = new Date(criteria.lastOrderBefore)
        if (lastContact >= beforeDate) {
          return false
        }
      }

      // Add more criteria checks as needed

      return true
    })
  }

  async createList(list: Omit<ContactList, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const listId = `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newList: ContactList = {
      ...list,
      id: listId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.lists.set(listId, newList)
    console.log(`[v0] Contact list created: ${list.name}`)
    return listId
  }

  async addContactToList(listId: string, contactId: string): Promise<boolean> {
    const list = this.lists.get(listId)
    const contact = this.contacts.get(contactId)

    if (!list || !contact) return false

    if (!list.contacts.includes(contactId)) {
      list.contacts.push(contactId)
      list.updatedAt = new Date().toISOString()
      console.log(`[v0] Contact ${contactId} added to list ${listId}`)
    }

    return true
  }

  async removeContactFromList(listId: string, contactId: string): Promise<boolean> {
    const list = this.lists.get(listId)
    if (!list) return false

    const index = list.contacts.indexOf(contactId)
    if (index > -1) {
      list.contacts.splice(index, 1)
      list.updatedAt = new Date().toISOString()
      console.log(`[v0] Contact ${contactId} removed from list ${listId}`)
      return true
    }

    return false
  }

  async recordInteraction(interaction: Omit<ContactInteraction, "id" | "timestamp">): Promise<string> {
    const interactionId = `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newInteraction: ContactInteraction = {
      ...interaction,
      id: interactionId,
      timestamp: new Date().toISOString(),
    }

    const contactInteractions = this.interactions.get(interaction.contactId) || []
    contactInteractions.push(newInteraction)
    this.interactions.set(interaction.contactId, contactInteractions)

    // Update contact's last contacted time
    if (interaction.type === "message_sent") {
      const contact = this.contacts.get(interaction.contactId)
      if (contact) {
        contact.lastContactedAt = newInteraction.timestamp
      }
    }

    console.log(`[v0] Interaction recorded: ${interaction.type} for contact ${interaction.contactId}`)
    return interactionId
  }

  async getContactInteractions(contactId: string, limit = 50): Promise<ContactInteraction[]> {
    const interactions = this.interactions.get(contactId) || []
    return interactions.slice(-limit).reverse()
  }

  async getContactEngagementScore(contactId: string): Promise<number> {
    const interactions = this.interactions.get(contactId) || []
    const recentInteractions = interactions.filter(
      (i) => new Date(i.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    )

    let score = 0
    recentInteractions.forEach((interaction) => {
      switch (interaction.type) {
        case "message_opened":
          score += 1
          break
        case "message_clicked":
          score += 2
          break
        case "order_placed":
          score += 5
          break
        case "review_left":
          score += 3
          break
        case "visit":
          score += 4
          break
      }
    })

    return Math.min(score, 100) // Cap at 100
  }

  private async updateSegmentCounts(): Promise<void> {
    for (const [segmentId, segment] of this.segments) {
      const contacts = await this.getContactsBySegment(segmentId)
      segment.contactCount = contacts.length
      segment.updatedAt = new Date().toISOString()
    }
  }

  // Management methods
  getContacts(): MessageRecipient[] {
    return Array.from(this.contacts.values())
  }

  getSegments(): ContactSegment[] {
    return Array.from(this.segments.values())
  }

  getLists(): ContactList[] {
    return Array.from(this.lists.values())
  }

  getContact(contactId: string): MessageRecipient | null {
    return this.contacts.get(contactId) || null
  }

  getSegment(segmentId: string): ContactSegment | null {
    return this.segments.get(segmentId) || null
  }

  getList(listId: string): ContactList | null {
    return this.lists.get(listId) || null
  }

  async searchContacts(query: string): Promise<MessageRecipient[]> {
    const searchTerm = query.toLowerCase()
    return Array.from(this.contacts.values()).filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.email?.toLowerCase().includes(searchTerm) ||
        contact.phone?.includes(searchTerm),
    )
  }

  getSystemStatus() {
    return {
      initialized: this.isInitialized,
      totalContacts: this.contacts.size,
      totalSegments: this.segments.size,
      totalLists: this.lists.size,
      totalInteractions: Array.from(this.interactions.values()).reduce(
        (sum, interactions) => sum + interactions.length,
        0,
      ),
    }
  }
}

export const contactManager = new ContactManager()
