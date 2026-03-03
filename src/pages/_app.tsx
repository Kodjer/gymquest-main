// src/pages/_app.tsx
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ThemeProvider } from "../lib/ThemeContext";

const VERCEL_BASE = "https://gymquest-pied.vercel.app";
const NATIVE_SESSION_KEY = "gymquest_native_session";

// Когда APK загружает статические файлы локально (capacitor://localhost),
// перехватываем fetch:
// - /api/auth/session → отдаём из localStorage (нативная сессия)
// - остальные /api/… → проксируем на Vercel
if (typeof window !== "undefined" && (
  !!(window as any)?.Capacitor?.isNativePlatform?.() ||
  window.location.protocol === "capacitor:"
)) {
  const _originalFetch = window.fetch.bind(window);
  const CAPACITOR_ORIGIN = "capacitor://localhost";

  // Извлекаем путь из URL (поддерживает "/api/..." и "capacitor://localhost/api/...")
  function extractPath(url: string): string | null {
    if (url.startsWith("/")) return url;
    if (url.startsWith(CAPACITOR_ORIGIN)) return url.slice(CAPACITOR_ORIGIN.length) || "/";
    return null;
  }

  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    const rawUrl = typeof input === "string"
      ? input
      : input instanceof Request
        ? input.url
        : input.toString();

    const path = extractPath(rawUrl);

    // Перехватываем запрос сессии NextAuth — возвращаем нативную сессию из localStorage
    if (path && (path === "/api/auth/session" || path.startsWith("/api/auth/session?"))) {
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

    // Перенаправляем все локальные пути на Vercel
    if (path) {
      if (typeof input === "string" || input instanceof URL) {
        return _originalFetch(VERCEL_BASE + path, {
          ...init,
          headers: { ...((init?.headers || {}) as Record<string, string>), ...authHeaders },
        });
      }
      if (input instanceof Request) {
        const newHeaders = new Headers(input.headers);
        if (nativeToken) newHeaders.set("X-Native-Auth", nativeToken);
        return _originalFetch(new Request(VERCEL_BASE + path, { ...input, headers: newHeaders }), undefined);
      }
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
