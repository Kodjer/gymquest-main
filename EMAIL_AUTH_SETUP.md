# Настройка Email авторизации для GymQuest

Авторизация работает через Magic Link - пользователь вводит email, получает письмо со ссылкой для входа.

## Вариант 1: Gmail (для продакшена)

### Шаги настройки:

1. **Включите двухфакторную аутентификацию** в Google аккаунте

   - Перейдите: https://myaccount.google.com/security
   - Включите "2-Step Verification"

2. **Создайте App Password**

   - Перейдите: https://myaccount.google.com/apppasswords
   - Выберите приложение: "Mail"
   - Выберите устройство: "Other" (введите "GymQuest")
   - Скопируйте сгенерированный пароль (16 символов)

3. **Обновите `.env` файл:**

```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=ваш_email@gmail.com
EMAIL_SERVER_PASSWORD=сгенерированный_app_password
EMAIL_FROM=ваш_email@gmail.com
```

## Вариант 2: Mailtrap (для разработки/тестирования)

Mailtrap перехватывает все письма и не отправляет их реально - идеально для тестов!

### Шаги настройки:

1. **Зарегистрируйтесь на Mailtrap**

   - Перейдите: https://mailtrap.io/
   - Создайте бесплатный аккаунт

2. **Получите credentials:**

   - В Mailtrap перейдите в "Email Testing" → "Inboxes"
   - Выберите inbox (или создайте новый)
   - Во вкладке "SMTP Settings" выберите "Node.js - Nodemailer"
   - Скопируйте host, port, username, password

3. **Обновите `.env` файл:**

```env
EMAIL_SERVER_HOST=sandbox.smtp.mailtrap.io
EMAIL_SERVER_PORT=2525
EMAIL_SERVER_USER=ваш_mailtrap_username
EMAIL_SERVER_PASSWORD=ваш_mailtrap_password
EMAIL_FROM=gymquest@example.com
```

## Вариант 3: Другие SMTP провайдеры

### SendGrid

```env
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=ваш_sendgrid_api_key
EMAIL_FROM=your@email.com
```

### Mailgun

```env
EMAIL_SERVER_HOST=smtp.mailgun.org
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=postmaster@ваш-домен.mailgun.org
EMAIL_SERVER_PASSWORD=ваш_mailgun_password
EMAIL_FROM=noreply@ваш-домен.com
```

### Яндекс Почта

```env
EMAIL_SERVER_HOST=smtp.yandex.ru
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=ваш_email@yandex.ru
EMAIL_SERVER_PASSWORD=ваш_пароль
EMAIL_FROM=ваш_email@yandex.ru
```

## Тестирование

После настройки:

1. Запустите приложение: `npm run dev`
2. Перейдите на http://localhost:3000
3. Нажмите "Войти"
4. Введите email
5. Проверьте:
   - **Mailtrap:** письмо в inbox
   - **Gmail:** письмо в почтовом ящике
6. Перейдите по ссылке из письма

## Устранение проблем

### Ошибка "Invalid login"

- Проверьте правильность EMAIL_SERVER_USER и PASSWORD
- Для Gmail: используйте App Password, а не обычный пароль

### Письма не приходят

- Проверьте папку Спам
- Убедитесь, что SMTP порт не заблокирован файрволом
- Для Gmail: убедитесь что включена 2FA

### Ошибка "Connection timeout"

- Проверьте интернет подключение
- Попробуйте другой порт (587 вместо 465 или наоборот)
- Проверьте EMAIL_SERVER_HOST

## Переключение провайдеров

Просто обновите переменные в `.env` и перезапустите сервер:

```bash
# Остановите сервер (Ctrl+C)
# Обновите .env
npm run dev
```

## Рекомендации

- **Разработка:** Используйте Mailtrap
- **Продакшен:** Используйте Gmail, SendGrid, или Mailgun
- **Никогда** не коммитьте файл `.env` в git!

---

Готово! 🎉 Теперь у вас работает авторизация через email.
