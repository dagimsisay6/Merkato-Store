const KEY = "merkato.checkout";

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(sessionStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function setSession(data) {
  sessionStorage.setItem(KEY, JSON.stringify(data));
}

export function patchSession(patch) {
  setSession({ ...getSession(), ...patch });
}

export function clearSession() {
  sessionStorage.removeItem(KEY);
}

export function startBuyNow(productId, qty = 1) {
  setSession({ items: [{ id: productId, qty }], source: "buy_now", step: "items" });
}

export function startCartCheckout(selectedItems) {
  setSession({ items: selectedItems, source: "cart", step: "items" });
}
