import { getStore, requireAdmin, send } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { message: "Method not allowed" });
  try {
    requireAdmin(req);
    const data = await getStore({ includeInactive: true });
    return send(res, 200, data);
  } catch (error) {
    return send(res, 401, { message: "Chưa đăng nhập hoặc phiên hết hạn", detail: error.message });
  }
}
