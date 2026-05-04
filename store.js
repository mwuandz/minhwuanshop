# Minh Wuan Store - Vercel + Supabase Animated

Bản này có backend miễn phí theo hướng Vercel + Supabase, có trang admin và đã thêm hiệu ứng động cho trang khách.

## Cấu trúc

```text
public/index.html        Trang khách
public/admin.html        Trang admin
api/store.js             API dữ liệu khách xem
api/admin-login.js       API đăng nhập admin
api/admin-store.js       API lấy dữ liệu cho admin
api/admin-save-store.js  API lưu sản phẩm/giá/cài đặt
supabase/schema.sql      File SQL tạo database và dữ liệu mẫu
```

## Cách deploy nhanh

1. Tạo project Supabase.
2. Vào SQL Editor của Supabase, chạy toàn bộ file `supabase/schema.sql`.
3. Upload project này lên GitHub.
4. Import repo vào Vercel.
5. Trong Vercel > Settings > Environment Variables, thêm:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=mat-khau-admin-cua-ban
JWT_SECRET=chuoi-bi-mat-that-dai
```

6. Deploy lại project.

## Link sau khi deploy

```text
/              Trang khách
/admin.html    Trang admin
```

## Hiệu ứng đã thêm

- Nền gradient chuyển động
- Orb sáng bay chậm ở background
- Card hiện dần khi cuộn
- Hover card 3D tilt nhẹ
- Nút Zalo glow/pulse
- Shimmer giá
- Popup cộng đồng có hiệu ứng mở
- Loading skeleton khi tải sản phẩm
- Hỗ trợ `prefers-reduced-motion`
