import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

type Props = {
  params: { id: string };
};

async function updateLegalPage(formData: FormData) {
  "use server";
  const admin = await requireAdmin();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const isPublished = formData.get("isPublished") === "on";

  const existing = await prisma.legalPage.findUnique({ where: { id } });
  if (!existing) {
    return;
  }

  await prisma.legalPageRevision.create({
    data: {
      legalPageId: id,
      title: existing.title,
      content: existing.content,
      createdById: admin.id
    }
  });

  await prisma.legalPage.update({
    where: { id },
    data: { title, content, isPublished }
  });
}

export default async function AdminLegalEditPage({ params }: Props) {
  const page = await prisma.legalPage.findUnique({ where: { id: params.id } });
  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Yasal Metin Duzenle</h1>
        <p className="text-sm text-slate-500">/{page.slug}</p>
      </div>
      <form action={updateLegalPage} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <input type="hidden" name="id" value={page.id} />
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Baslik</span>
          <input
            name="title"
            defaultValue={page.title}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Icerik</span>
          <textarea
            name="content"
            defaultValue={page.content}
            rows={12}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" name="isPublished" defaultChecked={page.isPublished} />
          <span className="text-slate-600">Yayinda</span>
        </label>
        <button
          type="submit"
          className="rounded-lg bg-primary-500 text-white px-6 py-2 text-sm font-medium"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
