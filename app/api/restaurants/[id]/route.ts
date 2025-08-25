import { createSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase.from("restaurants").select("*").eq("id", params.id).single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = createSupabaseServerClient()

    const { data, error } = await supabase.from("restaurants").update(body).eq("id", params.id).select().single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update restaurant" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.from("restaurants").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ message: "Restaurant deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete restaurant" }, { status: 500 })
  }
}
