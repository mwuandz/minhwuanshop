import crypto from "node:crypto";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

export function send(res, status, data) {
  res.statusCode = status;
  Object.entries(JSON_HEADERS).forEach(([key, value]) => res.setHeader(key, value));
  res.end(JSON.stringify(data));
}

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function base64url(input) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function signPart(data) {
  return crypto.createHmac("sha256", requireEnv("JWT_SECRET")).update(data).digest("base64url");
}

export function createToken(payload, ttlSeconds = 7 * 24 * 60 * 60) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + ttlSeconds };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(body))}`;
  return `${unsigned}.${signPart(unsigned)}`;
}

export function verifyToken(token) {
  if (!token) throw new Error("Missing token");
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) throw new Error("Invalid token");
  const unsigned = `${header}.${payload}`;
  const expected = signPart(unsigned);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error("Invalid signature");
  const data = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
  if (data.exp && Math.floor(Date.now() / 1000) > data.exp) throw new Error("Token expired");
  return data;
}

export function requireAdmin(req) {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  const payload = verifyToken(token);
  if (payload.role !== "admin") throw new Error("Not admin");
  return payload;
}

export function supabaseHeaders(prefer) {
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
  if (prefer) headers.Prefer = prefer;
  return headers;
}

export async function sb(path, options = {}) {
  const url = `${requireEnv("SUPABASE_URL").replace(/\/$/, "")}/rest/v1${path}`;
  const response = await fetch(url, {
    ...options,
    headers: { ...supabaseHeaders(options.prefer), ...(options.headers || {}) },
  });
  const text = await response.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
  if (!response.ok) {
    const detail = typeof data === "string" ? data : data?.message || JSON.stringify(data);
    throw new Error(detail || `Supabase error ${response.status}`);
  }
  return data;
}

export async function getStore({ includeInactive = false } = {}) {
  const [settingsRows, products, prices] = await Promise.all([
    sb("/settings?select=key,value"),
    sb(`/products?select=*&${includeInactive ? "" : "active=eq.true&"}order=sort_order.asc,id.asc`),
    sb("/product_prices?select=*&order=sort_order.asc,id.asc"),
  ]);
  const settings = {};
  settingsRows.forEach((row) => { settings[row.key] = row.value; });
  const byProduct = new Map();
  prices.forEach((price) => {
    if (!byProduct.has(price.product_id)) byProduct.set(price.product_id, []);
    byProduct.get(price.product_id).push({
      id: price.id,
      label: price.label,
      price: price.price,
      sort_order: price.sort_order,
    });
  });
  return {
    settings,
    products: products.map((product) => ({ ...product, prices: byProduct.get(product.id) || [] })),
  };
}

export function normalizeProduct(product, index = 0) {
  const id = String(product.id || `product-${Date.now()}-${index}`).trim();
  return {
    id,
    name: String(product.name || "Sản phẩm mới").trim(),
    category: String(product.category || "ai").trim(),
    badge: String(product.badge || "").trim(),
    description: String(product.description || "").trim(),
    image_url: String(product.image_url || "").trim(),
    sort_order: Number(product.sort_order || index),
    active: product.active !== false,
  };
}

export function normalizePrices(product, index = 0) {
  const productId = String(product.id || `product-${index}`).trim();
  return (product.prices || []).map((item, priceIndex) => ({
    id: String(item.id || `${productId}-${priceIndex + 1}`).trim(),
    product_id: productId,
    label: String(item.label || "Gói").trim(),
    price: String(item.price || "Inbox").trim(),
    sort_order: Number(item.sort_order ?? priceIndex),
  }));
}
