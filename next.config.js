/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'images.cnft.tools', 'ipfs.jpgstoreapis.com'],
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
