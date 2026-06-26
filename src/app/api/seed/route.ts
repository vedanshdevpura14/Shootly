import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
import { professionals } from '@/data/dummyData';


export async function GET() {
  try {
    // 1. Clear existing data
    await prisma.booking.deleteMany();
    await prisma.portfolio.deleteMany();
    await prisma.professional.deleteMany();

    // 2. Seed Professionals
   for (const p of professionals) {
  await prisma.professional.create({
    data: {
      name: p.name,
      slug: p.name.toLowerCase().replace(/\s+/g, '-'),  // 👈 add this
      type: p.type,
      city: p.city,
      rating: p.rating,
      reviews: p.reviews,
      category: p.category,
      price: p.price,
      unit: p.unit || null,
      image: p.image,
      verified: p.verified,
      tags: p.tags.join(','),
      aiScore: p.aiScore,
    },
  });
}

    // 3. Seed Portfolio & Bookings for Rahul Sharma
    const rahul = await prisma.professional.findFirst({ where: { name: "Rahul Sharma" } });

    if (rahul) {
      await prisma.portfolio.createMany({
        data: Array.from({ length: 12 }).map((_, i) => ({
          imageUrl: `https://picsum.photos/seed/p-${i + 1}/600/${600 + (i % 3) * 150}`,
          professionalId: rahul.id,
        })),
      });

      await prisma.booking.createMany({
        data: [
          { clientName: "Ananya Sethi", eventStartDate: new Date("2024-12-15"), eventEndDate: new Date("2024-12-15"), eventType: "Wedding", status: "Pending", amount: 35000, professionalId: rahul.id },
          { clientName: "Vikram Rao", eventStartDate: new Date("2024-12-12"), eventEndDate: new Date("2024-12-12"), eventType: "Product", status: "Accepted", amount: 20000, professionalId: rahul.id },
          { clientName: "Meera Kapoor", eventStartDate: new Date("2024-12-10"), eventEndDate: new Date("2024-12-10"), eventType: "Portrait", status: "Completed", amount: 12000, professionalId: rahul.id },
          { clientName: "Arjun Nair", eventStartDate: new Date("2024-12-08"), eventEndDate: new Date("2024-12-08"), eventType: "Pre-Wedding", status: "Completed", amount: 15000, professionalId: rahul.id },
          { clientName: "Sneha Iyer", eventStartDate: new Date("2024-12-05"), eventEndDate: new Date("2024-12-05"), eventType: "Reels", status: "Pending", amount: 8000, professionalId: rahul.id },
        ],
      });
    }

    return NextResponse.json({ success: true, message: `Seeded ${professionals.length} professionals, portfolios, and bookings!` });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}