import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  const protectedPrefixes = ["/dashboard", "/admin", "/vendor", "/user", "/reports", "/transactions"];
  if (!protectedPrefixes.some((prefix) => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const role = token.role as "ADMIN" | "USER" | "VENDOR" | undefined;
  if (!role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (path.startsWith("/vendor") && role !== "VENDOR") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (path.startsWith("/user") && role !== "USER") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if ((path.startsWith("/reports") || path.startsWith("/transactions")) && !["ADMIN", "USER"].includes(role)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/vendor/:path*", "/user/:path*", "/reports/:path*", "/transactions/:path*"]
};
