import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store-context";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { ToastProvider } from "@/components/ui/toast";
import { ConditionalShell } from "@/components/store/ConditionalShell";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Merkato Store",
  description:
    "Shop electronics, fashion, beauty and more across Africa and the Middle East.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <ToastProvider>
            <ConditionalShell>
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
            </ConditionalShell>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

