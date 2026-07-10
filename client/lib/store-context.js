"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { PRODUCTS } from "./store-data";

const CartContext = createContext(null);
const WishContext = createContext(null);
const AuthContext = createContext(null);

const BASE = process.env.NEXT_PUBLIC_API_URL;

function useLocal(key, initial) {
  const [v, setV] = useState(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setV(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, v]);
  return [v, setV];
}

export function StoreProvider({ children }) {
  const [items, setItems] = useLocal("merkato.cart", []);
  const [wish, setWish] = useLocal("merkato.wish", []);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Rehydrate auth from localStorage on mount
  useEffect(() => {
    try {
      const t = localStorage.getItem("merkato.token");
      const u = localStorage.getItem("merkato.user");
      if (t && u) {
        setToken(t);
        setUser(JSON.parse(u));
      }
    } catch {}
  }, []);

  const detailed = items
    .map(i => {
      const product = PRODUCTS.find(p => p.id === i.id);
      return product ? { product, qty: i.qty } : null;
    })
    .filter(Boolean);

  const subtotal = detailed.reduce((s, d) => s + d.product.price * d.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const cart = {
    items, detailed, subtotal, count,
    add: (id, qty = 1) =>
      setItems(prev => {
        const existing = prev.find(p => p.id === id);
        if (existing) return prev.map(p => (p.id === id ? { ...p, qty: p.qty + qty } : p));
        return [...prev, { id, qty }];
      }),
    remove: id => setItems(prev => prev.filter(p => p.id !== id)),
    setQty: (id, qty) =>
      setItems(prev => prev.map(p => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))),
    clear: () => setItems([]),
  };

  const wishlist = {
    ids: wish,
    has: id => wish.includes(id),
    toggle: id => setWish(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])),
    remove: id => setWish(prev => prev.filter(x => x !== id)),
    moveToCart: id => {
      cart.add(id);
      setWish(prev => prev.filter(x => x !== id));
    },
  };

  const auth = {
    user,
    token,
    isAdmin: user?.role === "admin",
    isLoggedIn: !!user,
    signin: async (email, password) => {
      const res = await fetch(`${BASE}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sign in failed");
      localStorage.setItem("merkato.token", data.token);
      localStorage.setItem("merkato.user", JSON.stringify(data.user));
      // Set cookie for middleware
      document.cookie = `merkato.token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      document.cookie = `merkato.role=${data.user.role}; path=/; max-age=${7 * 24 * 60 * 60}`;
      setToken(data.token);
      setUser(data.user);
      return data.user;
    },
    signup: async (name, email, password) => {
      const res = await fetch(`${BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sign up failed");
      localStorage.setItem("merkato.token", data.token);
      localStorage.setItem("merkato.user", JSON.stringify(data.user));
      document.cookie = `merkato.token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      document.cookie = `merkato.role=${data.user.role}; path=/; max-age=${7 * 24 * 60 * 60}`;
      setToken(data.token);
      setUser(data.user);
      return data.user;
    },
    signout: () => {
      localStorage.removeItem("merkato.token");
      localStorage.removeItem("merkato.user");
      document.cookie = "merkato.token=; path=/; max-age=0";
      document.cookie = "merkato.role=; path=/; max-age=0";
      setToken(null);
      setUser(null);
    },
  };

  return (
    <AuthContext.Provider value={auth}>
      <CartContext.Provider value={cart}>
        <WishContext.Provider value={wishlist}>{children}</WishContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const a = useContext(AuthContext);
  if (!a) throw new Error("useAuth outside StoreProvider");
  return a;
}
export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside StoreProvider");
  return c;
}
export function useWishlist() {
  const w = useContext(WishContext);
  if (!w) throw new Error("useWishlist outside StoreProvider");
  return w;
}
