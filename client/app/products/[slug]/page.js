"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star, Heart, Truck, ShieldCheck, RotateCcw,
  Plus, Minus, Share2, Check, Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/store/PageHeader";
import { ProductCard } from "@/components/store/ProductCard";
import { useCart, useWishlist, useAuth } from "@/lib/store-context";
import { useToast } from "@/components/ui/toast";
import { getProductBySlug, getRelatedProducts } from "@/lib/api";

const fmt = (n) => `$${Number(n).toFixed(2)}`;

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const cart = useCart();
  const wish = useWishlist();
  const { isLoggedIn } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  useEffect(() => {
    setLoading(true);
    getProductBySlug(slug).then((d) => {
      if (!d?.product) { router.replace("/not-found"); return; }
      setProduct(d.product);
      setLoading(false);
      getRelatedProducts(d.product.id, d.product.category_slug ?? d.product.categorySlug)
        .then((r) => setRelated(r?.products ?? []));
    });
  }, [slug]);

  const guardedAddToCart = () => {
    if (!isLoggedIn) { toast({ message: "Please sign in to add items to your cart.", type: "info" }); return; }
    cart.add(product.id, qty);
    toast({ message: `${product.name} added to cart.`, type: "success" });
  };

  const guardedBuyNow = () => {
    if (!isLoggedIn) { toast({ message: "Please sign in to continue.", type: "info" }); return; }
    cart.buyNow(product.id, qty);
    router.push("/checkout/shipping");
  };

  const guardedWishlist = () => {
    if (!isLoggedIn) { toast({ message: "Please sign in to save items to your wishlist.", type: "info" }); return; }
    wish.toggle(product.id);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const originalPrice = product.original_price ?? product.original;
  const discount = originalPrice
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;
  const inStock = product.stock === null || product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5 ? product.stock : null;

  return (
    <div>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.category_name ?? product.category, href: `/categories/${product.category_slug ?? product.categorySlug}` },
          { label: product.name },
        ]}
        title={product.name}
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden rounded-3xl bg-card shadow-(--shadow-soft)">
              <img
                src={images[activeImg] || null}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`overflow-hidden rounded-xl border-2 bg-card transition ${
                      i === activeImg ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={src} alt="" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={`/categories/${product.category_slug ?? product.categorySlug}`}
                className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
              >
                {product.category_name ?? product.category}
              </Link>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs font-semibold text-muted-foreground">{product.brand}</span>
            </div>

            <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />
                ))}
                <span className="ml-1 font-semibold">{Number(product.rating).toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({(product.review_count ?? product.reviews ?? 0).toLocaleString()} reviews)
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-4xl font-extrabold text-accent">{fmt(product.price)}</span>
              {originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{fmt(originalPrice)}</span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-gold-foreground">
                  Save {discount}%
                </span>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-foreground/80">{product.description}</p>

            <div className="mt-4">
              {lowStock ? (
                <span className="inline-flex rounded-full bg-ember/10 px-3 py-1.5 text-xs font-bold text-ember">
                  ⚡ Only {lowStock} left in stock
                </span>
              ) : inStock ? (
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                  ✓ In Stock
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-border bg-card">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-foreground">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">Free shipping on orders over $50</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={guardedAddToCart}
                disabled={!inStock}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow disabled:opacity-50 sm:flex-none sm:px-8"
              >
                Add to Cart
              </button>
              <button
                onClick={guardedBuyNow}
                disabled={!inStock}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90 disabled:opacity-50 sm:flex-none sm:px-8"
              >
                Buy Now
              </button>
              <button
                onClick={guardedWishlist}
                aria-label="Wishlist"
                className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card transition hover:bg-secondary"
              >
                <Heart className={`h-5 w-5 ${wish.has(product.id) ? "fill-accent text-accent" : ""}`} />
              </button>
              <button
                aria-label="Share"
                onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card transition hover:bg-secondary"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-secondary/40 p-5 sm:grid-cols-3">
              <Bullet icon={Truck} title="Fast delivery" desc="48h in major cities" />
              <Bullet icon={ShieldCheck} title="Secure checkout" desc="Cards & mobile money" />
              <Bullet icon={RotateCcw} title="Easy returns" desc="14 days, no questions" />
            </div>

            {product.features?.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Key features</p>
                <ul className="mt-3 space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-6 border-b border-border">
            {["description", "specs", "reviews"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 text-sm font-semibold capitalize transition ${
                  tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "specs" ? "Specifications" : t}
              </button>
            ))}
          </div>
          <div className="mt-6">
            {tab === "description" && (
              <p className="max-w-3xl leading-relaxed text-foreground/85">{product.description}</p>
            )}
            {tab === "specs" && (
              <dl className="grid max-w-2xl gap-3 sm:grid-cols-2">
                {product.features?.map((f) => (
                  <div key={f} className="rounded-xl border border-border bg-card p-4">
                    <dt className="text-xs font-bold uppercase text-muted-foreground">Feature</dt>
                    <dd className="mt-1 text-sm font-medium">{f}</dd>
                  </div>
                ))}
              </dl>
            )}
            {tab === "reviews" && (
              <p className="text-sm text-muted-foreground">No reviews yet for this product.</p>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">You may also like</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Bullet({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
