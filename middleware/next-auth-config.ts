import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';
import { Session, User as NextAuthUser } from 'next-auth';

interface User {
  id: string;
  email: string;
  password: string;
}

interface Credentials {
  email: string;
  password: string;
}

// A simple in-memory store for users (use a real database in production)
const users: User[] = [];

const nextAuthConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials: Credentials | undefined) => {
        const user = users.find(user => user.email === credentials?.email);
        if (user && bcrypt.compareSync(credentials?.password || '', user.password)) {
          return { id: user.id, email: user.email };
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
    async jwt({ token, user }: { token: JWT; user?: User | NextAuthUser }) {
      if (user) {
        token.id = user.id;
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
