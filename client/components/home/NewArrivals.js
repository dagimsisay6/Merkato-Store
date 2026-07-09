import { ProductCard } from "@/components/store/ProductCard";
import { SectionHeader } from "./SectionHeader";

export function NewArrivals({ products = [] }) {
  return (
    <section className="bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <SectionHeader
          eyebrow="Just landed"
          title="New Arrivals"
          subtitle="Fresh from our trusted sellers."
          viewAll="/new-arrivals"
        />
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} p={p} ribbon="New" />
          ))}
        </div>
      </div>
    </section>
  );
}
