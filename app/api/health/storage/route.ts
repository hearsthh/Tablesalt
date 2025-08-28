import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check storage services availability
    const storageServices = {
      supabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      aws_s3: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
      google_cloud: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
    }

    const availableServices = Object.values(storageServices).filter(Boolean).length

    return NextResponse.json({
      ok: availableServices > 0,
      timestamp: new Date().toISOString(),
      status: `${availableServices} storage service(s) configured`,
      services: storageServices,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    )
  }
}
