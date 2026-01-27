import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, hashResetToken } from "@/lib/admin-auth";

const resetSchema = z.object({
  token: z.string().min(32),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const payload = resetSchema.parse(await request.json());
    const tokenHash = hashResetToken(payload.token);
    const reset = await prisma.adminPasswordReset.findUnique({
      where: { tokenHash }
    });

    if (!reset || reset.usedAt || reset.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "Gecersiz veya suresi dolmus token." }, { status: 400 });
    }

    const passwordHash = hashPassword(payload.password);

    await prisma.adminUser.update({
      where: { id: reset.adminId },
      data: { passwordHash }
    });

    await prisma.adminPasswordReset.update({
      where: { tokenHash },
      data: { usedAt: new Date() }
    });

    await prisma.adminSession.deleteMany({
      where: { adminId: reset.adminId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Islem basarisiz." }, { status: 500 });
  }
}
