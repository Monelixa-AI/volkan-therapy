import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const setting = await prisma.appSetting.findUnique({ where: { key } });
    if (!setting) {
      return fallback;
    }
    return setting.value as T;
  } catch (error) {
    console.warn(`Setting fetch failed: ${key}`, error);
    return fallback;
  }
}

export async function setSetting<T>(key: string, value: T) {
  await prisma.appSetting.upsert({
    where: { key },
    create: { key, value: value as Prisma.InputJsonValue },
    update: { value: value as Prisma.InputJsonValue }
  });
}
