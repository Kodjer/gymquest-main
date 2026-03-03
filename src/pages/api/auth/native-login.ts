// Эндпоинт для логина из нативного APK (без NextAuth cookies/CSRF)
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS для Capacitor
  const origin = req.headers.origin || "";
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return res.status(401).json({ error: "Неверный email или пароль" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Неверный email или пароль" });
  }

  return res.status(200).json({
    token: Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString("base64"),
    user: { id: user.id, email: user.email, name: user.name },
  });
}
