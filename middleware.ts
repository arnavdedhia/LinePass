import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "./lib/adminAuth";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login", "/api/admin/logout"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (PUBLIC_ADMIN_PATHS.includes(pathname)) return NextResponse.next();
    if (await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next();
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Admin login required." }, { status: 401 });
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL("/pass/home", request.url));
}

export const config = {
  matcher: ["/", "/login", "/admin", "/admin/:path*", "/api/admin/:path*"]
};
