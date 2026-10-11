import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware: Protect all /admin/* routes.
 * Anyone without the `afs_admin_token` HTTP-only cookie is redirected to /admin/login.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page and the auth API through unconditionally
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/auth")
  ) {
    return NextResponse.next();
  }

  // For all other /admin routes, require the cookie
  const token = req.cookies.get("afs_admin_token")?.value;

  if (!token || token !== "authenticated") {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    // Preserve the originally requested URL so we can redirect back after login if needed
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all /admin paths except static files
  matcher: ["/admin", "/admin/:path*"],
};
