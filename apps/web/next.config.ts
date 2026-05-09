import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  //optimizeFonts: false,
  allowedDevOrigins: ['handyman.local'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      } as const,
    ],
  },
  bundlePagesRouterDependencies: true,
};

export default withNextIntl(nextConfig);
