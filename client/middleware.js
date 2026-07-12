import { NextResponse } from "next/server";

// Routes only customers can access
const CUSTOMER_ROUTES = [
  "/account",
  "/cart",
  "/checkout",
  "/order-success",
  "/order-failed",
];

// Routes only admins can access
const ADMIN_ROUTES = ["/admin-dashboard"];

export function middleware(req) {
  const token = req.cookies.get("merkato.token")?.value;
  const role  = req.cookies.get("merkato.role")?.value;
  const { pathname } = req.nextUrl;

  const isAdminRoute    = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isCustomerRoute = CUSTOMER_ROUTES.some((r) => pathname.startsWith(r));

  // ── Admin routes ──────────────────────────────────────────
  if (isAdminRoute) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (role !== "admin") {
      // Authenticated customer trying to access admin — send home
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ── Customer routes ───────────────────────────────────────
  if (isCustomerRoute) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (role === "admin") {
      // Admin trying to access customer area — send to admin dashboard
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/account/:path*",
    "/account",
    "/cart",
    "/checkout/:path*",
    "/order-success",
    "/order-failed",
  ],
};
