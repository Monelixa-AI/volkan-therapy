import { prisma } from "@/lib/db";

const DEFAULT_LEGAL_PAGES = [
  {
    slug: "gizlilik",
    title: "Gizlilik Politikasi",
    content: "Gizlilik politikasi icerigi yakinda guncellenecektir.",
    isPublished: true
  },
  {
    slug: "kullanim-sartlari",
    title: "Kullanim Sartlari",
    content: "Kullanim sartlari icerigi yakinda guncellenecektir.",
    isPublished: true
  },
  {
    slug: "kvkk",
    title: "KVKK Aydinlatma Metni",
    content: "KVKK icerigi yakinda guncellenecektir.",
    isPublished: true
  },
  {
    slug: "cerez-politikasi",
    title: "Cerez Politikasi",
    content: "Cerez politikasi icerigi yakinda guncellenecektir.",
    isPublished: true
  }
];

export async function ensureLegalPages() {
  const existing = await prisma.legalPage.findMany({
    select: { slug: true }
  });
  const existingSlugs = new Set(existing.map((page) => page.slug));
  const missing = DEFAULT_LEGAL_PAGES.filter((page) => !existingSlugs.has(page.slug));
  if (missing.length === 0) {
    return;
  }
  await prisma.legalPage.createMany({ data: missing });
}

export async function getLegalPages() {
  try {
    await ensureLegalPages();
    return prisma.legalPage.findMany({
      where: { isPublished: true },
      select: { slug: true, title: true },
      orderBy: { title: "asc" }
    });
  } catch (error) {
    console.warn("Legal pages unavailable:", error);
    return DEFAULT_LEGAL_PAGES.map((page) => ({
      slug: page.slug,
      title: page.title
    }));
  }
}

export async function getLegalPageBySlug(slug: string) {
  try {
    await ensureLegalPages();
    return prisma.legalPage.findUnique({ where: { slug } });
  } catch (error) {
    console.warn("Legal page unavailable:", error);
    return DEFAULT_LEGAL_PAGES.find((page) => page.slug === slug) || null;
  }
}
