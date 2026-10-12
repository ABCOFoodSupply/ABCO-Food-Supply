import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { SECTION_IDS, SITE_SECTIONS_TAG, type SectionId } from "@/lib/siteSections";
import { getStoredSiteSections, supabaseHeaders, SITE_SECTIONS_ENDPOINT } from "@/lib/siteSectionsServer";

/**
 * GET /api/sections - Stored homepage section content ({ [sectionId]: data })
 */
export async function GET() {
  const data = await getStoredSiteSections({ cache: "no-store" });
  return NextResponse.json({ success: true, data });
}

/**
 * POST /api/sections - Upsert section content: { sections: { [sectionId]: data } }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sections: Record<string, unknown> = body?.sections || {};
    const now = new Date().toISOString();

    const rows = Object.entries(sections)
      .filter(([id, data]) => SECTION_IDS.includes(id as SectionId) && data && typeof data === "object")
      .map(([id, data]) => ({ id, data, updated_at: now }));

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "No valid sections to save" }, { status: 400 });
    }

    const res = await fetch(SITE_SECTIONS_ENDPOINT, {
      method: "POST",
      headers: { ...supabaseHeaders(), Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify(rows),
    });

    if (!res.ok) {
      const errText = await res.text();
      const missingTable = errText.includes("site_sections") && (res.status === 404 || errText.includes("PGRST205"));
      return NextResponse.json(
        {
          success: false,
          error: missingTable
            ? "The site_sections table does not exist yet in Supabase."
            : `Database rejected the save: ${errText.slice(0, 200)}`,
        },
        { status: 500 }
      );
    }

    revalidateTag(SITE_SECTIONS_TAG);
    return NextResponse.json({ success: true, saved: rows.map((r) => r.id) });
  } catch (err) {
    console.error("[sections POST]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
