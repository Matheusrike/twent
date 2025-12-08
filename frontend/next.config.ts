import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/response/:path*",
        destination: "http://localhost:3333/:path*",
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3333",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
