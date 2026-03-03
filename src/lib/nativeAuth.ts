// Утилиты для нативной сессии в Capacitor APK
const NATIVE_SESSION_KEY = "gymquest_native_session";

export function setNativeSession(user: { id: string; email: string; name?: string | null }) {
  const session = {
    user: { name: user.name || user.email, email: user.email, image: null, id: user.id },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
  localStorage.setItem(NATIVE_SESSION_KEY, JSON.stringify(session));
}

export function clearNativeSession() {
  localStorage.removeItem(NATIVE_SESSION_KEY);
  localStorage.removeItem("gymquest_native_token");
  localStorage.removeItem("gymquest_native_user");
}
