import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin || "";
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Пароль должен быть не менее 6 символов" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: "Пользователь с таким email уже существует" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name: name || email.split("@")[0],
      password: hashedPassword,
    },
  });

  return res.status(201).json({ success: true });
}
