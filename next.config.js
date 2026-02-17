/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: WebSocket "closed before connection" errors in dev are expected
  // due to Strict Mode's double-mount behavior. This doesn't affect production.
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig