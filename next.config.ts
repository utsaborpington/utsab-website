import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Admin uploads are stored in Vercel Blob in production (see src/app/api/admin/upload/route.ts).
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
