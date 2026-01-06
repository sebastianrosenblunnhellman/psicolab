import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in url parameters (e.g. ?error=AccessDenied)
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Logic for middleware protection if needed
      // For now, we allow access to everything, specific protection can be done in pages or layouts
      return true;
    },
  },
  providers: [], 
} satisfies NextAuthConfig
