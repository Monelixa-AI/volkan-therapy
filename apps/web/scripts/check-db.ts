import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking database...\n');

  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'desc' }
  });

  console.log(`📊 Total services found: ${services.length}\n`);

  if (services.length > 0) {
    services.forEach((service, idx) => {
      console.log(`${idx + 1}. ${service.title} (${service.slug})`);
      console.log(`   Category: ${service.category}`);
      console.log(`   Active: ${service.isActive}`);
      console.log(`   Created: ${service.createdAt.toLocaleDateString('tr-TR')}`);
      console.log('');
    });
  } else {
    console.log('❌ NO SERVICES FOUND IN DATABASE!');
    console.log('\n📝 Database is empty. You need to add services via:');
    console.log('   1. Admin panel: http://localhost:3001/admin/services');
    console.log('   2. Or restore from backup if you had data before');
  }

  // Check other tables
  const adminCount = await prisma.adminUser.count();
  const blogCount = await prisma.blogPost.count();
  const bookingCount = await prisma.booking.count();
  const contactCount = await prisma.contactSubmission.count();

  console.log('\n📋 Other tables:');
  console.log(`   - Admin users: ${adminCount}`);
  console.log(`   - Blog posts: ${blogCount}`);
  console.log(`   - Bookings: ${bookingCount}`);
  console.log(`   - Contact submissions: ${contactCount}`);
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
