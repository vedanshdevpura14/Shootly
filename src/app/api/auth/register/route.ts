import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to database
    const user = await prisma.user.create({
  data: {
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role || "CLIENT",
  },
});

// Auto-create Professional profile if role is PROFESSIONAL
if (role === "PROFESSIONAL") {
  const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  await prisma.professional.create({
    data: {
      name,
      slug,
      userId: user.id,
      city: "",
      type: "Photographer",
      category: "Wedding",
      price: 0,
      image: "",
      tags: "",
      bio: "",
    },
  });
}

    // Return success (exclude password from response)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Account created successfully!",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}