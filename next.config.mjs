import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Serve modern formats — AVIF/WebP are far smaller than the source PNGs at
    // visually identical quality. next/image picks the best the browser accepts.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "www.albatros.uz" }],
  },
};

export default withNextIntl(nextConfig);
