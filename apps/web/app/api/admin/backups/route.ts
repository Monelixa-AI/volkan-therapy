import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromSession } from "@/lib/admin-auth";
import { createBackupExport } from "@/lib/backup";

export async function GET() {
  const admin = await getAdminFromSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const exportsList = await prisma.backupExport.findMany({
    orderBy: { createdAt: "desc" },
    take: 25
  });
  return NextResponse.json({ exports: exportsList });
}

export async function POST() {
  const admin = await getAdminFromSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const exportRecord = await createBackupExport(admin.id);
  return NextResponse.json({ export: exportRecord });
}
