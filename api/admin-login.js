import { createToken, readBody, send } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { message: "Method not allowed" });
  try {
    const { password } = await readBody(req);
    if (!process.env.ADMIN_PASSWORD) return send(res, 500, { message: "Chưa cấu hình ADMIN_PASSWORD" });
    if (String(password || "") !== process.env.ADMIN_PASSWORD) {
      return send(res, 401, { message: "Sai mật khẩu admin" });
    }
    return send(res, 200, { token: createToken({ role: "admin" }) });
  } catch (error) {
    return send(res, 500, { message: "Đăng nhập lỗi", detail: error.message });
  }
}
