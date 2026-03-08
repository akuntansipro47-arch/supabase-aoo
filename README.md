# Supabase Application

Aplikasi yang dibangun ulang dengan Next.js dan Supabase, siap deploy ke Vercel.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka [http://localhost:3000](http://localhost:3000)

## Struktur Project

- `app/` - Next.js App Router
- `lib/supabase.ts` - Konfigurasi Supabase client
- `.env.local` - Environment variables (jangan di-commit)

## Deploy ke Vercel

1. Push ke GitHub
2. Connect repository ke Vercel
3. Add environment variables di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Configuration

Project sudah terkoneksi dengan Supabase:
- URL: https://efkkdeoheekcxwirungu.supabase.co
- Auto-generated anon key sudah dikonfigurasi
