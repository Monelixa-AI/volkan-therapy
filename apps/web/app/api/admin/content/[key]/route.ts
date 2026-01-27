import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { getContentEntry } from "@/lib/content";
import {
  DEFAULT_HOME_CONTENT,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_BOOKING_CONTENT,
  DEFAULT_ASSESSMENT_CONTENT,
  DEFAULT_THERAPY_CONTENT,
  DEFAULT_CONTACT_CONTENT,
  DEFAULT_SERVICES_PAGE_CONTENT,
  DEFAULT_BLOG_CONTENT
} from "@/lib/content-defaults";

const DEFAULTS: Record<string, unknown> = {
  home: DEFAULT_HOME_CONTENT,
  about: DEFAULT_ABOUT_CONTENT,
  "services-page": DEFAULT_SERVICES_PAGE_CONTENT,
  booking: DEFAULT_BOOKING_CONTENT,
  assessment: DEFAULT_ASSESSMENT_CONTENT,
  therapy: DEFAULT_THERAPY_CONTENT,
  contact: DEFAULT_CONTACT_CONTENT,
  blog: DEFAULT_BLOG_CONTENT
};

export async function GET(
  _request: Request,
  { params }: { params: { key: string } }
) {
  await requireAdmin();
  const key = params.key;
  const fallback = DEFAULTS[key];
  if (!fallback) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = await getContentEntry(key, fallback);
  return NextResponse.json({ data });
}

export async function PUT(
  request: Request,
  { params }: { params: { key: string } }
) {
  const admin = await requireAdmin();
  const key = params.key;
  const fallback = DEFAULTS[key];
  if (!fallback) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const data = body?.data;
  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const existing = await prisma.contentEntry.findUnique({ where: { key } });
  const updated = await prisma.contentEntry.upsert({
    where: { key },
    create: {
      key,
      data,
      status: "PUBLISHED"
    },
    update: {
      data
    }
  });

  if (existing) {
    await prisma.contentRevision.create({
      data: {
        contentId: existing.id,
        data: existing.data as Prisma.InputJsonValue,
        createdById: admin.id
      }
    });
  }

  return NextResponse.json({ data: updated.data });
}
