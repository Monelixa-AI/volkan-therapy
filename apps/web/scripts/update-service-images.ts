import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imageUpdates = [
  { slug: 'yetiskin-rehabilitasyon', image: '/images/services/yetiskin-rehabilitasyon.png' },
  { slug: 'bel-boyun-fitigi', image: '/images/services/bel-boyun-fitigi-tedavisi.png' },
  { slug: 'serebral-palsi', image: '/images/services/serebral-palsi-rehabilitasyonu.png' },
  { slug: 'motor-gelisim-gecikmesi', image: '/images/services/gecikmis-motor-gelisim-terapisi.png' },
];

async function main() {
  console.log('🖼️ Updating service images...\n');

  for (const update of imageUpdates) {
    try {
      const updated = await prisma.service.update({
        where: { slug: update.slug },
        data: { image: update.image }
      });
      console.log(`✅ Updated: ${updated.title}`);
      console.log(`   New image: ${updated.image}`);
    } catch (error) {
      console.log(`⚠️ Skipped: ${update.slug} (not found)`);
    }
  }

  console.log('\n✨ Update completed!');
}

main()
  .catch((error) => {
    console.error('❌ Update failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
