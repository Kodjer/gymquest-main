// src/lib/getAuthSession.ts
// Единая функция получения сессии — работает и через NextAuth cookies, и через нативный APK токен
import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export async function getAuthSession(req: NextApiRequest, res: NextApiResponse) {
  // 1. Пробуем стандартную NextAuth сессию (браузер/Vercel)
  const session = await getServerSession(req, res, authOptions);
  if (session?.user?.email) return session;

  // 2. Нативный APK: проверяем заголовок X-Native-Auth (base64: "userId:email:timestamp")
  const nativeToken = req.headers["x-native-auth"] as string | undefined;
  if (nativeToken) {
    try {
      const decoded = Buffer.from(nativeToken, "base64").toString("utf-8");
      const [userId, email] = decoded.split(":");
      if (email && email.includes("@")) {
        return {
          user: { id: userId, email, name: email.split("@")[0] },
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
      }
    } catch {}
  }

  return null;
}
