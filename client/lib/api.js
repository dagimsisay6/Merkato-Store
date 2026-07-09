/**
 * lib/api.js
 * Central API client for Merkato Store.
 * All functions currently return mock data.
 * When the backend is ready, replace the mock imports with real fetch calls.
 */

import {
  PRODUCTS,
  CATEGORY_LIST,
  BRANDS,
  COUNTRIES,
  MOCK_ORDERS,
  MOCK_ADDRESSES,
  MOCK_REVIEWS,
} from "./store-data";

const BASE = process.env.NEXT_PUBLIC_API_URL;

// ─── helpers ────────────────────────────────────────────────────────────────

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json();
}

// ─── products ───────────────────────────────────────────────────────────────

export async function getProducts({ category, search, sort, page = 1 } = {}) {
  // TODO: return get(`/products?category=${category}&q=${search}&sort=${sort}&page=${page}`);
  let results = [...PRODUCTS];
  if (category) results = results.filter((p) => p.categorySlug === category);
  if (search) results = results.filter((p) =>
    (p.name + p.brand + p.tags.join(" ")).toLowerCase().includes(search.toLowerCase())
  );
  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") results.sort((a, b) => b.price - a.price);
  if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
  return { products: results, total: results.length };
}

export async function getProductBySlug(slug) {
  // TODO: return get(`/products/${slug}`);
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug) ?? null;
}

export async function getFeaturedProducts() {
  // TODO: return get("/products?featured=true");
  return PRODUCTS.filter((p) => p.featured);
}

export async function getNewArrivals() {
  // TODO: return get("/products?new=true");
  return PRODUCTS.filter((p) => p.isNew);
}

export async function getBestSellers() {
  // TODO: return get("/products?sort=reviews");
  return [...PRODUCTS].sort((a, b) => b.reviews - a.reviews);
}

export async function getDealProducts() {
  // TODO: return get("/products?deals=true");
  return PRODUCTS.filter((p) => p.original && p.original > p.price);
}

export async function getRelatedProducts(productId, categorySlug) {
  // TODO: return get(`/products/${productId}/related`);
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug && p.id !== productId).slice(0, 4);
}

// ─── categories ─────────────────────────────────────────────────────────────

export async function getCategories() {
  // TODO: return get("/categories");
  return CATEGORY_LIST;
}

export async function getCategoryBySlug(slug) {
  // TODO: return get(`/categories/${slug}`);
  return CATEGORY_LIST.find((c) => c.slug === slug) ?? null;
}

// ─── brands ─────────────────────────────────────────────────────────────────

export async function getBrands() {
  // TODO: return get("/brands");
  return BRANDS;
}

// ─── regions / countries ────────────────────────────────────────────────────

export async function getCountries() {
  // TODO: return get("/regions");
  return COUNTRIES;
}

// ─── orders (authenticated) ─────────────────────────────────────────────────

export async function getOrders(token) {
  // TODO: return get("/account/orders", token);
  return MOCK_ORDERS;
}

export async function getOrderById(id, token) {
  // TODO: return get(`/account/orders/${id}`, token);
  return MOCK_ORDERS.find((o) => o.id === id) ?? null;
}

// ─── addresses (authenticated) ──────────────────────────────────────────────

export async function getAddresses(token) {
  // TODO: return get("/account/addresses", token);
  return MOCK_ADDRESSES;
}

// ─── reviews (authenticated) ────────────────────────────────────────────────

export async function getReviews(token) {
  // TODO: return get("/account/reviews", token);
  return MOCK_REVIEWS;
}

// ─── auth ───────────────────────────────────────────────────────────────────

export async function signIn(email, password) {
  // TODO: return post("/auth/signin", { email, password });
  return { token: "mock-token", user: { name: "Amara Okafor", email } };
}

export async function signUp(data) {
  // TODO: return post("/auth/signup", data);
  return { token: "mock-token", user: { name: data.name, email: data.email } };
}

// ─── newsletter ─────────────────────────────────────────────────────────────

export async function subscribeNewsletter(email) {
  // TODO: return post("/newsletter/subscribe", { email });
  return { success: true };
}

// ─── checkout ───────────────────────────────────────────────────────────────

export async function createOrder(payload, token) {
  // TODO: return post("/orders", payload, token);
  return { orderId: "MK-" + Date.now(), status: "confirmed" };
}

