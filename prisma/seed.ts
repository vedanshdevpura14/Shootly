import { PrismaClient } from './generated/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { professionals } from '../src/data/dummyData';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.booking.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.professional.deleteMany();

  console.log('Seeding database...');

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

const allPros = await prisma.professional.findMany();

for (const pro of allPros) {
  await prisma.portfolio.createMany({
    data: Array.from({ length: 12 }).map((_, i) => ({
      imageUrl: `https://picsum.photos/seed/${pro.slug}-${i + 1}/600/${600 + (i % 3) * 150}`,
      professionalId: pro.id,
    })),
  });
}
  const rahul = await prisma.professional.findFirst({ where: { name: 'Rahul Sharma' } });

  if (rahul) {
    await prisma.portfolio.createMany({
      data: Array.from({ length: 12 }).map((_, i) => ({
        imageUrl: `https://picsum.photos/seed/p-${i + 1}/600/${600 + (i % 3) * 150}`,
        professionalId: rahul.id,
      })),
    });

    await prisma.booking.createMany({
      data: [
        { clientName: 'Ananya Sethi', eventDate: 'Dec 15, 2024', eventType: 'Wedding', status: 'Pending', amount: 35000, professionalId: rahul.id },
        { clientName: 'Vikram Rao', eventDate: 'Dec 12, 2024', eventType: 'Product', status: 'Accepted', amount: 20000, professionalId: rahul.id },
        { clientName: 'Meera Kapoor', eventDate: 'Dec 10, 2024', eventType: 'Portrait', status: 'Completed', amount: 12000, professionalId: rahul.id },
        { clientName: 'Arjun Nair', eventDate: 'Dec 8, 2024', eventType: 'Pre-Wedding', status: 'Completed', amount: 15000, professionalId: rahul.id },
        { clientName: 'Sneha Iyer', eventDate: 'Dec 5, 2024', eventType: 'Reels', status: 'Pending', amount: 8000, professionalId: rahul.id },
      ],
    });
  }

  console.log(`✅ Seeded ${professionals.length} professionals, portfolios, and bookings!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });