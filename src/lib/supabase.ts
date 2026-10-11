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

// Default super admin credentials for login
export const DEFAULT_ADMIN_CREDENTIALS = {
  email: "admin@abcofoodsupply.com",
  password: "AdminPassword2026!",
  name: "AFS Jubail Headquarters",
  role: "super_admin" as const,
};

// Accepted administrative passwords for convenience
export const ACCEPTED_PASSWORDS = [
  "AdminPassword2026!",
  "Abcofood@0302",
  "admin123",
];

/**
 * Direct Admin Credentials Authentication (No external Supabase Auth required)
 */
export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  // Allow admin@abcofoodsupply.com, admin@afs.sa, or simply 'admin'
  const isEmailMatch =
    cleanEmail === "admin@abcofoodsupply.com" ||
    cleanEmail === "admin@afs.sa" ||
    cleanEmail === "admin";

  const isPasswordMatch = ACCEPTED_PASSWORDS.includes(cleanPassword);

  if (isEmailMatch && isPasswordMatch) {
    return {
      id: "admin-master-001",
      email: DEFAULT_ADMIN_CREDENTIALS.email,
      name: DEFAULT_ADMIN_CREDENTIALS.name,
      role: DEFAULT_ADMIN_CREDENTIALS.role,
      lastLogin: new Date().toISOString(),
    };
  }

  return null;
}
