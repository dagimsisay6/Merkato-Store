import Image from "next/image";
import { Smartphone, Apple, Play } from "lucide-react";
import appMockup from "@/assets/app-mockup.jpg";

export function AppPromo() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <div className="relative grid items-center gap-8 overflow-hidden rounded-[2.5rem] gradient-primary p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
        <div className="absolute inset-0 kente-pattern opacity-30" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
        <div className="relative text-primary-foreground">
          <span className="inline-flex items-center gap-2 rounded-full glass-dark px-3 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <Smartphone className="h-3.5 w-3.5 text-gold" /> Merkato Mobile
          </span>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Shop smarter from your pocket.
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/85">
            Get app-only deals, faster checkout, mobile money, and real-time order tracking.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-2xl bg-ink px-5 py-3 text-primary-foreground transition hover:bg-ink/80"
            >
              <Apple className="h-7 w-7" />
              <span className="text-left">
                <span className="block text-[10px] uppercase opacity-70">Download on</span>
                <span className="block text-base font-semibold leading-tight">App Store</span>
              </span>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-2xl bg-ink px-5 py-3 text-primary-foreground transition hover:bg-ink/80"
            >
              <Play className="h-7 w-7" />
              <span className="text-left">
                <span className="block text-[10px] uppercase opacity-70">Get it on</span>
                <span className="block text-base font-semibold leading-tight">Google Play</span>
              </span>
            </a>
          </div>
        </div>
        <div className="relative">
          <Image
            src={appMockup}
            alt="Merkato Store mobile app"
            width={500}
            height={600}
            className="mx-auto w-full max-w-md rounded-[2rem] shadow-(--shadow-elegant)"
          />
        </div>
      </div>
    </section>
  );
}

