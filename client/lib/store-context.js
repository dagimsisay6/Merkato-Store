"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { PRODUCTS } from "./store-data";

const CartContext = createContext(null);
const WishContext = createContext(null);

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
  const [items, setItems] = useLocal("merkato.cart", [
    { id: "1", qty: 1 },
    { id: "3", qty: 2 },
  ]);
  const [wish, setWish] = useLocal("merkato.wish", ["2", "4"]);

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

  const wishlist= {
    ids: wish,
    has: id => wish.includes(id),
    toggle: id => setWish(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])),
    remove: id => setWish(prev => prev.filter(x => x !== id)),
    moveToCart: id => {
      cart.add(id);
      setWish(prev => prev.filter(x => x !== id));
    },
  };

  return (
    <CartContext.Provider value={cart}>
      <WishContext.Provider value={wishlist}>{children}</WishContext.Provider>
    </CartContext.Provider>
  );
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
