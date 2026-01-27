import { NextResponse } from "next/server";
import { createBackupExport, markBackupRun, shouldRunBackup } from "@/lib/backup";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return true;
  }
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shouldRun = await shouldRunBackup();
  if (!shouldRun) {
    return NextResponse.json({ success: true, skipped: true });
  }

  const result = await createBackupExport();
  if (result.status === "COMPLETED") {
    await markBackupRun();
  }
  return NextResponse.json({ success: true, result });
}

export async function POST(request: Request) {
  return handle(request);
}

export async function GET(request: Request) {
  return handle(request);
}
