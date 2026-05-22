# Self Order Boilerplate

Boilerplate fullstack untuk restoran self-order QR dine-in dengan 3 aktor:

- `owner`
- `waiter`
- `customer`

## Stack

- `frontend`: Next.js 15, React 19, Tailwind, shadcn-style structure
- `Backend`: Express, Prisma, PostgreSQL/Supabase
- `upload`: Cloudinary dengan optimasi `f_auto` dan `q_auto`

## Fitur yang sudah disiapkan

- Owner register/login
- Owner dashboard terhubung backend
- Owner update theme restoran
- Owner upload logo/hero image ke Cloudinary
- Owner tambah waiter
- Owner tambah menu
- Owner tambah promo timeline
- Waiter login dan lihat waiter board
- Waiter update status order dan call waiter
- Customer session otomatis dari meja
- Customer lihat restaurant public data
- Customer add cart, checkout, simulate payment, track status

## Jalankan Project

1. Install dependency

```bash
npm install
```

2. Jalankan development mode

```bash
npm run dev
```

3. Build production check

```bash
npm run build
```

## URL Penting

- Home: `http://localhost:3000`
- Owner setup: `http://localhost:3000/owner/setup`
- Owner dashboard: `http://localhost:3000/owner/dashboard`
- Waiter panel: `http://localhost:3000/waiter/orders`
- Customer flow: `http://localhost:3000/table/12`
- Backend API: `http://localhost:4000/api`

## Seeder Login

- Owner
  - email: `owner@goldendragon.local`
  - password: `owner123`
- Waiter
  - email: `waiter@goldendragon.local`
  - password: `waiter123`

## Prisma Commands

```bash
npm run prisma:push -w Backend
npm run prisma:seed -w Backend
```

## Catatan

- File env lokal sudah dibuat:
  - `Backend/.env`
  - `frontend/.env.local`
- Database Supabase sudah saya `push` dan `seed`.
- Cloudinary sudah terhubung di backend upload owner.
- Default data tetap bersifat boilerplate; owner masih bisa mengubah branding, warna, menu, promo, dan tim operasional.
