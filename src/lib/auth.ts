import { timingSafeEqual } from 'node:crypto';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      id: 'admin',
      name: 'Admin password',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const configuredPassword = process.env.ADMIN_PASSWORD;
        const submittedPassword = credentials?.password;

        if (!configuredPassword || !submittedPassword) return null;

        const configured = Buffer.from(configuredPassword);
        const submitted = Buffer.from(submittedPassword);
        if (configured.length !== submitted.length) return null;
        if (!timingSafeEqual(configured, submitted)) return null;

        return {
          id: 'qwikkaam-admin',
          name: 'Qwikkaam Admin',
          phone: 'admin',
          role: 'ADMIN',
        };
      },
    }),
    CredentialsProvider({
      name: 'OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null;

        // Find the OTP code
        const otpRecord = await prisma.otpCode.findFirst({
          where: {
            phone: credentials.phone,
            code: credentials.otp,
            used: false,
            expiresAt: { gt: new Date() },
          },
        });

        if (!otpRecord) return null;

        // Mark OTP as used
        await prisma.otpCode.update({
          where: { id: otpRecord.id },
          data: { used: true },
        });

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              phone: credentials.phone,
              name: 'Qwikkaam User',
              city: 'Bhilai',
              area: 'Risali Sector',
              pincode: '490006',
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = session.user || ({} as any);
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
