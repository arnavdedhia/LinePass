import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const loggedIn = request.cookies.has("linepass_user_id");
  const { pathname } = request.nextUrl;

  if (loggedIn) return NextResponse.redirect(new URL("/pass/home", request.url));
  if (pathname === "/") return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"]
};
