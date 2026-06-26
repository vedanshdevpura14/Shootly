import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId, action, newDates, newPrice } = body;

    // 2. Parse ID
    const bookingIdNum = parseInt(bookingId);
    if (isNaN(bookingIdNum)) {
      return NextResponse.json({ error: "Invalid Booking ID format" }, { status: 400 });
    }

    // 3. Get User & Professional Profile
    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
      include: { professional: true },
    });

    if (!user?.professional) {
      return NextResponse.json({ error: "Professional profile not found" }, { status: 403 });
    }

    // 4. Fetch Booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingIdNum },
    });

    if (!booking || booking.professionalId !== user.professional.id) {
      return NextResponse.json({ error: "Booking not found or access denied" }, { status: 404 });
    }

    // 5. Validate Action
    const validActions = ["Accepted", "Declined", "Countered", "Pending", "Completed", "Cancelled"];
    if (!validActions.includes(action)) {
      console.error("Invalid action received:", action);
      return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });
    }

    // 6. UPDATE DATABASE FIRST
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingIdNum },
      data: { status: action },
    });

    // 7. Send Email (Non-Blocking)
    if (booking.clientEmail) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        let emailSubject = "";
        let emailText = "";

        // Helper for readable dates
        const formatRange = () => {
            if (!booking.eventStartDate || !booking.eventEndDate) return "Dates pending confirmation";
            return `${booking.eventStartDate.toDateString()} to ${booking.eventEndDate.toDateString()}`;
        };

        // Detect if it's an Inquiry (Client Type) or a Standard Booking
        const isInquiry = ["Individual", "Corporate", "Event Organizer"].includes(booking.eventType);

        if (action === "Accepted") {
          if (isInquiry) {
            // INQUIRY ACCEPTED
            emailSubject = "Inquiry Accepted! - Shootly";
            emailText = `Hi ${booking.clientName},\n\nGreat news! Your inquiry (${booking.eventType}) for ${formatRange()} has been accepted by ${user.professional.name}.\n\nWe have reviewed your request: "${booking.message}".\n\nPlease proceed to the "Book Now" section on the platform to enter the agreed amount and complete the booking.\n\nLooking forward to working with you!`;
          } else {
            // BOOKING CONFIRMED
            emailSubject = "Booking Confirmed! - Shootly";
            emailText = `Hi ${booking.clientName},\n\nGreat news! Your booking for a ${booking.eventType} (${formatRange()}) has been confirmed.\n\nTotal Amount: ₹${booking.amount.toLocaleString()}\n\nLooking forward to working with you!\n${user.professional.name}`;
          }
        } else if (action === "Declined") {
          if (isInquiry) {
            // INQUIRY DECLINED
            emailSubject = "Update Regarding Your Inquiry - Shootly";
            emailText = `Hi ${booking.clientName},\n\nThank you for your interest. Unfortunately, ${user.professional.name} is not available for your ${booking.eventType} inquiry for ${formatRange()}.\n\nPlease feel free to browse other professionals on Shootly.`;
          } else {
            // BOOKING DECLINED
            emailSubject = "Update Regarding Your Booking Request - Shootly";
            emailText = `Hi ${booking.clientName},\n\nThank you for your interest. Unfortunately, ${user.professional.name} is not available for the ${booking.eventType} shoot requested for ${formatRange()}.\n\nPlease feel free to browse other professionals on Shootly.`;
          }
        } else if (action === "Countered") {
          emailSubject = "Counter Offer for Your Booking - Shootly";
          
          const dateDisplay = booking.eventStartDate 
            ? booking.eventStartDate.toDateString() 
            : "the requested date";

          emailText = `Hi ${booking.clientName},\n\nThank you for your ${isInquiry ? 'inquiry' : 'booking'} starting on ${dateDisplay}. Unfortunately, ${user.professional.name} is unavailable on that date.\n\nHowever, they are available on: ${newDates}.\nThe price is ₹${newPrice}.\n\nPlease let them know if these alternative dates work for you!`;
        }

        if (emailSubject && emailText) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: booking.clientEmail,
            subject: emailSubject,
            text: emailText,
          });
          console.log("Email sent successfully to", booking.clientEmail);
        }
      } catch (emailError) {
        console.error("Failed to send email (Booking updated anyway):", emailError);
      }
    } else {
      console.warn("No client email found for booking:", bookingIdNum);
    }

    return NextResponse.json({ success: true, booking: updatedBooking });

  } catch (error) {
    console.error("Booking Action API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}