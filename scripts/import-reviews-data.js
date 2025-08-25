// Import sample reviews data from multiple platforms
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const RESTAURANT_ID = "550e8400-e29b-41d4-a716-446655440000" // Sample restaurant ID

// Sample reviews data from different platforms
const sampleReviews = [
  // Google My Business Reviews
  {
    platform: "google",
    platform_review_id: "google_001",
    customer_name: "Sarah Johnson",
    rating: 5,
    review_text:
      "Absolutely amazing experience! The pasta was perfectly cooked and the service was exceptional. The ambiance is cozy and romantic. Will definitely be back!",
    review_date: "2024-01-15T19:30:00Z",
    response_text:
      "Thank you so much Sarah! We're thrilled you enjoyed your evening with us. Looking forward to welcoming you back soon!",
    response_date: "2024-01-16T10:15:00Z",
    sentiment: "positive",
    sentiment_score: 0.92,
    keywords: ["amazing", "pasta", "service", "cozy", "romantic"],
    helpful_count: 12,
    verified_purchase: true,
  },
  {
    platform: "google",
    platform_review_id: "google_002",
    customer_name: "Mike Chen",
    rating: 4,
    review_text:
      "Great food and atmosphere. The pizza was delicious, though service was a bit slow during peak hours. Overall a good experience.",
    review_date: "2024-01-10T20:45:00Z",
    sentiment: "positive",
    sentiment_score: 0.65,
    keywords: ["great", "food", "pizza", "delicious", "slow service"],
    helpful_count: 8,
    verified_purchase: true,
  },

  // Yelp Reviews
  {
    platform: "yelp",
    platform_review_id: "yelp_001",
    customer_name: "Jennifer R.",
    rating: 5,
    review_text:
      "This place is a hidden gem! The chef clearly knows what they're doing. Every dish was perfectly seasoned and beautifully presented. The wine selection is also impressive.",
    review_date: "2024-01-08T18:20:00Z",
    response_text:
      "Thank you Jennifer! Chef Marco will be delighted to hear your feedback. We take great pride in our wine selection too!",
    response_date: "2024-01-09T09:30:00Z",
    sentiment: "positive",
    sentiment_score: 0.88,
    keywords: ["hidden gem", "chef", "seasoned", "wine selection"],
    helpful_count: 15,
    verified_purchase: false,
  },
  {
    platform: "yelp",
    platform_review_id: "yelp_002",
    customer_name: "David L.",
    rating: 3,
    review_text:
      "Food was okay, nothing special. The prices are a bit high for what you get. Service was friendly but inattentive at times.",
    review_date: "2024-01-05T19:15:00Z",
    sentiment: "neutral",
    sentiment_score: 0.15,
    keywords: ["okay", "prices high", "friendly", "inattentive"],
    helpful_count: 3,
    verified_purchase: true,
  },

  // Zomato Reviews
  {
    platform: "zomato",
    platform_review_id: "zomato_001",
    customer_name: "Priya Sharma",
    rating: 4,
    review_text:
      "Lovely Italian restaurant with authentic flavors. The tiramisu was to die for! Staff was very accommodating with dietary restrictions.",
    review_date: "2024-01-12T21:00:00Z",
    sentiment: "positive",
    sentiment_score: 0.78,
    keywords: ["lovely", "authentic", "tiramisu", "accommodating", "dietary"],
    helpful_count: 6,
    verified_purchase: true,
  },
  {
    platform: "zomato",
    platform_review_id: "zomato_002",
    customer_name: "Alex Thompson",
    rating: 2,
    review_text:
      "Disappointed with our visit. Food took forever to arrive and when it did, it was lukewarm. The pasta was overcooked. Not worth the money.",
    review_date: "2024-01-03T20:30:00Z",
    response_text:
      "We sincerely apologize for your poor experience Alex. This is not the standard we strive for. Please contact us directly so we can make this right.",
    response_date: "2024-01-04T11:45:00Z",
    sentiment: "negative",
    sentiment_score: -0.72,
    keywords: ["disappointed", "forever", "lukewarm", "overcooked", "not worth"],
    helpful_count: 4,
    verified_purchase: true,
  },
]

async function importReviewsData() {
  console.log("🚀 Starting reviews data import...")

  try {
    // Insert sample reviews
    console.log("📝 Importing reviews...")
    const reviewsToInsert = sampleReviews.map((review) => ({
      ...review,
      restaurant_id: RESTAURANT_ID,
    }))

    const { data: reviewsData, error: reviewsError } = await supabase.from("reviews").insert(reviewsToInsert).select()

    if (reviewsError) {
      console.error("❌ Error inserting reviews:", reviewsError)
      return
    }

    console.log(`✅ Successfully imported ${reviewsData.length} reviews`)

    // Calculate and insert analytics data
    console.log("📊 Calculating review analytics...")

    const platforms = ["google", "yelp", "zomato"]

    for (const platform of platforms) {
      const platformReviews = sampleReviews.filter((r) => r.platform === platform)

      if (platformReviews.length === 0) continue

      const totalReviews = platformReviews.length
      const averageRating = platformReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews

      const ratingCounts = {
        five_star: platformReviews.filter((r) => r.rating === 5).length,
        four_star: platformReviews.filter((r) => r.rating === 4).length,
        three_star: platformReviews.filter((r) => r.rating === 3).length,
        two_star: platformReviews.filter((r) => r.rating === 2).length,
        one_star: platformReviews.filter((r) => r.rating === 1).length,
      }

      const sentimentCounts = {
        positive: platformReviews.filter((r) => r.sentiment === "positive").length,
        neutral: platformReviews.filter((r) => r.sentiment === "neutral").length,
        negative: platformReviews.filter((r) => r.sentiment === "negative").length,
      }

      const responseRate = (platformReviews.filter((r) => r.response_text).length / totalReviews) * 100
      const lastReviewDate = Math.max(...platformReviews.map((r) => new Date(r.review_date).getTime()))

      const analyticsData = {
        restaurant_id: RESTAURANT_ID,
        platform: platform,
        total_reviews: totalReviews,
        average_rating: Number.parseFloat(averageRating.toFixed(2)),
        five_star_count: ratingCounts.five_star,
        four_star_count: ratingCounts.four_star,
        three_star_count: ratingCounts.three_star,
        two_star_count: ratingCounts.two_star,
        one_star_count: ratingCounts.one_star,
        positive_sentiment_count: sentimentCounts.positive,
        neutral_sentiment_count: sentimentCounts.neutral,
        negative_sentiment_count: sentimentCounts.negative,
        response_rate: Number.parseFloat(responseRate.toFixed(2)),
        last_review_date: new Date(lastReviewDate).toISOString(),
      }

      const { error: analyticsError } = await supabase
        .from("review_analytics")
        .upsert(analyticsData, { onConflict: "restaurant_id,platform" })

      if (analyticsError) {
        console.error(`❌ Error inserting analytics for ${platform}:`, analyticsError)
      } else {
        console.log(
          `✅ Analytics calculated for ${platform}: ${totalReviews} reviews, ${averageRating.toFixed(1)} avg rating`,
        )
      }
    }

    console.log("🎉 Reviews data import completed successfully!")

    // Log summary
    const totalImported = reviewsData.length
    const avgRating = sampleReviews.reduce((sum, r) => sum + r.rating, 0) / sampleReviews.length
    const positiveCount = sampleReviews.filter((r) => r.sentiment === "positive").length

    console.log("\n📈 Import Summary:")
    console.log(`Total Reviews: ${totalImported}`)
    console.log(`Average Rating: ${avgRating.toFixed(1)}/5`)
    console.log(
      `Positive Reviews: ${positiveCount}/${totalImported} (${((positiveCount / totalImported) * 100).toFixed(1)}%)`,
    )
    console.log(
      `Platforms: Google (${sampleReviews.filter((r) => r.platform === "google").length}), Yelp (${sampleReviews.filter((r) => r.platform === "yelp").length}), Zomato (${sampleReviews.filter((r) => r.platform === "zomato").length})`,
    )
  } catch (error) {
    console.error("❌ Unexpected error during import:", error)
  }
}

// Run the import
importReviewsData()
