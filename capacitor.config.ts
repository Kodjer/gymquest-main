import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.gymquest.app",
  appName: "GymQuest",
  // webDir — папка со статическим экспортом Next.js (npm run build:apk → out/)
  webDir: "out",
  // server.url убран → Capacitor грузит файлы ЛОКАЛЬНО из out/
  // Все /api/ запросы идут на Vercel через fetch-перехватчик в _app.tsx
  android: {
    allowMixedContent: true, // позволяет смешанный HTTP/HTTPS в dev-режиме
    backgroundColor: "#1a1a2e",
    buildOptions: {
      keystorePath: undefined,
      releaseType: "APK",
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#7c3aed",
      androidSplashResourceName: "splash",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "light",
      backgroundColor: "#7c3aed",
      overlaysWebView: true,
      hide: false,
    },
    EdgeToEdge: {
      backgroundColor: "#7c3aed",
    },
  },
};

export default config;
