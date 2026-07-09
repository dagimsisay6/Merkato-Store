import { PageHeader } from "@/components/store/PageHeader";
import { ProductCard } from "@/components/store/ProductCard";
import { bestSellers } from "@/lib/store-data";

export const metadata = { title: "Best Sellers — Merkato Store" };

export default function BestSellersPage() {
  const list = bestSellers();
  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Best Sellers" }]}
        eyebrow="Loved by thousands"
        title="Best Sellers"
        subtitle="What our community keeps coming back for."
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {list.map((p, i) => (
            <ProductCard
              key={p.id}
              p={p}
              ribbon={i < 3 ? `#${i + 1}` : "Best Seller"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

