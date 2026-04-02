import type { NextConfig } from "next";
// @ts-ignore
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  turbopack: {},
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

export default process.env.NODE_ENV === "development" ? nextConfig : pwaConfig;
