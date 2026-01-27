import { prisma } from "@/lib/db";
import { getBackupSettings, setBackupSettings } from "@/lib/site-settings";

function getStorageConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "backups";
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }
  return { url, key, bucket };
}

async function uploadJson(fileKey: string, payload: string) {
  const { url, key, bucket } = getStorageConfig();
  const endpoint = `${url}/storage/v1/object/${bucket}/${fileKey}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "x-upsert": "true"
    },
    body: payload
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }
  return `${url}/storage/v1/object/public/${bucket}/${fileKey}`;
}

function getLatestScheduleTime(
  frequency: "daily" | "weekly" | "monthly",
  time: string,
  dayOfWeek: number,
  dayOfMonth: number,
  now: Date
) {
  const [hour, minute] = time.split(":").map((value) => Number(value));
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);

  if (frequency === "daily") {
    if (now < base) {
      base.setDate(base.getDate() - 1);
    }
    return base;
  }

  if (frequency === "weekly") {
    const currentDay = base.getDay();
    const delta = currentDay - dayOfWeek;
    base.setDate(base.getDate() - delta);
    if (now < base) {
      base.setDate(base.getDate() - 7);
    }
    return base;
  }

  const targetDay = Math.min(Math.max(dayOfMonth, 1), 28);
  base.setDate(targetDay);
  if (now < base) {
    base.setMonth(base.getMonth() - 1);
    base.setDate(targetDay);
  }
  return base;
}

export async function shouldRunBackup(now = new Date()) {
  const settings = await getBackupSettings();
  if (settings.frequency === "manual") {
    return false;
  }

  const lastRunAt = settings.lastRunAt ? new Date(settings.lastRunAt) : null;
  const latestSchedule = getLatestScheduleTime(
    settings.frequency,
    settings.time,
    settings.dayOfWeek,
    settings.dayOfMonth,
    now
  );

  return !lastRunAt || lastRunAt < latestSchedule;
}

export async function markBackupRun(date = new Date()) {
  const settings = await getBackupSettings();
  await setBackupSettings({
    ...settings,
    lastRunAt: date.toISOString()
  });
}

export async function createBackupExport(createdById?: string) {
  const record = await prisma.backupExport.create({
    data: {
      status: "PENDING",
      createdById
    }
  });

  try {
    const [contacts, bookings, assessments, subscribers, users] = await Promise.all([
      prisma.contactSubmission.findMany(),
      prisma.booking.findMany({
        include: { service: true, user: true, child: true }
      }),
      prisma.assessment.findMany(),
      prisma.newsletterSubscriber.findMany(),
      prisma.user.findMany({
        select: { id: true, name: true, email: true, phone: true, createdAt: true }
      })
    ]);

    const payload = JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        contacts,
        bookings,
        assessments,
        subscribers,
        users
      },
      null,
      2
    );

    const fileKey = `backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    const fileUrl = await uploadJson(fileKey, payload);

    return await prisma.backupExport.update({
      where: { id: record.id },
      data: {
        status: "COMPLETED",
        fileUrl,
        fileKey,
        completedAt: new Date()
      }
    });
  } catch (error: any) {
    return await prisma.backupExport.update({
      where: { id: record.id },
      data: {
        status: "FAILED",
        errorMessage: error?.message || "Backup failed"
      }
    });
  }
}
