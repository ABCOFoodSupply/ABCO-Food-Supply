import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_SUBCATEGORIES, type SubCategoryItem } from "@/data/subcategories";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exrgcryuyhkwpqsyciif.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const headers = () => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
});

/**
 * GET /api/subcategories?category=rice-and-grains
 * Returns subcategories for a given category (or all if omitted).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_sections?id=eq.categorySubcategories&select=data`,
      { headers: headers(), cache: "no-store" }
    );

    let map = { ...DEFAULT_SUBCATEGORIES };

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0 && rows[0].data) {
        map = { ...map, ...rows[0].data };
      }
    }

    if (category) {
      const list = map[category] || [];
      return NextResponse.json({ success: true, data: list, category });
    }

    return NextResponse.json({ success: true, data: map });
  } catch (err) {
    console.error("[subcategories GET]", err);
    if (category) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_SUBCATEGORIES[category] || [],
        category,
        isFallback: true,
      });
    }
    return NextResponse.json({ success: true, data: DEFAULT_SUBCATEGORIES, isFallback: true });
  }
}

/**
 * POST /api/subcategories
 * Body: { categorySlug: string, subcategories: SubCategoryItem[] }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { categorySlug, subcategories } = body;

    if (!categorySlug || !Array.isArray(subcategories)) {
      return NextResponse.json(
        { success: false, error: "Missing categorySlug or subcategories array" },
        { status: 400 }
      );
    }

    // 1. Fetch current map
    let currentMap: Record<string, SubCategoryItem[]> = { ...DEFAULT_SUBCATEGORIES };
    const fetchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/site_sections?id=eq.categorySubcategories&select=data`,
      { headers: headers(), cache: "no-store" }
    );
    if (fetchRes.ok) {
      const rows = await fetchRes.json();
      if (Array.isArray(rows) && rows[0]?.data) {
        currentMap = { ...currentMap, ...rows[0].data };
      }
    }

    // 2. Update category
    currentMap[categorySlug] = subcategories;

    // 3. Upsert
    const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/site_sections`, {
      method: "POST",
      headers: { ...headers(), Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({
        id: "categorySubcategories",
        data: currentMap,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!upsertRes.ok) {
      const errText = await upsertRes.text();
      throw new Error(errText);
    }

    return NextResponse.json({ success: true, data: subcategories });
  } catch (err) {
    console.error("[subcategories POST]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
