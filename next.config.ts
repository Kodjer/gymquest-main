import type { NextConfig } from "next";
// @ts-ignore
import withPWA from "next-pwa";

const isCapacitor = process.env.CAPACITOR_BUILD === "true";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  ...(isCapacitor ? { output: "export", images: { unoptimized: true } } : {}),
  turbopack: {
    root: __dirname,
  },
  experimental: {
    cpus: 2,
  },
};

const pwaConfig = withPWA({
  ...nextConfig,
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

// При сборке APK (Capacitor) — PWA не нужен, используем чистый конфиг
export default (isCapacitor || process.env.NODE_ENV === "development") ? nextConfig : pwaConfig;
