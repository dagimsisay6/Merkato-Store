"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function ConditionalShell({ children }) {
  const path = usePathname();
  const isAdmin = path.startsWith("/admin-dashboard");

  return (
    <>
      {!isAdmin && <SiteHeader />}
      {children}
      {!isAdmin && <SiteFooter />}
    </>
  );
}
