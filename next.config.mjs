/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    siteDescription: "Memberikan artikel informasi ke seluruh pengguna tanpa harus membayar atau berlangganan",
    siteKeywords: "Article, Blog, Education",
    siteUrl: "http://localhost:3000",
    siteTitle: "Penaly"
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      }
    ]
  }
};

export default nextConfig;
