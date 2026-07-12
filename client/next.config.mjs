/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
