import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Matikan optimasi font karena VPS tidak bisa akses Google Fonts
  optimizeFonts: false,
  allowedDevOrigins: ['handyman.local'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      } as const,
    ],
  },
};

export default withNextIntl(nextConfig);
