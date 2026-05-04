create table if not exists public.settings (
  key text primary key,
  value text not null default ''
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null default 'ai',
  badge text default '',
  description text default '',
  image_url text default '',
  sort_order integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.product_prices (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  label text not null,
  price text not null,
  sort_order integer default 0
);

alter table public.settings enable row level security;
alter table public.products enable row level security;
alter table public.product_prices enable row level security;

delete from public.product_prices;
delete from public.products;
delete from public.settings;

insert into public.settings (key, value) values
('updateDate','30/4'),
('website','minhwuan.store'),
('zaloBuyUrl','https://zalo.me/0559331106'),
('zaloGroupUrl','https://zalo.me/g/vzveml426'),
('popupTitle','Tham gia cộng đồng Zalo Minh Wuan Store'),
('popupText','Vào nhóm để nhận thông báo event Free 2 lần/tuần, cập nhật bảng giá mới và các ưu đãi App Pro/Premium.');

insert into public.products (id,name,category,badge,description,image_url,sort_order,active) values
('combo-ai-pro','Combo AI PRO','combo','Hot combo','ChatGPT Pro 1 tháng + Gemini Pro 1 năm kèm 5TB Drive.','https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128',1,true),
('combo-ai-video','Combo AI + EDIT VIDEO','combo','Best for creator','ChatGPT Pro 1 tháng + CapCut Pro 1 năm.','https://www.google.com/s2/favicons?domain=capcut.com&sz=128',2,true),
('combo-edit-hot','Combo EDIT VIDEO HOT','combo','Tiết kiệm','CapCut Pro 1 năm + Locket Gold.','https://www.google.com/s2/favicons?domain=locket.camera&sz=128',3,true),
('chatgpt','ChatGPT','ai','Nâng chính chủ','ChatGPT Plus / Pro cho học tập, công việc và sáng tạo nội dung.','https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128',10,true),
('gemini','Gemini Pro + 5TB Drive','ai','Nâng chính chủ','Gemini Pro kèm dung lượng Drive lớn.','https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128',11,true),
('supergrok','SuperGrok AI','ai','New','Acc cấp / nâng chính chủ.','https://www.google.com/s2/favicons?domain=x.ai&sz=128',12,true),
('kling','Kling AI','ai','New','Gói credit tạo video AI.','https://www.google.com/s2/favicons?domain=klingai.com&sz=128',13,true),
('veo3','Veo3 / AI nhiều credit','ai','Inbox giá','Nhiều sản phẩm AI credit cao, nhắn Zalo để báo giá theo nhu cầu.','https://www.google.com/s2/favicons?domain=deepmind.google&sz=128',14,true),
('capcut','CapCut Pro','edit','Acc cấp / nâng chính chủ','Gói edit video nhiều thời hạn và nhiều thiết bị.','https://www.google.com/s2/favicons?domain=capcut.com&sz=128',20,true),
('canva','Canva Pro','edit','Nâng chính chủ','Thiết kế nhanh, dùng Canva Pro.','https://www.google.com/s2/favicons?domain=canva.com&sz=128',21,true),
('locket','Locket Gold','edit','Quay video 15s','Bản quay video 15s.','https://www.google.com/s2/favicons?domain=locket.camera&sz=128',22,true),
('youtube','YouTube Premium','entertainment','Nâng chính chủ','Xem YouTube Premium, gói cá nhân và gia đình.','https://www.google.com/s2/favicons?domain=youtube.com&sz=128',30,true),
('netflix','Netflix 4K','entertainment','Acc cấp sẵn','Các gói Netflix 4K ngắn hạn, riêng tư và gia đình.','https://www.google.com/s2/favicons?domain=netflix.com&sz=128',31,true),
('spotify','Spotify','entertainment','Nâng chính chủ','Nghe nhạc Spotify theo tháng hoặc 3 tháng.','https://www.google.com/s2/favicons?domain=spotify.com&sz=128',32,true);

insert into public.product_prices (id,product_id,label,price,sort_order) values
('combo-ai-pro-1','combo-ai-pro','Giá combo','371k',1),
('combo-ai-video-1','combo-ai-video','Giá combo','575k',1),
('combo-edit-hot-1','combo-edit-hot','Giá combo','500k',1),
('chatgpt-1','chatgpt','Plus – 1 tháng','119k',1),
('chatgpt-2','chatgpt','Pro – 1 tháng','149k',2),
('gemini-1','gemini','1 năm','222k',1),
('supergrok-1','supergrok','7 ngày','29k',1),
('supergrok-2','supergrok','30 ngày','150k',2),
('supergrok-3','supergrok','1 năm','499k',3),
('kling-1','kling','4k5 credit','629k',1),
('veo3-1','veo3','AI nhiều credit','Inbox',1),
('capcut-1','capcut','7 ngày','19k',1),
('capcut-2','capcut','1 tháng','39k',2),
('capcut-3','capcut','6 tháng','249k',3),
('capcut-4','capcut','1 năm / 1 thiết bị','289k',4),
('capcut-5','capcut','1 năm / 2 thiết bị','345k',5),
('capcut-6','capcut','1 năm / 3 thiết bị','399k',6),
('canva-1','canva','1 tháng','20k',1),
('canva-2','canva','1 năm','49k',2),
('locket-1','locket','Bản quay video 15s','39k',1),
('youtube-1','youtube','1 tháng','39k',1),
('youtube-2','youtube','Gói gia đình 5 tài khoản','139k',2),
('youtube-3','youtube','1 năm','449k',3),
('netflix-1','netflix','Gói ngắn hạn random 2 tuần – 1 tháng','29k',1),
('netflix-2','netflix','Gói 1 tháng ổn định riêng tư','70k',2),
('netflix-3','netflix','Gói gia đình 5 profile / tháng','279k',3),
('spotify-1','spotify','1 tháng','39k',1),
('spotify-2','spotify','3 tháng','88k',2);
