import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createAdminSession, verifyPassword } from "@/lib/admin-auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional()
});

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());
    const admin = await prisma.adminUser.findUnique({
      where: { email: payload.email }
    });
    if (!admin || !verifyPassword(payload.password, admin.passwordHash)) {
      return NextResponse.json({ error: "Geçersiz giriş bilgisi." }, { status: 401 });
    }
    await createAdminSession(admin.id, Boolean(payload.rememberMe));
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Giriş başarısız." }, { status: 500 });
  }
}
