/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'images.cnft.tools', 'ipfs.jpgstoreapis.com'],
  },
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: 'https://firebasestorage.googleapis.com/:path*',
      },
    ]
  },
  webpack: (config, options) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    }
    return config
  },
}

module.exports = nextConfig
