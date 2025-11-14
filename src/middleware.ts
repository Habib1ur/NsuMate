import { NextRequest, NextResponse } from "next/server";

// Lightweight middleware: only checks that a session cookie exists
// for protected paths. Detailed auth (including admin role) is
// enforced inside server components and API routes.
const AUTH_PATHS = ["/dashboard", "/onboarding", "/matches", "/messages", "/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("nsumate_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/matches/:path*", "/messages/:path*", "/admin/:path*"]
};

