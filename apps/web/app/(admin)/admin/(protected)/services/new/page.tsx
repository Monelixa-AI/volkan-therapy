import { redirect } from "next/navigation";
import { Prisma, ServiceCategory } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

function parseLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parsePairs(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, description] = line.split("|").map((part) => part.trim());
      if (!title || !description) {
        return null;
      }
      return { title, description };
    })
    .filter(Boolean);
}

function parseStats(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [valueText, label] = line.split("|").map((part) => part.trim());
      if (!valueText || !label) {
        return null;
      }
      return { value: valueText, label };
    })
    .filter(Boolean);
}

async function createService(formData: FormData) {
  "use server";
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();

  const data = {
    title,
    slug,
    description,
    shortTitle: String(formData.get("shortTitle") || "").trim() || null,
    subtitle: String(formData.get("subtitle") || "").trim() || null,
    shortDesc: String(formData.get("shortDesc") || "").trim() || null,
    longDescription: String(formData.get("longDescription") || "").trim() || null,
    duration: Number(formData.get("duration") || 60),
    price: new Prisma.Decimal(String(formData.get("price") || "0")),
    category: (formData.get("category") || "CHILD_THERAPY") as ServiceCategory,
    icon: String(formData.get("icon") || "").trim() || null,
    image: String(formData.get("image") || "").trim() || null,
    order: Number(formData.get("order") || 0),
    isActive: formData.get("isActive") === "on",
    highlights: parseLines(String(formData.get("highlights") || "")),
    benefits: parseLines(String(formData.get("benefits") || "")),
    process: parsePairs(String(formData.get("process") || "")),
    stats: parseStats(String(formData.get("stats") || "")),
    reviewText: String(formData.get("reviewText") || "").trim() || null,
    reviewAuthor: String(formData.get("reviewAuthor") || "").trim() || null,
    reviewRelation: String(formData.get("reviewRelation") || "").trim() || null,
    reviewLocation: String(formData.get("reviewLocation") || "").trim() || null
  };

  const service = await prisma.service.create({ data });
  redirect(`/admin/services/${service.id}`);
}

export default function AdminServiceNewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Yeni Hizmet</h1>
        <p className="text-sm text-slate-500">Yeni hizmet bilgilerini girin.</p>
      </div>
      <form
        action={createService}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Baslik</span>
            <input name="title" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Slug</span>
            <input name="slug" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Kisa Baslik</span>
            <input name="shortTitle" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Alt Baslik</span>
            <input name="subtitle" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
        </div>

        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Kisa Aciklama</span>
          <textarea name="shortDesc" rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Aciklama</span>
          <textarea name="description" rows={4} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Detayli Aciklama</span>
          <textarea name="longDescription" rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Sure (dk)</span>
            <input name="duration" type="number" defaultValue={60} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Fiyat</span>
            <input name="price" type="number" step="0.01" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Kategori</span>
            <select name="category" className="w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="CHILD_THERAPY">Cocuk Terapisi</option>
              <option value="ADULT_REHAB">Yetiskin Rehabilitasyon</option>
              <option value="CONSULTATION">Danisma</option>
            </select>
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Ikon</span>
            <input name="icon" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm block md:col-span-2">
            <span className="block text-slate-600 mb-1">Gorsel URL</span>
            <input name="image" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Sira</span>
            <input name="order" type="number" defaultValue={0} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm flex items-center gap-2 mt-6">
            <input type="checkbox" name="isActive" defaultChecked />
            <span className="text-slate-600">Aktif</span>
          </label>
        </div>

        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">One Cikanlar (satir)</span>
          <textarea name="highlights" rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Faydalar (satir)</span>
          <textarea name="benefits" rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Surec (Baslik | Aciklama)</span>
          <textarea name="process" rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Istatistik (Deger | Etiket)</span>
          <textarea name="stats" rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm block md:col-span-2">
            <span className="block text-slate-600 mb-1">Yorum</span>
            <textarea name="reviewText" rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Yorum Sahibi</span>
            <input name="reviewAuthor" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Yakinlik</span>
            <input name="reviewRelation" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Konum</span>
            <input name="reviewLocation" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
        </div>

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
