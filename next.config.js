/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns : [
      {
        protocol : "https",
        hostname : "cdn.sanity.io",
        port : "",
      }
    ]
  },
};

module.exports = nextConfig
