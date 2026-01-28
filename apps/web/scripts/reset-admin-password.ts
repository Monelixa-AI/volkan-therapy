import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return `pbkdf2$120000$${salt}$${hash}`;
}

async function main() {
  const newPassword = 'Volkan2025!';
  const hashedPassword = hashPassword(newPassword);

  console.log('🔐 Resetting admin password...\n');

  const updated = await prisma.adminUser.update({
    where: { email: 'socif@yahoo.com' },
    data: { passwordHash: hashedPassword }
  });

  console.log(`✅ Password updated for: ${updated.email}`);
  console.log('\n✨ Done! You can now login with the new password.');
}

main()
  .catch((error) => {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
