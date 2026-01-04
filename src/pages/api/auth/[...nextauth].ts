import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      sendVerificationRequest: async ({ identifier: email, url }) => {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to: email,
            subject: "Войдите в GymQuest",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Добро пожаловать в GymQuest! 💪</h2>
                <p style="color: #666; font-size: 16px;">Нажмите на кнопку ниже, чтобы войти в приложение:</p>
                <a href="${url}" style="display: inline-block; background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
                  Войти в GymQuest
                </a>
                <p style="color: #999; font-size: 14px;">Или скопируйте эту ссылку в браузер:</p>
                <p style="color: #999; font-size: 12px; word-break: break-all;">${url}</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">Если вы не запрашивали этот email, просто проигнорируйте его.</p>
              </div>
            `,
          });
        } catch (error) {
          console.error("Resend email error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
