/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' to allow API routes to work
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Ensure API routes work in production
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
