import { NextRequest, NextResponse } from "next/server";
import { CATEGORIES } from "@/data/products";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exrgcryuyhkwpqsyciif.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const headers = () => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
});

/**
 * GET /api/categories
 * Returns all categories from single unified 'categories' Supabase table.
 * Supports optional ?homepage=true to fetch only homepage-featured categories.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const onlyHomepage = searchParams.get("homepage") === "true";

  try {
    let url = `${SUPABASE_URL}/rest/v1/categories?select=*&order=sort_order.asc`;
    if (onlyHomepage) {
      url += `&show_on_homepage=eq.true`;
    }

    const res = await fetch(url, { headers: headers(), cache: "no-store" });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json({ success: true, data: rows });
      }
    }

    // Fallback seed categories if table is newly created / empty
    const initialSeed = CATEGORIES.map((c, i) => ({
      id: `cat-${c.slug}`,
      name: c.name,
      slug: c.slug,
      image: c.image,
      description: c.shortDesc,
      show_on_homepage: i < 6, // First 6 default to homepage strip
      sort_order: i + 1,
    }));

    const result = onlyHomepage
      ? initialSeed.filter((c) => c.show_on_homepage)
      : initialSeed;

    return NextResponse.json({ success: true, data: result, isFallback: true });
  } catch (err) {
    console.error("[categories GET]", err);
    const initialSeed = CATEGORIES.map((c, i) => ({
      id: `cat-${c.slug}`,
      name: c.name,
      slug: c.slug,
      image: c.image,
      description: c.shortDesc,
      show_on_homepage: i < 6,
      sort_order: i + 1,
    }));
    const result = onlyHomepage
      ? initialSeed.filter((c) => c.show_on_homepage)
      : initialSeed;
    return NextResponse.json({ success: true, data: result, isFallback: true });
  }
}

/**
 * POST /api/categories
 * Creates or updates a category in the unified 'categories' table.
 * Body: { id?, name, slug, image, description, show_on_homepage, sort_order? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = {
      ...(body.id ? { id: body.id } : { id: `cat-${Date.now()}` }),
      name: body.name,
      slug: body.slug,
      image: body.image,
      description: body.description || "",
      show_on_homepage: body.show_on_homepage ?? false,
      sort_order: body.sort_order ?? 99,
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
      method: "POST",
      headers: { ...headers(), Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    return NextResponse.json({ success: true, data: payload });
  } catch (err) {
    console.error("[categories POST]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

/**
 * PATCH /api/categories
 * Updates specific fields on a category (e.g., toggle show_on_homepage).
 * Body: { id, ...updates }
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/categories?id=eq.${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
    });

    if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[categories PATCH]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

/**
 * DELETE /api/categories?id=xxx
 * Deletes a category by id from the unified 'categories' table.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/categories?id=eq.${id}`, {
      method: "DELETE",
      headers: headers(),
    });

    if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[categories DELETE]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
