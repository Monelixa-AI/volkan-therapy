import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createResetToken, hashResetToken } from "@/lib/admin-auth";
import { sendAdminPasswordResetEmail } from "@/lib/email";

const forgotSchema = z.object({
  email: z.string().email()
});

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    const payload = forgotSchema.parse(await request.json());
    const admin = await prisma.adminUser.findUnique({
      where: { email: payload.email }
    });

    if (admin) {
      const token = createResetToken();
      const tokenHash = hashResetToken(token);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.adminPasswordReset.deleteMany({
        where: { adminId: admin.id }
      });

      await prisma.adminPasswordReset.create({
        data: {
          adminId: admin.id,
          tokenHash,
          expiresAt
        }
      });

      const resetUrl = `${getBaseUrl()}/admin/reset-password/${token}`;
      await sendAdminPasswordResetEmail(admin.email, resetUrl);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Gecersiz e-posta adresi." }, { status: 400 });
    }
    return NextResponse.json({ error: "Islem basarisiz." }, { status: 500 });
  }
}
