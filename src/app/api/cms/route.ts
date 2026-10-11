import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_HOMEPAGE_CMS, HomePageCmsData } from "@/lib/cmsData";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exrgcryuyhkwpqsyciif.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * GET /api/cms - Reads homepage CMS data from Supabase DB
 */
export async function GET() {
  try {
    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    };

    // Parallel fetch from Supabase tables
    const [heroRes, catRes, partnerRes] = await Promise.allSettled([
      fetch(`${SUPABASE_URL}/rest/v1/homepage_hero?id=eq.default_hero&select=*`, { headers, cache: "no-store" }),
      fetch(`${SUPABASE_URL}/rest/v1/categories?show_on_homepage=eq.true&select=*&order=sort_order.asc`, { headers, cache: "no-store" }),
      fetch(`${SUPABASE_URL}/rest/v1/clients_partners?select=*&order=sort_order.asc`, { headers, cache: "no-store" }),
    ]);

    let heroData = DEFAULT_HOMEPAGE_CMS.hero;
    let categoriesData = DEFAULT_HOMEPAGE_CMS.quickCategories;
    let partnersData = DEFAULT_HOMEPAGE_CMS.clientsPartners;

    // Parse Hero row
    if (heroRes.status === "fulfilled" && heroRes.value.ok) {
      const rows = await heroRes.value.json();
      if (rows && rows.length > 0) {
        const row = rows[0];
        heroData = {
          badgeText: row.badge_text || heroData.badgeText,
          titleLine1: row.title_line1 || heroData.titleLine1,
          titleHighlight: row.title_highlight || heroData.titleHighlight,
          subtitle: row.subtitle || heroData.subtitle,
          heroImage: row.hero_image || heroData.heroImage,
          mobileHeroImage: row.hero_image || heroData.mobileHeroImage,
          button1Text: row.button1_text || heroData.button1Text,
          button1Link: row.button1_link || heroData.button1Link,
          button2Text: row.button2_text || heroData.button2Text,
          button2Link: row.button2_link || heroData.button2Link,
          features: DEFAULT_HOMEPAGE_CMS.hero.features,
        };
      }
    }

    // Parse Categories rows
    if (catRes.status === "fulfilled" && catRes.value.ok) {
      const rows = await catRes.value.json();
      if (rows && rows.length > 0) {
        categoriesData = rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          image: r.image,
        }));
      }
    }

    // Parse Partners rows
    if (partnerRes.status === "fulfilled" && partnerRes.value.ok) {
      const rows = await partnerRes.value.json();
      if (rows && rows.length > 0) {
        partnersData = rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          image: r.image,
          type: r.type,
          location: r.location,
        }));
      }
    }

    return NextResponse.json({
      success: true,
      fromDb: true,
      data: {
        hero: heroData,
        quickCategories: categoriesData,
        clientsPartners: partnersData,
      },
    });
  } catch (err: unknown) {
    console.warn("Database fetch fallback:", err);
    return NextResponse.json({
      success: true,
      fromDb: false,
      data: DEFAULT_HOMEPAGE_CMS,
    });
  }
}

/**
 * POST /api/cms - Saves and syncs homepage CMS data in Supabase DB
 */
export async function POST(req: NextRequest) {
  try {
    const body: HomePageCmsData = await req.json();
    const { hero, quickCategories, clientsPartners } = body;

    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    };

    // 1. Upsert Hero in Supabase
    if (hero) {
      const heroPayload = {
        id: "default_hero",
        badge_text: hero.badgeText,
        title_line1: hero.titleLine1,
        title_highlight: hero.titleHighlight,
        subtitle: hero.subtitle,
        hero_image: hero.heroImage,
        button1_text: hero.button1Text,
        button1_link: hero.button1Link,
        button2_text: hero.button2Text,
        button2_link: hero.button2Link,
        updated_at: new Date().toISOString(),
      };

      await fetch(`${SUPABASE_URL}/rest/v1/homepage_hero`, {
        method: "POST",
        headers,
        body: JSON.stringify(heroPayload),
      });
    }

    // 2. Sync Categories (Clear old set and re-insert current list to guarantee deletes persist)
    if (quickCategories && Array.isArray(quickCategories)) {
      // First delete all rows in quick_categories
      await fetch(`${SUPABASE_URL}/rest/v1/quick_categories?id=neq.placeholder_nonexistent`, {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });

      // Insert current active categories
      if (quickCategories.length > 0) {
        const catPayloads = quickCategories.map((c, i) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image: c.image,
          sort_order: i + 1,
        }));

        await fetch(`${SUPABASE_URL}/rest/v1/quick_categories`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(catPayloads),
        });
      }
    }

    // 3. Sync Partners (Clear old set and re-insert current list to guarantee deletes persist)
    if (clientsPartners && Array.isArray(clientsPartners)) {
      // Delete all rows in clients_partners
      await fetch(`${SUPABASE_URL}/rest/v1/clients_partners?id=neq.placeholder_nonexistent`, {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });

      // Insert current active partners
      if (clientsPartners.length > 0) {
        const partnerPayloads = clientsPartners.map((p, i) => ({
          id: p.id,
          name: p.name,
          image: p.image,
          type: p.type || "Retail Partner",
          location: p.location || "KSA",
          sort_order: i + 1,
        }));

        await fetch(`${SUPABASE_URL}/rest/v1/clients_partners`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(partnerPayloads),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Homepage CMS data successfully persisted and synchronized in Supabase DB",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error saving to database";
    console.error("Database save exception:", err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

/**
 * DELETE /api/cms - Deletes a specific category or partner directly from Supabase DB
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "category" or "partner"
    const id = searchParams.get("id");

    if (!id || !type) {
      return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
    }

    const table = type === "category" ? "categories" : "clients_partners";
    const deleteRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${id} from ${table}`,
      status: deleteRes.status,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error deleting from database";
    console.error("Database delete exception:", err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
