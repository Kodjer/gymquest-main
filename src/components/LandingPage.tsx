// src/components/LandingPage.tsx
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { setNativeSession } from "../lib/nativeAuth";

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
  const callbackUrl = (router.query.callbackUrl as string) || "/";

  useEffect(() => {
    if (session) window.location.href = callbackUrl || "/";
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
        localStorage.removeItem("player");
        localStorage.removeItem("gymquest_quests_cache");
        window.location.href = "/";
      } else {
        localStorage.removeItem("player");
        localStorage.removeItem("gymquest_quests_cache");
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
        localStorage.removeItem("player");
        localStorage.removeItem("gymquest_quests_cache");
        window.location.href = "/";
      } else {
        localStorage.removeItem("player");
        localStorage.removeItem("gymquest_quests_cache");
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
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 flex flex-col items-center justify-center p-5">
      <div className="w-full" style={{ maxWidth: 400 }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-5 relative">
            <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/25 shadow-xl">
              {/* Dumbbell SVG */}
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="18" width="6" height="12" rx="2" fill="white" opacity="0.9"/>
                <rect x="2" y="20" width="4" height="8" rx="1.5" fill="white"/>
                <rect x="38" y="18" width="6" height="12" rx="2" fill="white" opacity="0.9"/>
                <rect x="42" y="20" width="4" height="8" rx="1.5" fill="white"/>
                <rect x="10" y="21" width="28" height="6" rx="3" fill="white"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">GymQuest</h1>
          <p className="text-white/55 text-sm mt-2">Превратите фитнес в игру</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl shadow-black/30">
          {/* Tabs */}
          <div className="flex mb-6 bg-white/10 rounded-2xl p-1 gap-1">
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                tab === "login"
                  ? "bg-white text-purple-800 shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                tab === "register"
                  ? "bg-white text-purple-800 shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={tab === "login" ? handleLogin : handleRegister}>
            <div className="space-y-3">
              {tab === "register" && (
                <input
                  type="text"
                  placeholder="Имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white/15 text-white rounded-2xl border border-white/25 focus:outline-none focus:border-white/70 placeholder-white/50 text-sm font-medium transition-all"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-white/15 text-white rounded-2xl border border-white/25 focus:outline-none focus:border-white/70 placeholder-white/50 text-sm font-medium transition-all"
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-white/15 text-white rounded-2xl border border-white/25 focus:outline-none focus:border-white/70 placeholder-white/50 text-sm font-medium transition-all"
              />
            </div>

            {error && (
              <div className="mt-4 text-red-300 text-xs text-center bg-red-500/20 border border-red-400/30 rounded-2xl py-2.5 px-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-4 bg-white text-purple-800 font-black rounded-2xl disabled:opacity-50 transition-all text-sm shadow-xl shadow-black/20 hover:bg-white/90 active:scale-[0.98]"
            >
              {loading ? "Загрузка..." : tab === "login" ? "Войти" : "Создать аккаунт"}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}
