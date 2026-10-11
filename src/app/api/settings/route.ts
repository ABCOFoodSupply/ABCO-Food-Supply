import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exrgcryuyhkwpqsyciif.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const headers = () => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
});

const DEFAULT_SETTINGS = {
  id: "default_settings",
  company_name: "ABCO Food Supply (AFS)",
  cr_number: "2050123456",
  sfda_number: "SFDA-FS-2026-9918",
  email: "abcofoodsupply@gmail.com",
  phone: "+966 50 123 4567",
  whatsapp: "+966 50 123 4567",
  address: "Jubail Industrial City, Support Services Area 1, Eastern Province, KSA",
  cold_capacity: "18,500 m³ (-18°C to +4°C)",
  fleet_count: "45 GPS Temperature-Monitored Reefer Units",
};

/**
 * GET /api/settings - Fetch global company settings
 */
export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/company_settings?id=eq.default_settings&select=*`,
      { headers: headers(), cache: "no-store" }
    );

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json({ success: true, data: rows[0] });
      }
    }

    return NextResponse.json({ success: true, data: DEFAULT_SETTINGS });
  } catch (err) {
    console.error("[settings GET]", err);
    return NextResponse.json({ success: true, data: DEFAULT_SETTINGS });
  }
}

/**
 * POST /api/settings - Upsert global company settings
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const payload = {
      id: "default_settings",
      company_name: body.company_name || body.companyName || DEFAULT_SETTINGS.company_name,
      cr_number: body.cr_number || body.crNumber || DEFAULT_SETTINGS.cr_number,
      sfda_number: body.sfda_number || body.sfdaNumber || DEFAULT_SETTINGS.sfda_number,
      email: body.email || DEFAULT_SETTINGS.email,
      phone: body.phone || DEFAULT_SETTINGS.phone,
      whatsapp: body.whatsapp || DEFAULT_SETTINGS.whatsapp,
      address: body.address || DEFAULT_SETTINGS.address,
      cold_capacity: body.cold_capacity || body.coldCapacity || DEFAULT_SETTINGS.cold_capacity,
      fleet_count: body.fleet_count || body.fleetCount || DEFAULT_SETTINGS.fleet_count,
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/company_settings`, {
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
    console.error("[settings POST]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
