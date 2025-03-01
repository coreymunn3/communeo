/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "i.imgur.com",
        protocol: "https",
      },
      // users can upload images and links from potentiall anywhere
      // consider implementing some kind of image proxy service
      {
        protocol: "https",
        hostname: "**", // Allow all domains
      },
    ],
  },
};

export default nextConfig;
