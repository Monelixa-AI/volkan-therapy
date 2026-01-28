import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📧 Updating email settings...\n');

  const updated = await prisma.siteSettings.update({
    where: { id: 'default' },
    data: {
      senderEmail: 'onboarding@resend.dev',
      senderName: 'Volkan Özcihan',
      replyToEmail: 'socif@yahoo.com'
    }
  });

  console.log('✅ Email settings updated:');
  console.log(`   Sender: ${updated.senderName} <${updated.senderEmail}>`);
  console.log(`   Reply-To: ${updated.replyToEmail}`);
  console.log('\n✨ Done!');
}

main()
  .catch((error) => {
    console.error('❌ Update failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
