/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "i.imgur.com",
        protocol: "https",
      },
      {
        hostname: "pbs.twimg.com",
        protocol: "https",
      },
      {
        hostname: "example.com",
        protocol: "http",
      },
    ],
  },
};

export default nextConfig;
