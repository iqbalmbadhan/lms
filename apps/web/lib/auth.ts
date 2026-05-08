import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    Credentials({
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)
          const res = await fetch(`${process.env.API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          if (!res.ok) return null
          const { user, token } = await res.json()
          return { ...user, accessToken: token }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as Record<string, unknown>).role as string
        token.systemRole = (user as Record<string, unknown>).systemRole as string
        token.aiProvider = (user as Record<string, unknown>).aiProvider as string
        token.accessToken = (user as Record<string, unknown>).accessToken as string
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      session.user.systemRole = token.systemRole as string
      session.user.aiProvider = token.aiProvider as string
      session.user.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})
