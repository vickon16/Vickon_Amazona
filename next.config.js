/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },

   experimental: {
    modularizeImports: {
      "@mui/material": {
        transform: "@mui/material/{{member}}",
      },
      "@mui/icons-material": {
        transform: "@mui/icons-material/{{member}}",
      },
    },
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
