import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const category = searchParams.get("category");

    const where: any = {};
    if (city) {
      where.city = { contains: city }; // ← remove mode: "insensitive"
    }
    if (category && category !== "All Categories") {
      where.tags = { contains: category }; // ← remove mode: "insensitive"
    }

    const professionals = await prisma.professional.findMany({
      where,
      include: { portfolios: true },
      orderBy: { rating: "desc" },
    });

    return NextResponse.json(professionals);
  } catch (error) {
    console.error("Failed to fetch professionals:", error);
    return NextResponse.json(
      { error: "Failed to fetch professionals" },
      { status: 500 }
    );
  }
}