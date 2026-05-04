import { getStore, send } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { message: "Method not allowed" });
  try {
    const data = await getStore({ includeInactive: false });
    return send(res, 200, data);
  } catch (error) {
    return send(res, 500, { message: "Không tải được dữ liệu cửa hàng", detail: error.message });
  }
}
