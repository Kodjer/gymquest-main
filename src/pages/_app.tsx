// src/pages/_app.tsx
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ThemeProvider } from "../lib/ThemeContext";

const VERCEL_BASE = "https://gymquest-pied.vercel.app";
const NATIVE_SESSION_KEY = "gymquest_native_session";

export { setNativeSession, clearNativeSession } from "../lib/nativeAuth";

// Когда APK загружает статические файлы локально (capacitor://localhost),
// перехватываем fetch:
// - /api/auth/session → отдаём из localStorage (нативная сессия)
// - остальные /api/… → проксируем на Vercel
if (typeof window !== "undefined" && (window as any)?.Capacitor?.isNativePlatform?.()) {
  const _originalFetch = window.fetch.bind(window);
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === "string" ? input : (input instanceof Request ? input.url : input.toString());

    // Перехватываем запрос сессии NextAuth — возвращаем нативную сессию из localStorage
    if (url === "/api/auth/session") {
      const stored = localStorage.getItem(NATIVE_SESSION_KEY);
      if (stored) {
        return Promise.resolve(new Response(stored, {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }));
      }
      return Promise.resolve(new Response("{}", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }));
    }

    // Добавляем нативный токен авторизации ко всем API запросам
    const nativeToken = localStorage.getItem("gymquest_native_token");
    const authHeaders: Record<string, string> = nativeToken ? { "X-Native-Auth": nativeToken } : {};

    // Перенаправляем все /api/… запросы на Vercel
    if (typeof input === "string" && input.startsWith("/")) {
      return _originalFetch(VERCEL_BASE + input, {
        ...init,
        headers: { ...((init?.headers || {}) as Record<string, string>), ...authHeaders },
      });
    }
    if (input instanceof Request && input.url.startsWith("/")) {
      const newHeaders = new Headers(input.headers);
      if (nativeToken) newHeaders.set("X-Native-Auth", nativeToken);
      return _originalFetch(new Request(VERCEL_BASE + input.url, { ...init, headers: newHeaders }), undefined);
    }
    return _originalFetch(input, init);
  };
}



export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
