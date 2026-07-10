"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Check } from "lucide-react";
import { useAuth } from "@/lib/store-context";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AddressesPage() {
  const { token } = useAuth();
  const [addrs, setAddrs] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ label: "", name: "", phone: "", line1: "", city: "", country: "", isDefault: false });

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/addresses`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => setAddrs(d.addresses ?? [])).catch(() => {});
  }, [token]);

  function openAdd() { setForm({ label: "", name: "", phone: "", line1: "", city: "", country: "", isDefault: false }); setEditing(null); setAdding(true); }
  function openEdit(a) { setForm(a); setEditing(a.id); setAdding(true); }

  async function handleSubmit(e) {
    e.preventDefault();
    const url = `${BASE}/users/addresses${editing ? `/${editing}` : ""}`;
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setAddrs(data.addresses ?? []);
    setAdding(false);
  }

  async function handleDelete(id) {
    const res = await fetch(`${BASE}/users/addresses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAddrs(data.addresses ?? []);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Addresses</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your delivery addresses.</p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow">
          <Plus className="h-4 w-4" /> Add address
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addrs.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                <MapPin className="h-3 w-3" />{a.label}
              </div>
              {a.isDefault && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <Check className="h-3 w-3" /> Default
                </span>
              )}
            </div>
            <p className="mt-3 font-semibold">{a.name}</p>
            <p className="text-sm text-muted-foreground">{a.line1}<br />{a.city}, {a.country}<br />{a.phone}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => openEdit(a)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button onClick={() => handleDelete(a.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ember hover:bg-ember/10">
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold">{editing ? "Edit address" : "New address"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[["label", "Label (Home, Office…)"], ["name", "Full name"], ["phone", "Phone"], ["city", "City"], ["country", "Country"]].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
                <input value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} required
                  className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Street address</label>
            <input value={form.line1} onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))} required
              className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} className="accent-primary" />
            Set as default
          </label>
          <div className="flex gap-3">
            <button type="submit" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow">Save address</button>
            <button type="button" onClick={() => setAdding(false)} className="rounded-full border border-border px-5 py-2 text-sm font-semibold">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
