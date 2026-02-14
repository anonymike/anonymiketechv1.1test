/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  reactStrictMode: true,
  // Ensure static files are served properly
  staticPageGenerationTimeout: 0,
}

export default nextConfig
