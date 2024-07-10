import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { JWT } from 'next-auth/jwt';
import { Session, User as NextAuthUser } from 'next-auth';

const prisma = new PrismaClient();

interface Credentials {
  email: string;
  password: string;
}

const nextAuthConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials: Credentials | undefined) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.employee.findUnique({
          where: { Email: credentials.email }
        });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user.employeeID.toString(), email: user.Email };
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: undefined // Set to undefined instead of null
  },
  session: {
    strategy: 'jwt' // Use strategy to specify session type
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      if (user) {
        token.id = (user as any).id; // Cast to any to avoid TypeScript error
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    }
  }
};

export default nextAuthConfig;
