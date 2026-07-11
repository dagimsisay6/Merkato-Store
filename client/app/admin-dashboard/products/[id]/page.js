"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, ImagePlus, X, AlertCircle,
  Tag, Package, DollarSign, Layers, FileText, Hash,
  Loader2, CheckCircle,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const EMPTY = {
  name: "", brand: "", description: "", price: "",
  original_price: "", stock: "", category_id: "",
  features: "", tags: "",
  is_featured: false, is_new_arrival: false, is_best_seller: false,
};

export default function AdminProductForm({ params }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("merkato.token") : null;
  const fileRef = useRef(null);

  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]); // string[] of URLs
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const catRes = await fetch(`${BASE}/categories`);
        const catData = await catRes.json();
        setCategories(catData.categories ?? []);

        if (!isNew) {
          const res = await fetch(`${BASE}/products/by-ids?ids=${id}`);
          const data = await res.json();
          const p = data.products?.[0];
          if (p) {
            setForm({
              name: p.name ?? "",
              brand: p.brand ?? "",
              description: p.description ?? "",
              price: p.price ?? "",
              original_price: p.original_price ?? "",
              stock: p.stock ?? "",
              category_id: p.category_id ?? "",
              features: (p.features ?? []).join(", "),
              tags: (p.tags ?? []).join(", "),
              is_featured: p.is_featured ?? false,
              is_new_arrival: p.is_new_arrival ?? false,
              is_best_seller: p.is_best_seller ?? false,
            });
            setImages(p.images ?? []);
          }
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [id, isNew]);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    if (fieldErrors[key]) setFieldErrors((p) => ({ ...p, [key]: "" }));
  }

  // ── Image upload ──────────────────────────────────────
  async function handleImageFiles(files) {
    if (!files?.length) return;
    setUploading(true);
    const uploaded = [];
    for (const file of Array.from(files)) {
      try {
        const base64 = await toBase64(file);
        const res = await fetch(`${BASE}/products/upload-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ data: base64, filename: file.name }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        uploaded.push(data.url);
      } catch (err) {
        setError(`Image upload failed: ${err.message}`);
      }
    }
    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  }

  function removeImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  // ── Validation ────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required.";
    if (!form.brand.trim()) e.brand = "Brand is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = "Enter a valid price.";
    if (form.original_price && (isNaN(Number(form.original_price)) || Number(form.original_price) <= 0)) e.original_price = "Enter a valid original price.";
    if (form.stock === "" || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = "Enter a valid stock quantity.";
    if (!form.category_id) e.category_id = "Please select a category.";
    if (images.length === 0) e.images = "Add at least one product image.";
    return e;
  }

  // ── Submit ────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setSaving(true);
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const body = {
        ...form,
        slug,
        price: Number(form.price),
        original_price: Number(form.original_price) || null,
        stock: Number(form.stock),
        category_id: Number(form.category_id),
        images,
        features: form.features ? form.features.split(",").map((s) => s.trim()).filter(Boolean) : [],
        tags: form.tags ? form.tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };

      const res = await fetch(`${BASE}/products${isNew ? "" : `/${id}`}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setSuccess(isNew ? "Product created successfully!" : "Product updated successfully!");
      setTimeout(() => router.push("/admin-dashboard/products"), 1200);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin-dashboard/products" className="grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-secondary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-2xl font-extrabold">{isNew ? "Add Product" : "Edit Product"}</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {error && <Alert variant="error" title="Error" message={error} onDismiss={() => setError("")} />}
        {success && <Alert variant="success" title="Done" message={success} />}

        {/* Images */}
        <Section title="Product Images" icon={ImagePlus}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-muted">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-primary px-1 text-[9px] font-bold text-primary-foreground">MAIN</span>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                <span className="text-[10px] font-semibold">{uploading ? "Uploading…" : "Add image"}</span>
              </button>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageFiles(e.target.files)}
            />

            {fieldErrors.images && <FieldError message={fieldErrors.images} />}
            <p className="text-xs text-muted-foreground">First image is used as the main product photo. Drag to reorder is not supported — upload in order.</p>
          </div>
        </Section>

        {/* Basic Info */}
        <Section title="Basic Information" icon={Package}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Product Name" icon={Tag} value={form.name} onChange={(v) => set("name", v)} error={fieldErrors.name} />
            <Field label="Brand" icon={Tag} value={form.brand} onChange={(v) => set("brand", v)} error={fieldErrors.brand} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => set("category_id", e.target.value)}
              className={`h-10 w-full rounded-xl border bg-secondary px-3 text-sm outline-none focus:border-primary ${fieldErrors.category_id ? "border-red-400" : "border-border"}`}
            >
              <option value="">Select category…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {fieldErrors.category_id && <FieldError message={fieldErrors.category_id} />}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => { set("description", e.target.value); }}
              rows={4}
              placeholder="Describe the product in detail…"
              className={`w-full rounded-xl border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary resize-none ${fieldErrors.description ? "border-red-400" : "border-border"}`}
            />
            {fieldErrors.description && <FieldError message={fieldErrors.description} />}
          </div>
        </Section>

        {/* Pricing & Stock */}
        <Section title="Pricing & Stock" icon={DollarSign}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price ($)" icon={DollarSign} type="number" value={form.price} onChange={(v) => set("price", v)} error={fieldErrors.price} />
            <Field label="Original Price ($)" icon={DollarSign} type="number" value={form.original_price} onChange={(v) => set("original_price", v)} error={fieldErrors.original_price} placeholder="Optional" />
            <Field label="Stock" icon={Hash} type="number" value={form.stock} onChange={(v) => set("stock", v)} error={fieldErrors.stock} />
          </div>
        </Section>

        {/* Details */}
        <Section title="Features & Tags" icon={Layers}>
          <Field
            label="Features (comma-separated)"
            icon={FileText}
            value={form.features}
            onChange={(v) => set("features", v)}
            placeholder="e.g. Bluetooth 5.0, 40h battery, Foldable"
          />
          <Field
            label="Tags (comma-separated)"
            icon={Tag}
            value={form.tags}
            onChange={(v) => set("tags", v)}
            placeholder="e.g. headphones, audio, wireless"
          />
        </Section>

        {/* Flags */}
        <Section title="Visibility Flags" icon={CheckCircle}>
          <div className="flex flex-wrap gap-6">
            {[
              { key: "is_featured", label: "Featured" },
              { key: "is_new_arrival", label: "New Arrival" },
              { key: "is_best_seller", label: "Best Seller" },
            ].map(({ key, label }) => (
              <label key={key} className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
                <div
                  onClick={() => set(key, !form[key])}
                  className={`flex h-5 w-5 items-center justify-center rounded border-2 transition ${form[key] ? "border-primary bg-primary" : "border-border"}`}
                >
                  {form[key] && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                </div>
                {label}
              </label>
            ))}
          </div>
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : isNew ? "Create Product" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-(--shadow-soft) space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <Icon className="h-4 w-4" /> {title}
      </div>
      {children}
    </div>
  );
}

function Field({ label, icon: Icon, type = "text", value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={type === "number" ? 0 : undefined}
          className={`h-10 w-full rounded-xl border bg-secondary text-sm outline-none focus:border-primary ${Icon ? "pl-9 pr-3" : "px-3"} ${error ? "border-red-400 focus:border-red-400" : "border-border"}`}
        />
      </div>
      {error && <FieldError message={error} />}
    </div>
  );
}

function FieldError({ message }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
