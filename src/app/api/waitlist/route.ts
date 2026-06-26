import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const city = body.city?.trim().toLowerCase();

    // Validation
    if (!email || !city) {
      return NextResponse.json(
        { error: "Email and city are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if already registered (use findFirst to avoid composite key issues)
    const existing = await prisma.cityWaitlist.findFirst({
      where: {
        email: email,
        city: city,
      },
    });

    if (existing) {
      return NextResponse.json({
        message: "You're already on the waitlist!",
        alreadyRegistered: true,
      });
    }

    // Save to database
    const entry = await prisma.cityWaitlist.create({
      data: { email, city },
    });

    console.log("✅ Waitlist entry created:", entry.id);

    return NextResponse.json({
      message: "Successfully added to waitlist!",
      success: true,
    });
  } catch (error: any) {
    // Log the REAL error to your terminal
    console.error("❌ Waitlist error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}