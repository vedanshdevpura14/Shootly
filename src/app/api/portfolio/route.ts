import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

// GET - Fetch user's portfolio
export async function GET(req: Request) {
  try {
    const token = await getToken({ req: req as NextRequest, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
      include: { professional: true },
    });

    if (!user?.professional) {
      return NextResponse.json({ error: "Professional profile not found" }, { status: 404 });
    }

    const portfolios = await prisma.portfolio.findMany({
      where: { professionalId: user.professional.id },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ portfolios, professional: user.professional });
  } catch (error: any) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}