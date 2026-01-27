import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, createAdminSession } from "@/lib/admin-auth";

const setupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const payload = setupSchema.parse(await request.json());
    const existing = await prisma.adminUser.count();
    if (existing > 0) {
      return NextResponse.json(
        { error: "Kurulum tamamlanmış." },
        { status: 409 }
      );
    }
    const admin = await prisma.adminUser.create({
      data: {
        name: payload.name,
        email: payload.email,
        passwordHash: hashPassword(payload.password)
      }
    });
    await createAdminSession(admin.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Kurulum başarısız." }, { status: 500 });
  }
}
