// Thin fetch wrapper. All calls go to /api (proxied to the backend by Vite) and
// include credentials so the httpOnly auth cookie travels with every request.
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: options.body && !(options.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : undefined,
    ...options,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const err = new Error((data && data.error) || `Ошибка ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // auth
  me: () => request("/auth/me"),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request("/auth/logout", { method: "POST" }),

  // meta
  meta: () => request("/meta"),

  // products
  listProducts: () => request("/products"),
  getProduct: (slug) => request(`/products/${slug}`),
  createProduct: (body) => request("/products", { method: "POST", body: JSON.stringify(body) }),
  updateProduct: (slug, body) =>
    request(`/products/${slug}`, { method: "PUT", body: JSON.stringify(body) }),
  setVisibility: (slug, hidden) =>
    request(`/products/${slug}/visibility`, { method: "PATCH", body: JSON.stringify({ hidden }) }),
  deleteProduct: (slug) => request(`/products/${slug}`, { method: "DELETE" }),

  uploadImage: (file, baseSlug) => {
    const fd = new FormData();
    fd.append("image", file);
    fd.append("baseSlug", baseSlug || "product");
    return request("/products/upload", { method: "POST", body: fd });
  },
};
