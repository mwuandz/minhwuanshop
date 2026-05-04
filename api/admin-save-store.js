import { normalizePrices, normalizeProduct, readBody, requireAdmin, sb, send } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { message: "Method not allowed" });
  try {
    requireAdmin(req);
    const payload = await readBody(req);
    const settings = payload.settings || {};
    const productsInput = Array.isArray(payload.products) ? payload.products : [];
    const settingsRows = Object.entries(settings).map(([key, value]) => ({ key, value: String(value ?? "") }));
    const products = productsInput.map(normalizeProduct);
    const prices = productsInput.flatMap((product, index) => {
      const normalized = normalizeProduct(product, index);
      return normalizePrices({ ...product, id: normalized.id }, index);
    });

    if (settingsRows.length) {
      await sb("/settings?on_conflict=key", {
        method: "POST",
        prefer: "resolution=merge-duplicates",
        body: JSON.stringify(settingsRows),
      });
    }

    await sb("/product_prices?product_id=not.is.null", { method: "DELETE" });
    await sb("/products?id=not.is.null", { method: "DELETE" });

    if (products.length) {
      await sb("/products", {
        method: "POST",
        prefer: "return=minimal",
        body: JSON.stringify(products),
      });
    }
    if (prices.length) {
      await sb("/product_prices", {
        method: "POST",
        prefer: "return=minimal",
        body: JSON.stringify(prices),
      });
    }

    return send(res, 200, { success: true });
  } catch (error) {
    return send(res, 500, { message: "Lưu dữ liệu lỗi", detail: error.message });
  }
}
