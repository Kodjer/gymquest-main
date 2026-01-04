// src/components/LandingPage.tsx
import { signIn } from "next-auth/react";
import { useState } from "react";

export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Проверяем существование email
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { exists } = await response.json();

      // Проверка для регистрации
      if (authMode === "signup" && exists) {
        setError("Этот email уже зарегистрирован. Попробуйте войти.");
        setLoading(false);
        return;
      }

      // Проверка для входа
      if (authMode === "signin" && !exists) {
        setError("Email не найден. Пожалуйста, зарегистрируйтесь.");
        setLoading(false);
        return;
      }

      // Отправляем магическую ссылку
      await signIn("email", { email, callbackUrl: "/" });
    } catch (error) {
      setError("Произошла ошибка. Попробуйте еще раз.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 dark:from-purple-900 dark:via-indigo-900 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-5xl">💪</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            GymQuest
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-4">
            Превратите фитнес в игру!
          </p>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Выполняйте квесты, зарабатывайте опыт, повышайте уровень и
            достигайте своих целей
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">Квесты</h3>
            <p className="text-purple-100">
              Создавайте тренировочные задания и выполняйте их
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Опыт</h3>
            <p className="text-purple-100">
              Зарабатывайте XP и повышайте уровень своего персонажа
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Прогресс</h3>
            <p className="text-purple-100">
              Отслеживайте статистику и достижения
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => {
              setAuthMode("signup");
              setShowAuthModal(true);
              setError("");
              setEmail("");
            }}
            className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-2xl hover:bg-purple-50 transition-all hover:scale-105 w-64"
          >
            🚀 Начать приключение
          </button>

          <button
            onClick={() => {
              setAuthMode("signin");
              setShowAuthModal(true);
              setError("");
              setEmail("");
            }}
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all w-64"
          >
            Войти
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-purple-200">Бесплатно</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">∞</div>
            <div className="text-purple-200">Квестов</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">🎮</div>
            <div className="text-purple-200">Геймификация</div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Как это работает?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Регистрация</h3>
              <p className="text-purple-200">
                Войдите через email и создайте профиль
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Создайте квест
              </h3>
              <p className="text-purple-200">
                Добавьте тренировку как игровой квест
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Получайте опыт
              </h3>
              <p className="text-purple-200">
                Выполняйте квесты и прокачивайте персонажа
              </p>

              {/* Auth Modal */}
              {showAuthModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {authMode === "signup" ? "Регистрация" : "Вход"}
                      </h2>
                      <button
                        onClick={() => setShowAuthModal(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading
                          ? "Отправка..."
                          : authMode === "signup"
                          ? "Зарегистрироваться"
                          : "Войти"}
                      </button>
                    </form>

                    <div className="mt-6 text-center">
                      <button
                        onClick={() => {
                          setAuthMode(
                            authMode === "signup" ? "signin" : "signup"
                          );
                          setError("");
                        }}
                        className="text-purple-600 dark:text-purple-400 hover:underline text-sm"
                      >
                        {authMode === "signup"
                          ? "Уже есть аккаунт? Войти"
                          : "Нет аккаунта? Зарегистрироваться"}
                      </button>
                    </div>

                    <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                      Мы отправим вам ссылку для входа на указанный email
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-purple-200">
          <p className="mb-2">✨ Превратите рутину в приключение</p>
          <p className="text-sm">
            Никаких платежей. Никакой рекламы. Просто фитнес.
          </p>
        </div>
      </div>
    </div>
  );
}
