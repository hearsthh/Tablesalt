import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurant_id")
    const categoryId = searchParams.get("category_id")

    let query = supabase
      .from("menu_items")
      .select(`
        *,
        category:categories(name),
        dietary_tags:menu_item_tags(dietary_tag:dietary_tags(name, color)),
        allergens:menu_item_allergens(allergen:allergens(name)),
        variants(*)
      `)
      .order("display_order", { ascending: true })

    if (restaurantId) {
      query = query.eq("restaurant_id", restaurantId)
    }
    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const body = await request.json()
    const { dietary_tags, allergens, variants, ...menuItemData } = body

    // Insert menu item
    const { data: menuItem, error: menuItemError } = await supabase
      .from("menu_items")
      .insert([menuItemData])
      .select()
      .single()

    if (menuItemError) throw menuItemError

    // Insert dietary tags if provided
    if (dietary_tags && dietary_tags.length > 0) {
      const tagInserts = dietary_tags.map((tagName: string) => ({
        menu_item_id: menuItem.id,
        dietary_tag_id: tagName, // Assuming tagName is actually the ID
      }))

      await supabase.from("menu_item_tags").insert(tagInserts)
    }

    // Insert allergens if provided
    if (allergens && allergens.length > 0) {
      const allergenInserts = allergens.map((allergenName: string) => ({
        menu_item_id: menuItem.id,
        allergen_id: allergenName, // Assuming allergenName is actually the ID
      }))

      await supabase.from("menu_item_allergens").insert(allergenInserts)
    }

    // Insert variants if provided
    if (variants && variants.length > 0) {
      const variantInserts = variants.map((variant: any) => ({
        ...variant,
        menu_item_id: menuItem.id,
      }))

      await supabase.from("variants").insert(variantInserts)
    }

    return NextResponse.json({ data: menuItem })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 })
  }
}
