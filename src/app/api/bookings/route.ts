import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // 1. Destructure fields
    const { professionalId, clientName, clientEmail, eventStartDate, eventEndDate, eventType, message, amount, status } = body;

    // 2. Validate Required Fields
    if (!professionalId || !clientName || !eventStartDate || !eventEndDate || !eventType) {
      return NextResponse.json({ error: "Missing required fields (Start Date, End Date, etc.)" }, { status: 400 });
    }

    // 3. Validate ID is a number
    const proIdNum = parseInt(professionalId);
    if (isNaN(proIdNum)) {
      return NextResponse.json({ error: "Invalid Professional ID format" }, { status: 400 });
    }

    // 4. Date Logic Validation
    const start = new Date(eventStartDate);
    const end = new Date(eventEndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    if (start > end) {
      return NextResponse.json({ error: "End date cannot be before start date" }, { status: 400 });
    }

    // 5. Validate Amount (Handle NaN gracefully)
    const parsedAmount = parseInt(amount) || 0;

    // 6. Create Booking
    const booking = await prisma.booking.create({
      data: {
        professionalId: proIdNum,
        clientName,
        clientEmail: clientEmail || null,
        eventStartDate: start,   
        eventEndDate: end,       
        eventType, // Will save "Inquiry", "Wedding", "Individual", etc.
        message: message || null,
        amount: parsedAmount, // Safe for 0 or actual price
        status: status || "Pending", // Defaults to Pending if not sent
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}


// ... (Keep your existing GET function here)

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
      include: { professional: true },
    });

    if (!user?.professional) {
      return NextResponse.json([]);
    }

    const bookings = await prisma.booking.findMany({
      where: { professionalId: user.professional.id },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}