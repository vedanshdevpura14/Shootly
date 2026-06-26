import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) {
          return null; // No user found
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null; // Invalid password
        }

        // Return the user object (excluding password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
    callbacks: {
    // Add the user's role to the JWT token
    async jwt({ token, user }) {
  if (user) {
    token.role = user.role;
    token.id = user.id;
    token.name = user.name ?? ""; // ← ADD THIS
  }
  return token;
},
async session({ session, token }) {
  if (session.user) {
    session.user.role = token.role as string;
    session.user.id = token.id as string;
    session.user.name = token.name as string ?? ""; // ← ADD THIS
  }
  return session;
},
  },
});

export { handler as GET, handler as POST };