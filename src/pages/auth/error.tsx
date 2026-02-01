// src/pages/auth/error.tsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const errorMessages: Record<string, string> = {
    Configuration: "Ошибка конфигурации сервера",
    AccessDenied: "Доступ запрещен",
    Verification: "Ссылка для входа устарела или уже использована",
    Default: "Произошла ошибка при входе",
  };

  const message = errorMessages[error as string] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-red-600 dark:text-red-400">
            Ошибка входа
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
            <p className="mb-2">Что делать?</p>
            <ul className="text-left space-y-1 ml-4">
              <li>• Запросите новую ссылку для входа</li>
              <li>• Проверьте правильность email адреса</li>
              <li>• Убедитесь, что письмо не в спаме</li>
            </ul>
          </div>
        </div>

        <Link
          href="/auth/signin"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Попробовать снова
        </Link>
      </div>
    </div>
  );
}
