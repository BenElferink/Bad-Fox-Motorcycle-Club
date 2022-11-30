/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  api: {
    responseLimit: false,
  },
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'raw.githubusercontent.com',
      'images.cnft.tools',
      'alwaysinvert.mypinata.cloud',
    ],
  },
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    }
    return config
  },
}

module.exports = nextConfig
