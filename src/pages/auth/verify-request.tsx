// src/pages/auth/verify-request.tsx
import Link from "next/link";

export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <div>
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-3xl font-bold mb-2">Проверьте вашу почту</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Мы отправили вам ссылку для входа. Перейдите по ссылке из письма,
            чтобы войти в приложение.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
            <p className="mb-2">
              💡 <strong>Подсказка:</strong>
            </p>
            <ul className="text-left space-y-1 ml-4">
              <li>• Проверьте папку "Спам" если письмо не пришло</li>
              <li>• Ссылка действительна 24 часа</li>
              <li>• Можете закрыть эту вкладку</li>
            </ul>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
