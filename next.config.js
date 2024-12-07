/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.jpgstoreapis.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.cnft.tools',
        pathname: '**',
      },
    ],
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
