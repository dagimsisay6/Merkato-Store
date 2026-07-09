import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import pFashion from "@/assets/p-fashion.jpg";
import { PRODUCTS } from "@/lib/store-data";
import { ProductCard } from "@/components/store/ProductCard";
import { SectionHeader } from "./SectionHeader";

export function Featured() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <SectionHeader
        eyebrow="Hand-picked"
        title="Featured this week"
        subtitle="Editor's selection across categories."
        viewAll="/products"
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <Link
          href="/categories/fashion"
          className="group relative col-span-1 overflow-hidden rounded-3xl bg-card shadow-(--shadow-soft) lg:col-span-2 lg:row-span-2"
        >
          <div className="aspect-4/3 w-full overflow-hidden lg:aspect-auto lg:h-full">
            <Image
              src={pFashion}
              alt="Royal Ankara Collection"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-primary-foreground">
            <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase text-gold-foreground">
              Editor&apos;s pick
            </span>
            <h3 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Royal Ankara Collection
            </h3>
            <p className="mt-2 max-w-lg text-sm text-primary-foreground/85">
              Bold prints, handcrafted heritage. From $59.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition group-hover:bg-gold group-hover:text-gold-foreground">
              Shop collection <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
        <ProductCard p={PRODUCTS[1]} />
        <ProductCard p={PRODUCTS[3]} />
      </div>
    </section>
  );
}
