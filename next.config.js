/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  devIndicators: {
    autoPrerender: false,
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    swcPlugins: [["@swc-jotai/react-refresh", {}]],
  },
};

export default nextConfig;
