export interface CityData {
  city: string
  country: string
  region: "North America" | "Europe" | "Asia" | "South America" | "Africa" | "Oceania"
  currency: string
  timezone: string
  coordinates: [number, number] // [lat, lng]
}

export interface IntegrationAvailability {
  providerId: string
  name: string
  category: "pos" | "reviews" | "delivery" | "marketing" | "social" | "payments" | "reservations"
  popularity: number // 1-10 scale
  apiAvailable: boolean
  authType: "oauth2" | "api_key" | "basic_auth" | "webhook"
  documentation: string
}

// Top 50 cities globally with restaurant tech ecosystems
export const TOP_CITIES: CityData[] = [
  // North America
  {
    city: "New York",
    country: "United States",
    region: "North America",
    currency: "USD",
    timezone: "America/New_York",
    coordinates: [40.7128, -74.006],
  },
  {
    city: "Los Angeles",
    country: "United States",
    region: "North America",
    currency: "USD",
    timezone: "America/Los_Angeles",
    coordinates: [34.0522, -118.2437],
  },
  {
    city: "Chicago",
    country: "United States",
    region: "North America",
    currency: "USD",
    timezone: "America/Chicago",
    coordinates: [41.8781, -87.6298],
  },
  {
    city: "San Francisco",
    country: "United States",
    region: "North America",
    currency: "USD",
    timezone: "America/Los_Angeles",
    coordinates: [37.7749, -122.4194],
  },
  {
    city: "Toronto",
    country: "Canada",
    region: "North America",
    currency: "CAD",
    timezone: "America/Toronto",
    coordinates: [43.6532, -79.3832],
  },
  {
    city: "Vancouver",
    country: "Canada",
    region: "North America",
    currency: "CAD",
    timezone: "America/Vancouver",
    coordinates: [49.2827, -123.1207],
  },
  {
    city: "Mexico City",
    country: "Mexico",
    region: "North America",
    currency: "MXN",
    timezone: "America/Mexico_City",
    coordinates: [19.4326, -99.1332],
  },

  // Europe
  {
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    currency: "GBP",
    timezone: "Europe/London",
    coordinates: [51.5074, -0.1278],
  },
  {
    city: "Paris",
    country: "France",
    region: "Europe",
    currency: "EUR",
    timezone: "Europe/Paris",
    coordinates: [48.8566, 2.3522],
  },
  {
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    currency: "EUR",
    timezone: "Europe/Berlin",
    coordinates: [52.52, 13.405],
  },
  {
    city: "Madrid",
    country: "Spain",
    region: "Europe",
    currency: "EUR",
    timezone: "Europe/Madrid",
    coordinates: [40.4168, -3.7038],
  },
  {
    city: "Rome",
    country: "Italy",
    region: "Europe",
    currency: "EUR",
    timezone: "Europe/Rome",
    coordinates: [41.9028, 12.4964],
  },
  {
    city: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    currency: "EUR",
    timezone: "Europe/Amsterdam",
    coordinates: [52.3676, 4.9041],
  },
  {
    city: "Stockholm",
    country: "Sweden",
    region: "Europe",
    currency: "SEK",
    timezone: "Europe/Stockholm",
    coordinates: [59.3293, 18.0686],
  },
  {
    city: "Zurich",
    country: "Switzerland",
    region: "Europe",
    currency: "CHF",
    timezone: "Europe/Zurich",
    coordinates: [47.3769, 8.5417],
  },

  // Asia
  {
    city: "Tokyo",
    country: "Japan",
    region: "Asia",
    currency: "JPY",
    timezone: "Asia/Tokyo",
    coordinates: [35.6762, 139.6503],
  },
  {
    city: "Seoul",
    country: "South Korea",
    region: "Asia",
    currency: "KRW",
    timezone: "Asia/Seoul",
    coordinates: [37.5665, 126.978],
  },
  {
    city: "Singapore",
    country: "Singapore",
    region: "Asia",
    currency: "SGD",
    timezone: "Asia/Singapore",
    coordinates: [1.3521, 103.8198],
  },
  {
    city: "Hong Kong",
    country: "Hong Kong",
    region: "Asia",
    currency: "HKD",
    timezone: "Asia/Hong_Kong",
    coordinates: [22.3193, 114.1694],
  },
  {
    city: "Shanghai",
    country: "China",
    region: "Asia",
    currency: "CNY",
    timezone: "Asia/Shanghai",
    coordinates: [31.2304, 121.4737],
  },
  {
    city: "Beijing",
    country: "China",
    region: "Asia",
    currency: "CNY",
    timezone: "Asia/Shanghai",
    coordinates: [39.9042, 116.4074],
  },
  {
    city: "Mumbai",
    country: "India",
    region: "Asia",
    currency: "INR",
    timezone: "Asia/Kolkata",
    coordinates: [19.076, 72.8777],
  },
  {
    city: "Delhi",
    country: "India",
    region: "Asia",
    currency: "INR",
    timezone: "Asia/Kolkata",
    coordinates: [28.7041, 77.1025],
  },
  {
    city: "Bangalore",
    country: "India",
    region: "Asia",
    currency: "INR",
    timezone: "Asia/Kolkata",
    coordinates: [12.9716, 77.5946],
  },
  {
    city: "Bangkok",
    country: "Thailand",
    region: "Asia",
    currency: "THB",
    timezone: "Asia/Bangkok",
    coordinates: [13.7563, 100.5018],
  },
  {
    city: "Jakarta",
    country: "Indonesia",
    region: "Asia",
    currency: "IDR",
    timezone: "Asia/Jakarta",
    coordinates: [-6.2088, 106.8456],
  },
  {
    city: "Manila",
    country: "Philippines",
    region: "Asia",
    currency: "PHP",
    timezone: "Asia/Manila",
    coordinates: [14.5995, 120.9842],
  },
  {
    city: "Kuala Lumpur",
    country: "Malaysia",
    region: "Asia",
    currency: "MYR",
    timezone: "Asia/Kuala_Lumpur",
    coordinates: [3.139, 101.6869],
  },

  // Oceania
  {
    city: "Sydney",
    country: "Australia",
    region: "Oceania",
    currency: "AUD",
    timezone: "Australia/Sydney",
    coordinates: [-33.8688, 151.2093],
  },
  {
    city: "Melbourne",
    country: "Australia",
    region: "Oceania",
    currency: "AUD",
    timezone: "Australia/Melbourne",
    coordinates: [-37.8136, 144.9631],
  },
  {
    city: "Auckland",
    country: "New Zealand",
    region: "Oceania",
    currency: "NZD",
    timezone: "Pacific/Auckland",
    coordinates: [-36.8485, 174.7633],
  },

  // South America
  {
    city: "São Paulo",
    country: "Brazil",
    region: "South America",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    coordinates: [-23.5505, -46.6333],
  },
  {
    city: "Rio de Janeiro",
    country: "Brazil",
    region: "South America",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    coordinates: [-22.9068, -43.1729],
  },
  {
    city: "Buenos Aires",
    country: "Argentina",
    region: "South America",
    currency: "ARS",
    timezone: "America/Argentina/Buenos_Aires",
    coordinates: [-34.6118, -58.396],
  },
  {
    city: "Lima",
    country: "Peru",
    region: "South America",
    currency: "PEN",
    timezone: "America/Lima",
    coordinates: [-12.0464, -77.0428],
  },
  {
    city: "Bogotá",
    country: "Colombia",
    region: "South America",
    currency: "COP",
    timezone: "America/Bogota",
    coordinates: [4.711, -74.0721],
  },

  // Africa
  {
    city: "Cape Town",
    country: "South Africa",
    region: "Africa",
    currency: "ZAR",
    timezone: "Africa/Johannesburg",
    coordinates: [-33.9249, 18.4241],
  },
  {
    city: "Lagos",
    country: "Nigeria",
    region: "Africa",
    currency: "NGN",
    timezone: "Africa/Lagos",
    coordinates: [6.5244, 3.3792],
  },
  {
    city: "Cairo",
    country: "Egypt",
    region: "Africa",
    currency: "EGP",
    timezone: "Africa/Cairo",
    coordinates: [30.0444, 31.2357],
  },

  // Additional major cities
  {
    city: "Dubai",
    country: "UAE",
    region: "Asia",
    currency: "AED",
    timezone: "Asia/Dubai",
    coordinates: [25.2048, 55.2708],
  },
  {
    city: "Tel Aviv",
    country: "Israel",
    region: "Asia",
    currency: "ILS",
    timezone: "Asia/Jerusalem",
    coordinates: [32.0853, 34.7818],
  },
  {
    city: "Istanbul",
    country: "Turkey",
    region: "Europe",
    currency: "TRY",
    timezone: "Europe/Istanbul",
    coordinates: [41.0082, 28.9784],
  },
  {
    city: "Moscow",
    country: "Russia",
    region: "Europe",
    currency: "RUB",
    timezone: "Europe/Moscow",
    coordinates: [55.7558, 37.6176],
  },
  {
    city: "Warsaw",
    country: "Poland",
    region: "Europe",
    currency: "PLN",
    timezone: "Europe/Warsaw",
    coordinates: [52.2297, 21.0122],
  },
  {
    city: "Prague",
    country: "Czech Republic",
    region: "Europe",
    currency: "CZK",
    timezone: "Europe/Prague",
    coordinates: [50.0755, 14.4378],
  },
  {
    city: "Vienna",
    country: "Austria",
    region: "Europe",
    currency: "EUR",
    timezone: "Europe/Vienna",
    coordinates: [48.2082, 16.3738],
  },
  {
    city: "Brussels",
    country: "Belgium",
    region: "Europe",
    currency: "EUR",
    timezone: "Europe/Brussels",
    coordinates: [50.8503, 4.3517],
  },
  {
    city: "Copenhagen",
    country: "Denmark",
    region: "Europe",
    currency: "DKK",
    timezone: "Europe/Copenhagen",
    coordinates: [55.6761, 12.5683],
  },
  {
    city: "Oslo",
    country: "Norway",
    region: "Europe",
    currency: "NOK",
    timezone: "Europe/Oslo",
    coordinates: [59.9139, 10.7522],
  },
  {
    city: "Helsinki",
    country: "Finland",
    region: "Europe",
    currency: "EUR",
    timezone: "Europe/Helsinki",
    coordinates: [60.1699, 24.9384],
  },
  {
    city: "Lisbon",
    country: "Portugal",
    region: "Europe",
    currency: "EUR",
    timezone: "Europe/Lisbon",
    coordinates: [38.7223, -9.1393],
  },
  {
    city: "Athens",
    country: "Greece",
    region: "Europe",
    currency: "EUR",
    timezone: "Europe/Athens",
    coordinates: [37.9838, 23.7275],
  },
]

// Integration availability matrix by location
export const INTEGRATION_MATRIX: Record<string, IntegrationAvailability[]> = {
  // North America
  "United States": [
    // POS Systems
    {
      providerId: "square",
      name: "Square",
      category: "pos",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.squareup.com/",
    },
    {
      providerId: "toast",
      name: "Toast",
      category: "pos",
      popularity: 9,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://doc.toasttab.com/",
    },
    {
      providerId: "clover",
      name: "Clover",
      category: "pos",
      popularity: 8,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://docs.clover.com/",
    },
    {
      providerId: "lightspeed",
      name: "Lightspeed",
      category: "pos",
      popularity: 7,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.lightspeedhq.com/",
    },

    // Reviews
    {
      providerId: "yelp",
      name: "Yelp",
      category: "reviews",
      popularity: 10,
      apiAvailable: true,
      authType: "api_key",
      documentation: "https://www.yelp.com/developers",
    },
    {
      providerId: "google_reviews",
      name: "Google Reviews",
      category: "reviews",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.google.com/my-business",
    },
    {
      providerId: "tripadvisor",
      name: "TripAdvisor",
      category: "reviews",
      popularity: 8,
      apiAvailable: true,
      authType: "api_key",
      documentation: "https://developer-tripadvisor.com/",
    },

    // Delivery
    {
      providerId: "doordash",
      name: "DoorDash",
      category: "delivery",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.doordash.com/",
    },
    {
      providerId: "ubereats",
      name: "Uber Eats",
      category: "delivery",
      popularity: 9,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.uber.com/",
    },
    {
      providerId: "grubhub",
      name: "Grubhub",
      category: "delivery",
      popularity: 8,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.grubhub.com/",
    },

    // Marketing
    {
      providerId: "mailchimp",
      name: "Mailchimp",
      category: "marketing",
      popularity: 9,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://mailchimp.com/developer/",
    },
    {
      providerId: "facebook",
      name: "Facebook",
      category: "social",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.facebook.com/",
    },
    {
      providerId: "instagram",
      name: "Instagram",
      category: "social",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.facebook.com/docs/instagram-api",
    },

    // Reservations
    {
      providerId: "opentable",
      name: "OpenTable",
      category: "reservations",
      popularity: 9,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://platform.opentable.com/",
    },
    {
      providerId: "resy",
      name: "Resy",
      category: "reservations",
      popularity: 7,
      apiAvailable: true,
      authType: "api_key",
      documentation: "https://resy.com/api-docs",
    },
  ],

  Canada: [
    // POS Systems
    {
      providerId: "square",
      name: "Square",
      category: "pos",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.squareup.com/",
    },
    {
      providerId: "lightspeed",
      name: "Lightspeed",
      category: "pos",
      popularity: 9,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.lightspeedhq.com/",
    },
    {
      providerId: "moneris",
      name: "Moneris",
      category: "pos",
      popularity: 8,
      apiAvailable: true,
      authType: "api_key",
      documentation: "https://developer.moneris.com/",
    },

    // Reviews & Delivery (similar to US but with regional differences)
    {
      providerId: "google_reviews",
      name: "Google Reviews",
      category: "reviews",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.google.com/my-business",
    },
    {
      providerId: "ubereats",
      name: "Uber Eats",
      category: "delivery",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.uber.com/",
    },
    {
      providerId: "doordash",
      name: "DoorDash",
      category: "delivery",
      popularity: 8,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.doordash.com/",
    },
    {
      providerId: "skipthedishes",
      name: "Skip The Dishes",
      category: "delivery",
      popularity: 9,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.skipthedishes.com/",
    },
  ],

  // Europe
  "United Kingdom": [
    // POS Systems
    {
      providerId: "square",
      name: "Square",
      category: "pos",
      popularity: 9,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.squareup.com/",
    },
    {
      providerId: "sumup",
      name: "SumUp",
      category: "pos",
      popularity: 8,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.sumup.com/",
    },
    {
      providerId: "zettle",
      name: "Zettle",
      category: "pos",
      popularity: 7,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.zettle.com/",
    },

    // Reviews
    {
      providerId: "google_reviews",
      name: "Google Reviews",
      category: "reviews",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.google.com/my-business",
    },
    {
      providerId: "tripadvisor",
      name: "TripAdvisor",
      category: "reviews",
      popularity: 9,
      apiAvailable: true,
      authType: "api_key",
      documentation: "https://developer-tripadvisor.com/",
    },
    {
      providerId: "trustpilot",
      name: "Trustpilot",
      category: "reviews",
      popularity: 8,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.trustpilot.com/",
    },

    // Delivery
    {
      providerId: "deliveroo",
      name: "Deliveroo",
      category: "delivery",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.deliveroo.com/",
    },
    {
      providerId: "ubereats",
      name: "Uber Eats",
      category: "delivery",
      popularity: 9,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.uber.com/",
    },
    {
      providerId: "justeat",
      name: "Just Eat",
      category: "delivery",
      popularity: 8,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.just-eat.com/",
    },
  ],

  Germany: [
    {
      providerId: "sumup",
      name: "SumUp",
      category: "pos",
      popularity: 9,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.sumup.com/",
    },
    {
      providerId: "google_reviews",
      name: "Google Reviews",
      category: "reviews",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.google.com/my-business",
    },
    {
      providerId: "deliveroo",
      name: "Deliveroo",
      category: "delivery",
      popularity: 8,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.deliveroo.com/",
    },
    {
      providerId: "lieferando",
      name: "Lieferando",
      category: "delivery",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.lieferando.de/",
    },
  ],

  // Asia
  India: [
    // POS Systems
    {
      providerId: "razorpay",
      name: "Razorpay POS",
      category: "pos",
      popularity: 9,
      apiAvailable: true,
      authType: "api_key",
      documentation: "https://razorpay.com/docs/",
    },
    {
      providerId: "paytm",
      name: "Paytm",
      category: "pos",
      popularity: 8,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.paytm.com/",
    },

    // Reviews & Delivery
    {
      providerId: "zomato",
      name: "Zomato",
      category: "reviews",
      popularity: 10,
      apiAvailable: true,
      authType: "api_key",
      documentation: "https://developers.zomato.com/",
    },
    {
      providerId: "swiggy",
      name: "Swiggy",
      category: "delivery",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.swiggy.com/",
    },
    {
      providerId: "google_reviews",
      name: "Google Reviews",
      category: "reviews",
      popularity: 9,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.google.com/my-business",
    },
  ],

  Singapore: [
    {
      providerId: "grab",
      name: "GrabFood",
      category: "delivery",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developer.grab.com/",
    },
    {
      providerId: "foodpanda",
      name: "Foodpanda",
      category: "delivery",
      popularity: 9,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.foodpanda.com/",
    },
    {
      providerId: "google_reviews",
      name: "Google Reviews",
      category: "reviews",
      popularity: 10,
      apiAvailable: true,
      authType: "oauth2",
      documentation: "https://developers.google.com/my-business",
    },
  ],

  // Add more countries as needed...
}

export class LocationIntegrationService {
  // Get integrations available for a specific city
  static getIntegrationsForCity(city: string): IntegrationAvailability[] {
    const cityData = TOP_CITIES.find((c) => c.city === city)
    if (!cityData) return []

    return INTEGRATION_MATRIX[cityData.country] || []
  }

  // Get integrations by category for a location
  static getIntegrationsByCategory(
    city: string,
    category: "pos" | "reviews" | "delivery" | "marketing" | "social" | "payments" | "reservations",
  ): IntegrationAvailability[] {
    const integrations = this.getIntegrationsForCity(city)
    return integrations.filter((integration) => integration.category === category)
  }

  // Get most popular integrations for a location
  static getPopularIntegrations(city: string, limit = 5): IntegrationAvailability[] {
    const integrations = this.getIntegrationsForCity(city)
    return integrations.sort((a, b) => b.popularity - a.popularity).slice(0, limit)
  }

  // Auto-detect location and return relevant integrations
  static async getIntegrationsForCurrentLocation(): Promise<IntegrationAvailability[]> {
    try {
      // Try to get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { latitude, longitude } = position.coords

      // Find closest city
      const closestCity = this.findClosestCity(latitude, longitude)
      if (closestCity) {
        return this.getIntegrationsForCity(closestCity.city)
      }
    } catch (error) {
      console.warn("Could not get user location:", error)
    }

    // Fallback to IP-based location or default
    return this.getIntegrationsForCity("New York") // Default fallback
  }

  // Find closest city based on coordinates
  private static findClosestCity(lat: number, lng: number): CityData | null {
    let closestCity: CityData | null = null
    let minDistance = Number.POSITIVE_INFINITY

    for (const city of TOP_CITIES) {
      const distance = this.calculateDistance(lat, lng, city.coordinates[0], city.coordinates[1])
      if (distance < minDistance) {
        minDistance = distance
        closestCity = city
      }
    }

    return closestCity
  }

  // Calculate distance between two coordinates (Haversine formula)
  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
}
