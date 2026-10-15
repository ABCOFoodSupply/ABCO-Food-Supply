/**
 * Supabase client and backend integration helper for ABCO Food Supply (AFS).
 * Connects to Supabase REST and Auth endpoints using credentials from .env.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exrgcryuyhkwpqsyciif.supabase.co";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "procurement_manager" | "sales_manager";
  lastLogin: string;
}

/**
 * Direct Admin Credentials Authentication — credentials loaded from .env
 * ADMIN_EMAILS_ALLOWED and ADMIN_PASSWORDS_ALLOWED are comma-separated lists.
 */
export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  // Read allowed values from env (server-side only — never NEXT_PUBLIC_)
  const allowedEmails = (process.env.ADMIN_EMAILS_ALLOWED || process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const allowedPasswords = (process.env.ADMIN_PASSWORDS_ALLOWED || process.env.ADMIN_PASSWORD || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const adminEmail = (process.env.ADMIN_EMAIL || "").trim();
  const adminName = (process.env.ADMIN_NAME || "AFS Administrator").trim();
  const adminRole = (process.env.ADMIN_ROLE || "super_admin").trim() as AdminUser["role"];

  const isEmailMatch = allowedEmails.includes(cleanEmail);
  const isPasswordMatch = allowedPasswords.includes(cleanPassword);

  if (isEmailMatch && isPasswordMatch) {
    return {
      id: "admin-master-001",
      email: adminEmail,
      name: adminName,
      role: adminRole,
      lastLogin: new Date().toISOString(),
    };
  }

  return null;
}
