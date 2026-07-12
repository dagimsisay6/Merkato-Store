const BASE = process.env.NEXT_PUBLIC_API_URL;

async function get(path) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
    return res.json();
  } catch (err) {
    console.error(`API error: ${err.message}`);
    return null;
  }
}

async function authGet(path, token) {
  const res = await fetch(`${BASE}${path}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

async function authDelete(path, token) {
  const res = await fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`DELETE ${path} → ${res.status}`);
  return res.json();
}

async function put(path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} → ${res.status}`);
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

// wishlist
export async function getWishlist(token) {
  return authGet("/users/wishlist", token);
}
export async function addToWishlist(productId, token) {
  return post(`/users/wishlist/${productId}`, {}, token);
}
export async function removeFromWishlist(productId, token) {
  return authDelete(`/users/wishlist/${productId}`, token);
}

// cart
export async function getCart(token) {
  return authGet("/users/cart", token);
}
export async function saveCart(items, token) {
  return put("/users/cart", { items }, token);
}

// delete account
export async function deleteAccount(currentPassword, token) {
  const res = await fetch(`${BASE}/users/account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword }),
  });
  if (!res.ok) throw new Error(`DELETE /users/account → ${res.status}`);
  return res.json();
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

export async function forgotPassword(email) {
  return post("/auth/forgot-password", { email });
}

export async function validateResetToken(token) {
  const res = await fetch(`${BASE}/auth/validate-reset-token/${token}`, { cache: "no-store" });
  return res.json();
}

export async function resetPassword(token, password) {
  const res = await fetch(`${BASE}/auth/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Reset failed");
  return data;
}

// newsletter

export async function subscribeNewsletter(email) {
  return post("/newsletter/subscribe", { email });
}

// careers

export async function submitApplication(data) {
  const res = await fetch(`${BASE}/careers/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Submission failed");
  return json;
}

export async function getAdminApplications({ page = 1, limit = 20, status, search } = {}, token) {
  const params = new URLSearchParams({ page, limit });
  if (status && status !== "all") params.set("status", status);
  if (search) params.set("search", search);
  return authGet(`/admin/applications?${params}`, token);
}

export async function getAdminApplication(id, token) {
  return authGet(`/admin/applications/${id}`, token);
}

export async function updateApplicationStatus(id, status, token) {
  const res = await fetch(`${BASE}/admin/applications/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`PATCH status → ${res.status}`);
  return res.json();
}

export async function replyToApplication(id, reply, token) {
  return post(`/admin/applications/${id}/reply`, { reply }, token);
}

export async function deleteAdminApplication(id, token) {
  return authDelete(`/admin/applications/${id}`, token);
}

export async function restoreAdminApplication(id, token) {
  const res = await fetch(`${BASE}/admin/applications/${id}/restore`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`PATCH restore → ${res.status}`);
  return res.json();
}

export async function getNewApplicationsCount(token) {
  return authGet("/admin/applications/new-count", token);
}

// checkout

export async function createOrder(payload, token) {
  return post("/orders", payload, token);
}

// messages (admin)

export async function getAdminMessages({ page = 1, limit = 20, status, search } = {}, token) {
  const params = new URLSearchParams({ page, limit });
  if (status && status !== "all") params.set("status", status);
  if (search) params.set("search", search);
  return authGet(`/admin/messages?${params}`, token);
}

export async function getAdminMessage(id, token) {
  return authGet(`/admin/messages/${id}`, token);
}

export async function updateMessageStatus(id, status, token) {
  const res = await fetch(`${BASE}/admin/messages/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`PATCH /admin/messages/${id}/status → ${res.status}`);
  return res.json();
}

export async function replyToMessage(id, reply, token) {
  return post(`/admin/messages/${id}/reply`, { reply }, token);
}

export async function deleteAdminMessage(id, token) {
  return authDelete(`/admin/messages/${id}`, token);
}

export async function restoreAdminMessage(id, token) {
  const res = await fetch(`${BASE}/admin/messages/${id}/restore`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`PATCH restore → ${res.status}`);
  return res.json();
}

export async function getUnreadCount(token) {
  return authGet("/admin/messages/unread-count", token);
}
