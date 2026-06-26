import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const professional = await prisma.professional.findUnique({
    where: { userId: token.id as string },
  });

  if (!professional) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  return NextResponse.json(professional);
}

export async function PUT(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  console.log("PUT /api/dashboard/profile - token:", token); // ← add this
  
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, city, category, price, bio } = body;

  try {
    const professional = await prisma.professional.update({
      where: { userId: token.id as string },
      data: {
        name,
        city,
        category,
        price: parseInt(price) || 0,
        bio,
      },
    });
    return NextResponse.json(professional);
  } catch (error) {
    console.error("Profile update error:", error); // ← and this
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}