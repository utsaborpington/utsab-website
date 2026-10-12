import type { NextConfig } from "next";
import { SITE } from "./src/lib/site";

const nextConfig: NextConfig = {
  images: {
    // Admin uploads are stored in Vercel Blob in production (see src/app/api/admin/upload/route.ts).
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  async redirects() {
    return [
      // Old WordPress URL — still shared in links/QR codes.
      { source: "/donations", destination: SITE.gofundmeUrl, permanent: false },
    ];
  },
};

export default nextConfig;
