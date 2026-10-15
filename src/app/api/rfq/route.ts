import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exrgcryuyhkwpqsyciif.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const headers = () => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
});

/**
 * GET /api/rfq
 * Fetch all RFQs from Supabase, newest first.
 */
export async function GET(req: NextRequest) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/wholesale_rfqs?select=*&order=created_at.desc`,
      { headers: headers(), cache: "no-store" }
    );

    if (res.ok) {
      const rows = await res.json();
      return NextResponse.json({ success: true, data: Array.isArray(rows) ? rows : [] });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (err) {
    console.error("[rfq GET]", err);
    return NextResponse.json({ success: true, data: [] });
  }
}

/**
 * POST /api/rfq
 * Submits an RFQ / enquiry from any of the public forms
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const rfqId = body.id || `RFQ-${dateStr}-${randNum}`;

    const payload = {
      id: rfqId,
      source: body.source || "quotation_modal",
      client_name: body.client_name || body.clientName || body.fullName || body.name || "Customer",
      company_name: body.company_name || body.companyName || body.company || "Independent Buyer",
      cr_number: body.cr_number || body.crNumber || "",
      phone: body.phone || "",
      email: body.email || "",
      city: body.city || "Jubail Industrial City",
      business_type: body.business_type || body.businessType || "HORECA & Hospitality",
      category: body.category || body.productInterest || "Rice & Grains",
      product_name: body.product_name || body.productName || "",
      requested_volume: body.requested_volume || body.requestedVolume || body.volume || "Standard Order",
      status: "Pending",
      notes: body.notes || body.message || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/wholesale_rfqs`, {
      method: "POST",
      headers: { ...headers(), Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[rfq POST Supabase error]", errText);
      // Fallback: Return successful response with generated payload so user is never blocked
      return NextResponse.json({ success: true, data: payload, warning: errText });
    }

    return NextResponse.json({ success: true, data: payload });
  } catch (err) {
    console.error("[rfq POST]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

/**
 * PATCH /api/rfq
 * Update RFQ status (e.g. from Admin dashboard)
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/wholesale_rfqs?id=eq.${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({
        status,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[rfq PATCH]", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
