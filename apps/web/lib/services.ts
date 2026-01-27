import { prisma } from "@/lib/db";

export async function getActiveServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { title: "asc" }]
  });
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({
    where: { slug }
  });
}

export async function getServiceOptions() {
  return prisma.service.findMany({
    where: { isActive: true },
    select: { id: true, title: true, duration: true },
    orderBy: [{ order: "asc" }, { title: "asc" }]
  });
}
