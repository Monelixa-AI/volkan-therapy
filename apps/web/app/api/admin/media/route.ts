import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { uploadMediaObject } from "@/lib/media";

// App Router segment config
export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds timeout for uploads

export async function GET() {
  await requireAdmin();
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ assets });
}

// Vercel Hobby plan has 4.5MB body limit
// For larger files, use direct upload to Supabase or public folder
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB safe limit for Vercel
const MAX_VIDEO_SIZE = 4 * 1024 * 1024; // 4MB for videos (Vercel limit)
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB for images

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (e: any) {
      console.error("FormData parse error:", e);
      return NextResponse.json(
        { error: "Dosya çok büyük veya yükleme başarısız. Maksimum 100MB." },
        { status: 413 }
      );
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }

    const type = String(formData.get("type") || "IMAGE");
    const title = String(formData.get("title") || "").trim() || null;
    const altText = String(formData.get("altText") || "").trim() || null;

    // Check file size based on type
    // Note: Vercel has 4.5MB body limit on Hobby plan
    const maxSize = type === "VIDEO" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { error: `Dosya çok büyük. Maksimum ${maxMB}MB. Büyük videolar için public/videos klasörüne manuel yükleyin.` },
        { status: 413 }
      );
    }

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
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
