const BASE = process.env.NEXT_PUBLIC_API_URL;

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

async function authGet(path, token) {
  const res = await fetch(`${BASE}${path}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

async function post(path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json();
}

//products

export async function getProducts({
  category,
  search,
  sort,
  featured,
  isNew,
  page = 1,
} = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  if (sort) params.set("sort", sort);
  if (featured) params.set("featured", true);
  if (isNew) params.set("isNew", true);
  params.set("page", page);
  return get(`/products?${params.toString()}`);
}

export async function getProductBySlug(slug) {
  return get(`/products/${slug}`);
}

export async function getFeaturedProducts() {
  return get("/products?featured=true");
}

export async function getNewArrivals() {
  return get("/products?isNew=true");
}

export async function getBestSellers() {
  return get("/products?sort=rating");
}

export async function getDealProducts() {
  return get("/products?deals=true");
}

export async function getRelatedProducts(productId, categorySlug) {
  return get(`/products?category=${categorySlug}&exclude=${productId}&limit=4`);
}

// categories

export async function getCategories() {
  return get("/categories");
}

export async function getCategoryBySlug(slug) {
  return get(`/categories/${slug}`);
}

// brands

export async function getBrands() {
  return get("/brands");
}

//countries

export async function getCountries() {
  return get("/countries");
}

// orders (authenticated)

export async function getOrders(token) {
  return authGet("/orders", token);
}

export async function getOrderById(id, token) {
  return authGet(`/orders/${id}`, token);
}

// addresses (authenticated

export async function getAddresses(token) {
  return authGet("/users/addresses", token);
}

// reviews (authenticated)

export async function getReviews(token) {
  return authGet("/users/reviews", token);
}

// auth

export async function signIn(email, password) {
  return post("/auth/signin", { email, password });
}

export async function signUp(data) {
  return post("/auth/signup", data);
}

// newsletter

export async function subscribeNewsletter(email) {
  return post("/newsletter/subscribe", { email });
}

// checkout

export async function createOrder(payload, token) {
  return post("/orders", payload, token);
}
