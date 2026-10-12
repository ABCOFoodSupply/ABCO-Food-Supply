import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exrgcryuyhkwpqsyciif.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const headers = () => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
});

const DEFAULT_GALLERY = [
  {
    id: "gal-1",
    title: "Jubail Logistics Hub & Fleet Staging",
    category: "warehouse",
    category_label: "Warehousing & Facilities",
    image: "/categories/about-us.png",
    caption: "Our central Jubail warehousing complex featuring multi-temperature loading docks and dedicated refrigerated delivery fleet staging area.",
    location: "Jubail Industrial City, KSA",
    sort_order: 1,
    show_on_homepage: true,
  },
  {
    id: "gal-2",
    title: "Saudi Supermarket Food Distribution",
    category: "network",
    category_label: "Retail & Client Network",
    image: "/categories/hero.png",
    caption: "Direct supply and shelf fulfillment of dry goods, edible oils, grains, and beverages to premier hypermarkets across the Kingdom.",
    location: "Eastern Province & Riyadh",
    sort_order: 2,
    show_on_homepage: true,
  },
  {
    id: "gal-3",
    title: "SFDA Certified Quality Inspection Lab",
    category: "quality",
    category_label: "Quality & Compliance",
    image: "/categories/mix-product.png",
    caption: "In-house temperature validation, barcode tracing, and SFDA batch clearance protocol verification for institutional food safety.",
    location: "AFS Central Depot, Jubail",
    sort_order: 3,
    show_on_homepage: true,
  },
  {
    id: "gal-4",
    title: "Multi-Zone Refrigerated Fleet Delivery",
    category: "fleet",
    category_label: "Logistics Fleet",
    image: "/categories/rice-and-grains.png",
    caption: "State-of-the-art GPS temperature-tracked reefer trucks maintaining unbroken -18°C and +4°C cold chain across all regional highway arteries.",
    location: "Kingdom-Wide Distribution",
    sort_order: 4,
    show_on_homepage: true,
  },
];

/**
 * While the gallery_items table is empty, the site shows DEFAULT_GALLERY. Before the first
 * admin write, save those defaults to the table so edits/deletes stick and adding one new
 * image doesn't make the other defaults disappear.
 */
async function ensureSeeded() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/gallery_items?select=id&limit=1`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) return;
  const rows = await res.json();
  if (Array.isArray(rows) && rows.length > 0) return;

  const now = new Date().toISOString();
  await fetch(`${SUPABASE_URL}/rest/v1/gallery_items`, {
    method: "POST",
    headers: { ...headers(), Prefer: "resolution=ignore-duplicates" },
    body: JSON.stringify(DEFAULT_GALLERY.map((g) => ({ ...g, created_at: now }))),
  });
}

/**
 * GET /api/gallery - Fetch gallery images
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const homepageOnly = searchParams.get("homepage") === "true";

    let url = `${SUPABASE_URL}/rest/v1/gallery_items?select=*&order=sort_order.asc`;
    if (category && category !== "all") {
      url += `&category=eq.${category}`;
    }

    const res = await fetch(url, { headers: headers(), cache: "no-store" });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        // Filter here (not in SQL) so a saved gallery where nothing is picked returns [] instead of the defaults
        const data = homepageOnly ? rows.filter((r: { show_on_homepage?: boolean }) => r.show_on_homepage !== false) : rows;
        return NextResponse.json({ success: true, data });
      }
    }

    const filtered = category && category !== "all"
      ? DEFAULT_GALLERY.filter((g) => g.category === category)
      : DEFAULT_GALLERY;

    return NextResponse.json({ success: true, data: filtered, isFallback: true });
  } catch (err) {
    console.error("[gallery GET]", err);
    return NextResponse.json({ success: true, data: DEFAULT_GALLERY, isFallback: true });
  }
}

/**
 * POST /api/gallery - Add or update a gallery photo
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await ensureSeeded();

    const payload = {
      id: body.id || `gal-${Date.now()}`,
      title: body.title,
      category: body.category || "warehouse",
      category_label: body.category_label || body.categoryLabel || "Warehousing & Facilities",
      image: body.image,
      caption: body.caption || "",
      location: body.location || "Jubail Industrial City, KSA",
      sort_order: body.sort_order || body.sortOrder || 99,
      show_on_homepage: body.show_on_homepage ?? true,
      created_at: new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/gallery_items`, {
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
    console.error("[gallery POST]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

/**
 * PATCH /api/gallery - Update fields of an existing gallery photo ({ id, ...fields })
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    await ensureSeeded();

    const updates: Record<string, unknown> = {};
    for (const key of ["title", "image", "caption", "location", "category", "category_label", "sort_order", "show_on_homepage"]) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/gallery_items?id=eq.${encodeURIComponent(body.id)}`, {
      method: "PATCH",
      headers: { ...headers(), Prefer: "return=representation" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error(await res.text());
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ success: false, error: "Gallery item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("[gallery PATCH]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

/**
 * DELETE /api/gallery?id=xxx
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await ensureSeeded();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/gallery_items?id=eq.${id}`, {
      method: "DELETE",
      headers: headers(),
    });

    if (!res.ok) throw new Error("Delete failed");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[gallery DELETE]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
