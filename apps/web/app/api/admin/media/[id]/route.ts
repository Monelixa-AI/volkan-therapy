import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteMediaObject } from "@/lib/media";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await requireAdmin();
  const asset = await prisma.mediaAsset.findUnique({ where: { id: params.id } });
  if (!asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (asset.storagePath) {
    await deleteMediaObject(asset.storagePath);
  }

  await prisma.mediaAsset.delete({ where: { id: asset.id } });
  return NextResponse.json({ success: true });
}
