import { SITE_SECTIONS_TAG } from "./siteSections";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exrgcryuyhkwpqsyciif.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabaseHeaders = () => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
});

export const SITE_SECTIONS_ENDPOINT = `${SUPABASE_URL}/rest/v1/site_sections`;

/**
 * Stored section overrides keyed by section id. Cached by Next and purged via
 * revalidateTag(SITE_SECTIONS_TAG) when the admin saves, so pages render the
 * saved copy on first paint. Any failure (e.g. table missing) yields {} = defaults.
 */
export async function getStoredSiteSections(
  init: RequestInit & { next?: { tags?: string[]; revalidate?: number } } = { next: { tags: [SITE_SECTIONS_TAG] } }
): Promise<Record<string, unknown>> {
  try {
    const res = await fetch(`${SITE_SECTIONS_ENDPOINT}?select=id,data`, { headers: supabaseHeaders(), ...init });
    if (!res.ok) return {};
    const rows = await res.json();
    if (!Array.isArray(rows)) return {};
    return Object.fromEntries(rows.map((r: { id: string; data: unknown }) => [r.id, r.data]));
  } catch {
    return {};
  }
}
