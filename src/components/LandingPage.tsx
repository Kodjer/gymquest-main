// src/components/LandingPage.tsx
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { setNativeSession } from "../pages/_app";

// Detect Capacitor native APK context
function useIsNative() {
  const [isNative, setIsNative] = useState(false);
  useEffect(() => {
    // window.Capacitor is injected by the Capacitor runtime in APK
    setIsNative(
      typeof window !== "undefined" &&
      !!(window as any).Capacitor?.isNativePlatform?.()
    );
  }, []);
  return isNative;
}

export function LandingPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const isNative = useIsNative();

  useEffect(() => {
    if (session) window.location.href = "/";
  }, [session]);

  // Показываем ошибку если NextAuth вернул error в URL
  useEffect(() => {
    if (router.query.error) {
      const errMap: Record<string, string> = {
        OAuthSignin: "Ошибка входа через Google",
        OAuthCallback: "Ошибка ответа от Google",
        OAuthCreateAccount: "Не удалось создать аккаунт",
        Default: "Ошибка авторизации",
      };
      setError(errMap[router.query.error as string] || errMap.Default);
    }
  }, [router.query.error]);

  const callbackUrl = "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isNative) {
        // Нативный APK: используем свой endpoint, без NextAuth cookies
        const res = await fetch("/api/auth/native-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Неверный email или пароль");
          setLoading(false);
          return;
        }
        localStorage.setItem("gymquest_native_token", data.token);
        setNativeSession(data.user);
        window.location.href = "/";
      } else {
        const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });
        setLoading(false);
        if (res?.error) setError("Неверный email или пароль");
        else window.location.href = "/";
      }
    } catch (err: any) {
      setError(err?.message || "Ошибка соединения");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }
      if (isNative) {
        // После регистрации — сразу логинимся нативно
        const loginRes = await fetch("/api/auth/native-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) {
          setError("Аккаунт создан! Войдите с вашими данными.");
          setLoading(false);
          setTab("login");
          return;
        }
        localStorage.setItem("gymquest_native_token", loginData.token);
        setNativeSession(loginData.user);
        window.location.href = "/";
      } else {
        const signInRes = await signIn("credentials", { email, password, callbackUrl, redirect: false });
        setLoading(false);
        if (signInRes?.error) setError(signInRes.error);
        else window.location.href = "/";
      }
    } catch (err: any) {
      setError(err?.message || "Ошибка соединения");
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setLoading(true);
    setError("");
    signIn("google", { callbackUrl: "/" }).catch(() => {
      setError("Ошибка входа через Google");
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex flex-col items-center justify-center p-5">
      <div className="w-full" style={{ maxWidth: 360 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 border-2 border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 6.5h11M6.5 17.5h11M4 10h16M4 14h16"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">GymQuest</h1>
          <p className="text-purple-200 text-sm mt-1">Превратите фитнес в игру</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
          {/* Tabs */}
          <div className="flex mb-4 bg-black/20 rounded-xl p-1 gap-1">
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                tab === "login" ? "bg-white text-purple-700" : "text-white/60"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                tab === "register" ? "bg-white text-purple-700" : "text-white/60"
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={tab === "login" ? handleLogin : handleRegister}>
            <div className="space-y-2.5">
              {tab === "register" && (
                <input
                  type="text"
                  placeholder="Имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 text-white rounded-xl border border-white/20 focus:outline-none focus:border-white/50 placeholder-white/40 text-sm"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 text-white rounded-xl border border-white/20 focus:outline-none focus:border-white/50 placeholder-white/40 text-sm"
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 text-white rounded-xl border border-white/20 focus:outline-none focus:border-white/50 placeholder-white/40 text-sm"
              />
            </div>

            {error && (
              <div className="mt-3 text-red-300 text-xs text-center bg-red-500/20 rounded-lg py-2 px-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-3 bg-white text-purple-700 font-bold rounded-xl disabled:opacity-50 transition-all text-sm"
            >
              {loading ? "Загрузка..." : tab === "login" ? "Войти" : "Создать аккаунт"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/40 text-xs">или</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Google sign-in — only shown in browser, not in APK (would open external browser) */}
          {!isNative && (
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 disabled:opacity-50 transition-all text-sm font-medium"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Войти через Google
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
