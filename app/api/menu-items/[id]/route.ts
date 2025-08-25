import { createSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseServerClient()

    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        category:categories(name),
        dietary_tags:menu_item_tags(dietary_tag:dietary_tags(name, color)),
        allergens:menu_item_allergens(allergen:allergens(name)),
        variants(*)
      `)
      .eq("id", params.id)
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseServerClient()
    const body = await request.json()
    const { dietary_tags, allergens, variants, ...menuItemData } = body

    const { data: menuItem, error: menuItemError } = await supabase
      .from("menu_items")
      .update(menuItemData)
      .eq("id", params.id)
      .select()
      .single()

    if (menuItemError) throw menuItemError

    if (dietary_tags !== undefined) {
      await supabase.from("menu_item_tags").delete().eq("menu_item_id", params.id)

      if (dietary_tags.length > 0) {
        const tagInserts = dietary_tags.map((tagName: string) => ({
          menu_item_id: params.id,
          dietary_tag_id: tagName,
        }))
        await supabase.from("menu_item_tags").insert(tagInserts)
      }
    }

    if (allergens !== undefined) {
      await supabase.from("menu_item_allergens").delete().eq("menu_item_id", params.id)

      if (allergens.length > 0) {
        const allergenInserts = allergens.map((allergenName: string) => ({
          menu_item_id: params.id,
          allergen_id: allergenName,
        }))
        await supabase.from("menu_item_allergens").insert(allergenInserts)
      }
    }

    return NextResponse.json({ data: menuItem })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.from("menu_items").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ message: "Menu item deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 })
  }
}
