import { integrationManager } from "./integration-manager"
import { ALL_PROVIDERS } from "./providers"

// Initialize and register all integration providers
export function initializeIntegrations() {
  console.log("[v0] Initializing integration providers...")

  for (const ProviderClass of ALL_PROVIDERS) {
    const provider = new ProviderClass()
    integrationManager.registerProvider(provider)
    console.log(`[v0] Registered provider: ${provider.name}`)
  }

  // Load existing configurations from database
  integrationManager.loadIntegrationConfigs()

  console.log("[v0] Integration system initialized")
}

// Helper function to get GMB provider specifically
export function getGoogleMyBusinessProvider() {
  return integrationManager["providers"].get("google_my_business")
}
