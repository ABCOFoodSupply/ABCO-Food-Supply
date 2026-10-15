import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exrgcryuyhkwpqsyciif.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const headers = () => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
});

/**
 * GET /api/products
 * Returns all products from Supabase. Optional ?category=slug, ?featured=true to filter.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  try {
    let url = `${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`;
    if (category && category !== "all") {
      url += `&category_slug=eq.${category}`;
    }
    if (featured === "true") {
      url += `&featured_on_homepage=eq.true`;
    }

    const res = await fetch(url, { headers: headers(), cache: "no-store" });
    if (res.ok) {
      const rows = await res.json();
      return NextResponse.json({ success: true, data: Array.isArray(rows) ? rows : [] });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (err) {
    console.error("[products GET]", err);
    return NextResponse.json({ success: true, data: [] });
  }
}

/**
 * POST /api/products
 * Creates or updates a product.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = {
      id: body.id || `prod-${Date.now()}`,
      name: body.name,
      category_slug: body.category_slug,
      category_name: body.category_name,
      image: body.image || "",
      origin: body.origin || "Saudi Arabia (Local)",
      storage_type: body.storage_type || "Ambient",
      moq: body.moq || "",
      packaging: body.packaging || "",
      shelf_life: body.shelf_life || "",
      certification: body.certification || "SFDA Compliant",
      description: body.description || "",
      specs: body.specs || {},
      featured_on_homepage: Boolean(body.featured_on_homepage ?? body.featured),
      created_at: new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
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
    console.error("[products POST]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

/**
 * PATCH /api/products
 * Quick toggle or update of product fields (e.g. featured_on_homepage)
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, featured_on_homepage } = body;
    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ featured_on_homepage: Boolean(featured_on_homepage) }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[products PATCH]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

/**
 * DELETE /api/products?id=xxx
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
      method: "DELETE",
      headers: headers(),
    });

    if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[products DELETE]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
