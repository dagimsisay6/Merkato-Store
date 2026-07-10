import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("merkato.token")?.value;
  const role  = req.cookies.get("merkato.role")?.value;

  if (req.nextUrl.pathname.startsWith("/admin-dashboard")) {
    if (!token || role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-dashboard/:path*"],
};
