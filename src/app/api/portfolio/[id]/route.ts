import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { unlink } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";

// DELETE - Remove a portfolio image
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: req as NextRequest, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const portfolioId = parseInt(params.id);

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: { professional: { include: { user: true } } },
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Verify ownership
    if (portfolio.professional.user?.id !== token.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete file from disk
    try {
      const filepath = path.join(process.cwd(), "public", portfolio.imageUrl);
      await unlink(filepath);
    } catch (e) {
      // File might already be deleted, that's OK
    }

    // Delete from database
    await prisma.portfolio.delete({ where: { id: portfolioId } });

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}