import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if AI services are available
    const aiServices = {
      groq: !!process.env.GROQ_API_KEY,
      grok: !!process.env.XAI_API_KEY,
      fal: !!process.env.FAL_KEY,
      deepinfra: !!process.env.DEEPINFRA_API_KEY,
    }

    const availableServices = Object.values(aiServices).filter(Boolean).length
    const totalServices = Object.keys(aiServices).length

    return NextResponse.json({
      ok: availableServices > 0,
      timestamp: new Date().toISOString(),
      status: `${availableServices}/${totalServices} AI services configured`,
      services: aiServices,
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
