/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
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

// Режим сборки для Capacitor APK: статический экспорт (CAPACITOR_BUILD=true)
const isCapacitorBuild = process.env.CAPACITOR_BUILD === "true";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  turbopack: {},
  experimental: {
    webpackMemoryOptimizations: true,
  },
  // Статический экспорт для APK — грузит HTML/JS локально с телефона
  ...(isCapacitorBuild && {
    output: "export",
    images: { unoptimized: true },
  }),
};

// Для Vercel — оборачиваем PWA. Для APK — чистый конфиг без SW.
module.exports = isCapacitorBuild ? nextConfig : withPWA(nextConfig);
