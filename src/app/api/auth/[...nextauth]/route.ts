/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthService } from "@/services/auth.service";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { type: "boolean" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Vui lòng nhập email và mật khẩu');
          }

          const result = await AuthService.login(
            credentials.email,
            credentials.password
          );

          return {
            id: result.user.user_id.toString(),
            email: result.user.email,
            name: result.user.username,
            avatar: result.user.avatar,
            remember: credentials.remember === "true"
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    })
  ],
  pages: {
    signIn: '/', // Trang đăng nhập custom
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.avatar = user.avatar;
        if (!user.remember) {
          token.maxAge = 0; // Session expires when browser closes
        } else {
          token.maxAge = 30 * 24 * 60 * 60; // 30 days if remember
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).avatar = token.avatar;
      }
      return session;
    },
  }
});

export { handler as GET, handler as POST }; 