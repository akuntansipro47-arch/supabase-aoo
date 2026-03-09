/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Disable strict mode for production
  reactStrictMode: false,
  // Optimize for Vercel
  swcMinify: true,
  // Images optimization
  images: {
    domains: ['efkkdeoheekcxwirungu.supabase.co'],
    unoptimized: true
  },
  // Ensure proper API routes work
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      }
    ]
  }
}

module.exports = nextConfig
