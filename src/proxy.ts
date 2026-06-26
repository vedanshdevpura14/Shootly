import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

  // If user is logged in and trying to access login/signup, redirect them away
  if (token) {
    if (pathname === "/login" || pathname === "/signup") {
      const role = token.role as string;
      
      // Professionals go to dashboard, Clients go to home
      if (role === "PROFESSIONAL") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect dashboard routes (only professionals can access)
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    const role = token.role as string;
    if (role !== "PROFESSIONAL") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*"],
};