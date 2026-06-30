# 🚀 Family AI Learning Lab

Phòng học AI 30 ngày cho gia đình — Vite + React + GitHub Pages + Gemini AI.

## Cấu trúc dự án

```
src/
├── data/curriculum.js       # 30 ngày học, 4 giai đoạn
├── hooks/
│   ├── useProgress.js       # Lưu tiến độ vào localStorage
│   └── useAI.js             # Kết nối Gemini 2.0 Flash
├── pages/
│   ├── Setup.jsx            # Màn hình cài đặt ban đầu
│   ├── Home.jsx             # Trang chủ + lịch 30 ngày
│   ├── DayView.jsx          # Chi tiết ngày học + chat AI
│   └── Dashboard.jsx        # Dashboard phụ huynh
└── App.jsx                  # Router + BottomNav
```

## Cài đặt và chạy

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # build production
```

## Deploy lên GitHub Pages

```bash
# 1. Tạo repo trên github.com (Public)
git init
git add .
git commit -m "Family AI Lab v1"
git remote add origin https://github.com/USERNAME/family-ai-lab.git
git push -u origin main

# 2. Deploy (1 lệnh)
npm run deploy
```

App live tại: `https://USERNAME.github.io/family-ai-lab/`

### Lần đầu cần vào GitHub → Settings → Pages → Source: gh-pages branch

## Lấy Gemini API Key (miễn phí)

1. Vào https://aistudio.google.com/app/apikey
2. Đăng nhập Google → Create API Key
3. Copy key (dạng `AIzaSy...`)
4. Nhập vào app khi setup hoặc Tab Phụ huynh → Cài đặt

**Free tier:** 15 req/phút · 1 triệu token/ngày — đủ dùng thoải mái.

## Thêm bài học

Chỉnh sửa `src/data/curriculum.js` → mảng `DAYS` → thêm object mới.
Sau đó: `npm run deploy`

## Tính năng

- 30 ngày học · 4 giai đoạn (Khám phá → Hiểu sâu → Ứng dụng → Sáng tạo)
- AI gia sư Stu — hỏi ngược, không làm thay, scaffolding theo giai đoạn
- Dashboard phụ huynh — tỉ lệ tự giải, nhật ký, điểm yếu/mạnh
- Lưu localStorage — không cần server, không cần đăng ký
- Responsive — điện thoại, iPad, PC
