# 🛍️ PremShop — ร้านขายบัญชีพรีเมียม

เว็บไซต์ขายบัญชีพรีเมียม (Netflix, Disney+, Spotify, YouTube Premium ฯลฯ) พร้อม:
- 🌙 ธีมสีม่วงเข้ม/นีออน สวยงาม
- ⚡ ระบบตะกร้าสินค้า + ชำระเงิน
- 📱 Responsive ทั้งมือถือและ Desktop
- 🔥 Flash Sale + นับถอยหลัง
- ⭐ รีวิวจากลูกค้า
- 🗄️ Supabase Database

---

## 🚀 ติดตั้งและ Deploy

### ขั้นตอนที่ 1: ติดตั้ง Dependencies

```bash
npm install
# หรือ
yarn install
# หรือ
pnpm install
```

### ขั้นตอนที่ 2: ตั้งค่า Supabase

1. ไปที่ [https://supabase.com](https://supabase.com) และสร้างโปรเจกต์ใหม่ (ฟรี)
2. ไปที่ **SQL Editor** ในหน้า Supabase Dashboard
3. คัดลอกเนื้อหาจากไฟล์ `supabase/schema.sql` และรันใน SQL Editor
4. ไปที่ **Settings → API** เพื่อคัดลอก:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

### ขั้นตอนที่ 3: สร้างไฟล์ `.env.local`

```bash
cp .env.local.example .env.local
```

แล้วแก้ไขไฟล์ `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### ขั้นตอนที่ 4: รันในเครื่อง (Development)

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy ขึ้น Vercel (ฟรี)

### วิธีที่ 1: ผ่าน Vercel CLI

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# สำหรับ Production
vercel --prod
```

### วิธีที่ 2: ผ่าน GitHub (แนะนำ)

1. อัปโหลดโปรเจกต์ขึ้น GitHub
2. ไปที่ [https://vercel.com](https://vercel.com) → New Project
3. Import จาก GitHub repository
4. ตั้งค่า Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = [Project URL ของคุณ]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [anon key ของคุณ]
   SUPABASE_SERVICE_ROLE_KEY = [service role key ของคุณ]
   NEXT_PUBLIC_SITE_URL = https://[domain ของคุณ].vercel.app
   ```
5. กด Deploy!

---

## 📂 โครงสร้างไฟล์

```
premshop/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Layout หลัก (Header + Footer)
│   ├── page.tsx             # หน้าแรก
│   ├── products/            # หน้าสินค้า
│   │   ├── page.tsx         # รายการสินค้า
│   │   └── [slug]/page.tsx  # รายละเอียดสินค้า
│   ├── categories/page.tsx  # หมวดหมู่
│   ├── promotions/page.tsx  # โปรโมชั่น
│   ├── reviews/page.tsx     # รีวิว
│   ├── cart/page.tsx        # ตะกร้าสินค้า
│   ├── checkout/page.tsx    # ชำระเงิน
│   ├── faq/page.tsx         # คำถามพบบ่อย
│   ├── how-to/page.tsx      # วิธีการสั่งซื้อ
│   └── contact/page.tsx     # ติดต่อเรา
├── components/
│   ├── layout/              # Header, Footer
│   └── home/                # ProductCard, HeroSection, etc.
├── lib/
│   ├── data.ts              # ข้อมูลสินค้า (mock)
│   ├── store.ts             # Zustand state (cart, wishlist)
│   ├── utils.ts             # Helper functions
│   └── supabase/            # Supabase client
├── supabase/
│   └── schema.sql           # Database schema
└── public/                  # Static assets
```

---

## 🛠️ เทคโนโลยีที่ใช้

| เทคโนโลยี | ใช้สำหรับ |
|---|---|
| Next.js 14 | Framework หลัก |
| Tailwind CSS | Styling |
| Supabase | Database + Auth |
| Zustand | State Management (Cart) |
| Framer Motion | Animations |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| TypeScript | Type Safety |

---

## ⚙️ การปรับแต่ง

### เพิ่ม/แก้ไขสินค้า
แก้ไขไฟล์ `lib/data.ts` เพื่อเพิ่มสินค้าใหม่ หรือใช้ Supabase Database

### เปลี่ยนชื่อร้านค้า
ค้นหา `PremShop` ใน codebase และเปลี่ยนเป็นชื่อร้านของคุณ

### เพิ่มช่องทางชำระเงิน
แก้ไข `app/checkout/page.tsx` ในส่วน `paymentMethods`

### ตั้งค่า LINE Notify สำหรับแจ้งเตือนออเดอร์
เพิ่ม `LINE_NOTIFY_TOKEN` ใน Environment Variables และสร้าง API route ที่ `app/api/notify/route.ts`

---

## 📱 หน้าต่างๆ

- `/` — หน้าแรก
- `/products` — รายการสินค้าทั้งหมด
- `/products/[slug]` — รายละเอียดสินค้า
- `/categories` — หมวดหมู่
- `/promotions` — โปรโมชั่น
- `/reviews` — รีวิว
- `/cart` — ตะกร้าสินค้า
- `/checkout` — ชำระเงิน
- `/faq` — คำถามพบบ่อย
- `/how-to` — วิธีการสั่งซื้อ
- `/contact` — ติดต่อเรา

---

## 🔒 Security Notes

- ไม่เก็บข้อมูลบัตรเครดิตในระบบ
- ใช้ Supabase RLS (Row Level Security) ป้องกันการเข้าถึงข้อมูล
- Service Role Key ต้องเก็บไว้ใน Server-side เท่านั้น (ไม่ expose ใน client)

---

## 📞 ช่วยเหลือ

หากมีปัญหาในการติดตั้ง สามารถตรวจสอบ:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

© 2026 PremShop. Made with ❤️ in Thailand 🇹🇭
