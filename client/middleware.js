import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("merkato.token")?.value;
  const role  = req.cookies.get("merkato.role")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin-dashboard")) {
    if (!token || role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/account")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-dashboard/:path*", "/account/:path*", "/account"],
};
