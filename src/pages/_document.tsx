import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        {/* Viewport — обязателен для мобилки */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* PWA метатеги */}
        <meta name="application-name" content="GymQuest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GymQuest" />
        <meta name="description" content="Геймификация задач с системой уровней, XP и достижений" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Favicon и иконки */}
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/icon.svg" />
        
        {/* Splash screens для iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-startup-image" href="/icon.svg" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
