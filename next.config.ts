import type { NextConfig } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

const nextConfig: NextConfig = {
  async rewrites() {
    if (!API_BASE) return []
    // Proxy all `/api/*` requests to the external API base URL
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE}/:path*`,
      },
    ]
  },
}

export default nextConfig
