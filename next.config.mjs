/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable static exports
  output: 'export',
  // Configure images for static export
  images: {
    unoptimized: true,
  },
  // Add trailing slash for better compatibility
  trailingSlash: true,
  // Disable server-side rendering for static export
  // This ensures all pages are pre-rendered at build time
  experimental: {
    appDir: true,
  },
  // Add any other configurations you might need
}

export default nextConfig
