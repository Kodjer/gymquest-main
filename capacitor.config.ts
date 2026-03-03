import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.gymquest.app",
  appName: "GymQuest",
  // webDir используется только когда нет server.url (локальная сборка)
  webDir: "out",
  server: {
    // ── Переключение режима ──────────────────────────────────────────────────
    // Для разработки на эмуляторе:  "http://10.0.2.2:3000"
    // Для разработки на телефоне:   "http://192.168.x.x:3000"
    // Для продакшена (Vercel):       "https://gymquest-main.vercel.app"
    //
    // После деплоя на Vercel — замени URL ниже и пересобери APK.
    // ────────────────────────────────────────────────────────────────────────
    url: "https://gymquest-pied.vercel.app",
    cleartext: true, // разрешить HTTP (нужно для локального dev без HTTPS)
  },
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
