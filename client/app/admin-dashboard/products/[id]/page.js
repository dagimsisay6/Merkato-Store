"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const EMPTY = {
  name: "", brand: "", description: "", price: "", original_price: "",
  stock: "", category_id: "", is_featured: false, is_new_arrival: false, is_best_seller: false,
};

export default function AdminProductForm({ params }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("merkato.token") : null;

  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const catRes = await fetch(`${BASE}/categories`);
        const catData = await catRes.json();
        setCategories(catData.categories ?? []);

        if (!isNew) {
          const res = await fetch(`${BASE}/products?limit=1`);
          // fetch by id via slug workaround — get from list
          const allRes = await fetch(`${BASE}/products?limit=200`);
          const allData = await allRes.json();
          const product = allData.products?.find((p) => String(p.id) === id);
          if (product) {
            setForm({
              name: product.name ?? "",
              brand: product.brand ?? "",
              description: product.description ?? "",
              price: product.price ?? "",
              original_price: product.original_price ?? "",
              stock: product.stock ?? "",
              category_id: product.category_id ?? "",
              is_featured: product.is_featured ?? false,
              is_new_arrival: product.is_new_arrival ?? false,
              is_best_seller: product.is_best_seller ?? false,
            });
          }
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [id, isNew]);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const body = { ...form, slug, price: Number(form.price), original_price: Number(form.original_price) || null, stock: Number(form.stock), category_id: Number(form.category_id) };

      const res = await fetch(`${BASE}/products${isNew ? "" : `/${id}`}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      router.push("/admin-dashboard/products");
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin-dashboard/products" className="grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-secondary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-2xl font-extrabold">{isNew ? "Add Product" : "Edit Product"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-(--shadow-soft)">
        {error && <p className="rounded-xl bg-ember/10 px-4 py-3 text-sm font-medium text-ember">{error}</p>}

        {[
          { label: "Product Name", key: "name", required: true },
          { label: "Brand", key: "brand", required: true },
          { label: "Price ($)", key: "price", type: "number", required: true },
          { label: "Original Price ($)", key: "original_price", type: "number" },
          { label: "Stock", key: "stock", type: "number", required: true },
        ].map(({ label, key, type = "text", required }) => (
          <div key={key}>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
            <input
              type={type}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              required={required}
              className="h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ))}

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
          <select
            value={form.category_id}
            onChange={(e) => set("category_id", e.target.value)}
            required
            className="h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm outline-none focus:border-primary"
          >
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
            rows={4}
            className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-5">
          {[
            { key: "is_featured", label: "Featured" },
            { key: "is_new_arrival", label: "New Arrival" },
            { key: "is_best_seller", label: "Best Seller" },
          ].map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="accent-primary" />
              {label}
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : isNew ? "Create Product" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
