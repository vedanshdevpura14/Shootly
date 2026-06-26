import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    id: string;
  }
  interface Session {
    user: {
      name: string;
      email: string;
      role: string;
      id: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
    name: string;
  }
}