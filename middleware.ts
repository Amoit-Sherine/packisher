import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin routes (not the API — that checks the header itself)
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Allow the login POST action through
  if (pathname === "/admin/login") return NextResponse.next();

  const cookie = req.cookies.get("admin_auth")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || cookie !== adminPassword) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
