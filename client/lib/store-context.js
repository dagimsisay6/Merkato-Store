"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  getCart, saveCart,
  getWishlist, addToWishlist, removeFromWishlist,
} from "./api";
import { startBuyNow } from "./checkout-session";

const CartContext = createContext(null);
const WishContext = createContext(null);
const AuthContext = createContext(null);

const BASE = process.env.NEXT_PUBLIC_API_URL;

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem("merkato.user")); } catch { return null; }
  });
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;
    try { return localStorage.getItem("merkato.token"); } catch { return null; }
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // cart: [{ id, qty, product }]  — product details merged after fetch
  const [cartItems, setCartItems] = useState([]); // [{ id, qty }]
  const [cartProducts, setCartProducts] = useState({}); // id -> product object
  const [wishIds, setWishIds] = useState([]); // number[]

  const syncTimer = useRef(null);

  // ── Load cart + wishlist after mount when token is ready ──
  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      setCartItems([]);
      setCartProducts({});
      setWishIds([]);
      return;
    }
    getCart(token).then(d => setCartItems(d?.cart || [])).catch(() => {});
    getWishlist(token).then(d => setWishIds(d?.wishlist || [])).catch(() => {});
  }, [mounted, token]);

  // ── Fetch product details for cart items ────────────────
  useEffect(() => {
    const missing = cartItems.map(i => i.id).filter(id => !cartProducts[id]);
    if (!missing.length) return;
    fetch(`${BASE}/products/by-ids?ids=${missing.join(",")}`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
      .then(data => {
        if (!data?.products) return;
        const map = {};
        data.products.forEach(p => { map[p.id] = p; });
        setCartProducts(prev => ({ ...prev, ...map }));
      });
  }, [cartItems]);

  // ── Debounced cart sync to server ───────────────────────
  const scheduleSync = (items) => {
    if (!token) return;
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      saveCart(items.map(({ id, qty }) => ({ id, qty })), token).catch(() => {});
    }, 600);
  };

  // ── Cart ────────────────────────────────────────────────
  const detailed = cartItems
    .map(i => cartProducts[i.id] ? { product: cartProducts[i.id], qty: i.qty } : null)
    .filter(Boolean);

  const subtotal = detailed.reduce((s, d) => s + Number(d.product.price) * d.qty, 0);
  const count = cartItems.reduce((s, i) => s + i.qty, 0);

  const cart = {
    items: cartItems, detailed, subtotal, count,
    add: (id, qty = 1) => {
      setCartItems(prev => {
        const next = prev.find(p => p.id === id)
          ? prev.map(p => p.id === id ? { ...p, qty: p.qty + qty } : p)
          : [...prev, { id, qty }];
        scheduleSync(next);
        return next;
      });
    },
    remove: (id) => {
      setCartItems(prev => {
        const next = prev.filter(p => p.id !== id);
        scheduleSync(next);
        return next;
      });
    },
    setQty: (id, qty) => {
      setCartItems(prev => {
        const next = prev.map(p => p.id === id ? { ...p, qty: Math.max(1, qty) } : p);
        scheduleSync(next);
        return next;
      });
    },
    clear: () => {
      setCartItems([]);
      if (token) saveCart([], token).catch(() => {});
    },
    buyNow: (id, qty = 1) => {
      startBuyNow(Number(id), qty);
    },
  };

  // ── Wishlist ────────────────────────────────────────────
  const wishlist = {
    ids: wishIds,
    has: id => wishIds.includes(Number(id)),
    toggle: async (id) => {
      const numId = Number(id);
      if (wishIds.includes(numId)) {
        setWishIds(prev => prev.filter(x => x !== numId));
        if (token) removeFromWishlist(numId, token).catch(() => {});
      } else {
        setWishIds(prev => [...prev, numId]);
        if (token) addToWishlist(numId, token).catch(() => {});
      }
    },
    remove: async (id) => {
      const numId = Number(id);
      setWishIds(prev => prev.filter(x => x !== numId));
      if (token) removeFromWishlist(numId, token).catch(() => {});
    },
    moveToCart: (id) => {
      cart.add(Number(id));
      wishlist.remove(id);
    },
  };

  // ── Auth ────────────────────────────────────────────────
  const auth = {
    user, token, mounted,
    isAdmin: user?.role === "admin",
    isLoggedIn: !!user,
    updateUser: (updated) => {
      const merged = { ...user, ...updated };
      localStorage.setItem("merkato.user", JSON.stringify(merged));
      setUser(merged);
    },
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
