import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    // Read from env — server-side only, never exposed to client
    const allowedEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const allowedPassword = (process.env.ADMIN_PASSWORD || "").trim();
    const adminName = (process.env.ADMIN_NAME || "AFS Administrator").trim();
    const adminRole = (process.env.ADMIN_ROLE || "super_admin").trim();

    if (!allowedEmail || !allowedPassword) {
      return NextResponse.json(
        { success: false, error: "Server misconfiguration: admin credentials not set." },
        { status: 500 }
      );
    }

    if (cleanEmail === allowedEmail && cleanPassword === allowedPassword) {
      const admin = {
        id: "admin-master-001",
        email: allowedEmail,
        name: adminName,
        role: adminRole,
        lastLogin: new Date().toISOString(),
      };

      const response = NextResponse.json({ success: true, admin });

      // Set HTTP-only cookie — not accessible from JS, checked by middleware
      response.cookies.set("afs_admin_token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8, // 8 hours
      });

      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Authentication failed." }, { status: 500 });
  }
}
