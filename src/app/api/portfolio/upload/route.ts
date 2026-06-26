import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const token = await getToken({ req: req as NextRequest, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user's Professional record
    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
      include: { professional: true },
    });

    if (!user?.professional) {
      return NextResponse.json({ error: "Professional profile not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const caption = formData.get("caption") as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const uploadedImages = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${user.professional.slug}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filepath = path.join(uploadsDir, filename);

      // Write file to disk
      await writeFile(filepath, buffer);

      // Save to database
      const portfolio = await prisma.portfolio.create({
        data: {
          imageUrl: `/uploads/${filename}`,
          caption: caption || null,
          professionalId: user.professional.id,
        },
      });

      uploadedImages.push(portfolio);
    }

    return NextResponse.json({
      message: `${uploadedImages.length} photo(s) uploaded successfully!`,
      images: uploadedImages,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}