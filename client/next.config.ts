import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wpthemes.themehunk.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "websitedemos.net",
        pathname: "/**",
      },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;

