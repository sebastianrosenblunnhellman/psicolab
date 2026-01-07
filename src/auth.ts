import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { LoginSchema } from "@/schemas"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.passwordHash) return null;

          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

          if (passwordsMatch) {
             if (!user.emailVerified) {
                 throw new Error("EmailNotVerified");
             }
             return user;
          }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        
        // Fetch fresh profile data to get the avatar
        try {
            const profile = await prisma.profile.findUnique({
                where: { userId: token.sub },
                select: { avatarUrl: true }
            });
            if (profile?.avatarUrl) {
                session.user.image = profile.avatarUrl;
            }
        } catch (error) {
            console.error("Error fetching profile for session", error);
        }
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
})
