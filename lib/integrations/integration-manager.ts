import type { IntegrationProvider, IntegrationConfig, SyncResult } from "./types"
import { createClient } from "@/lib/supabase/client"

export class IntegrationManager {
  private providers: Map<string, IntegrationProvider> = new Map()
  private configs: Map<string, IntegrationConfig> = new Map()
  private supabase = createClient()

  // Register a new integration provider
  registerProvider(provider: IntegrationProvider) {
    this.providers.set(provider.id, provider)
  }

  // Get available providers for a specific location
  getProvidersForLocation(country: string, city?: string): IntegrationProvider[] {
    return Array.from(this.providers.values()).filter((provider) => {
      const matchesCountry = provider.regions.includes(country)
      const matchesCity = !city || provider.cities.length === 0 || provider.cities.includes(city)
      return matchesCountry && matchesCity
    })
  }

  // Get providers by category
  getProvidersByCategory(category: string): IntegrationProvider[] {
    return Array.from(this.providers.values()).filter((provider) => provider.category === category)
  }

  // Connect an integration
  async connectIntegration(providerId: string, credentials: any): Promise<boolean> {
    const provider = this.providers.get(providerId)
    if (!provider) throw new Error(`Provider ${providerId} not found`)

    const success = await provider.authenticate(credentials)
    if (success) {
      const config: IntegrationConfig = {
        provider,
        credentials,
        status: "connected",
        lastSyncAt: new Date(),
        syncFrequency: 60, // Default 1 hour
        enabledDataTypes: ["restaurant_info", "menu", "orders", "customers", "reviews"],
        customSettings: {},
      }

      this.configs.set(providerId, config)

      // Save to database
      await this.saveIntegrationConfig(config)
    }

    return success
  }

  // Sync data from all connected integrations
  async syncAllIntegrations(): Promise<Record<string, SyncResult>> {
    const results: Record<string, SyncResult> = {}

    for (const [providerId, config] of this.configs.entries()) {
      if (config.status === "connected") {
        try {
          const result = await config.provider.syncData(config.enabledDataTypes)
          results[providerId] = result

          // Update last sync time
          config.lastSyncAt = new Date()
          await this.saveIntegrationConfig(config)
        } catch (error) {
          results[providerId] = {
            success: false,
            recordsProcessed: 0,
            errors: [error.message],
            lastSyncAt: new Date(),
          }
        }
      }
    }

    return results
  }

  // Save integration config to database
  private async saveIntegrationConfig(config: IntegrationConfig) {
    const { data, error } = await this.supabase.from("integrations").upsert({
      provider_id: config.provider.id,
      provider_name: config.provider.name,
      status: config.status,
      credentials: config.credentials,
      last_sync_at: config.lastSyncAt?.toISOString(),
      sync_frequency: config.syncFrequency,
      enabled_data_types: config.enabledDataTypes,
      custom_settings: config.customSettings,
    })

    if (error) {
      console.error("Failed to save integration config:", error)
      throw error
    }
  }

  // Load integration configs from database
  async loadIntegrationConfigs() {
    const { data, error } = await this.supabase.from("integrations").select("*")

    if (error) {
      console.error("Failed to load integration configs:", error)
      return
    }

    for (const row of data || []) {
      const provider = this.providers.get(row.provider_id)
      if (provider) {
        const config: IntegrationConfig = {
          provider,
          credentials: row.credentials,
          status: row.status,
          lastSyncAt: row.last_sync_at ? new Date(row.last_sync_at) : undefined,
          syncFrequency: row.sync_frequency,
          enabledDataTypes: row.enabled_data_types,
          customSettings: row.custom_settings || {},
        }
        this.configs.set(row.provider_id, config)
      }
    }
  }
}

// Global integration manager instance
export const integrationManager = new IntegrationManager()
