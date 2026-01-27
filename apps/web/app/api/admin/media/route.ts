import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { uploadMediaObject } from "@/lib/media";

export async function GET() {
  await requireAdmin();
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ assets });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
  }

  const type = String(formData.get("type") || "IMAGE");
  const title = String(formData.get("title") || "").trim() || null;
  const altText = String(formData.get("altText") || "").trim() || null;

  try {
    const { publicUrl, storagePath, size } = await uploadMediaObject(file);
    const asset = await prisma.mediaAsset.create({
      data: {
        url: publicUrl,
        storagePath,
        type: type as any,
        title,
        altText,
        size,
        createdById: admin.id
      }
    });
    return NextResponse.json({ asset });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
