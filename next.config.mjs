/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  images: {
    remotePatterns: [
      // Cloudinary — product images
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Backend-served images (adjust hostname when deployed)
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
