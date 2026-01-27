import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminFromSession } from "@/lib/admin-auth";
import { sendTestEmail } from "@/lib/email";

const schema = z.object({
  to: z.string().email(),
  message: z.string().min(1)
});

export async function POST(request: Request) {
  const admin = await getAdminFromSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const payload = schema.parse(await request.json());
    const result = await sendTestEmail(payload.to, payload.message);
    return NextResponse.json({ success: result.success });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Test gonderilemedi." }, { status: 500 });
  }
}
