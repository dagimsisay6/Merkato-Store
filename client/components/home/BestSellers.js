import { ProductCard } from "@/components/store/ProductCard";
import { SectionHeader } from "./SectionHeader";

export function BestSellers({ products = [] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <SectionHeader
        eyebrow="Loved by thousands"
        title="Best Sellers"
        subtitle="The products our community can't get enough of."
        viewAll="/best-sellers"
      />
      <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} ribbon="Best Seller" />
        ))}
      </div>
    </section>
  );
}
