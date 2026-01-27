import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSources(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, url] = line.split("|").map((part) => part.trim());
      if (!name || !url) {
        return null;
      }
      return { name, url };
    })
    .filter((source): source is { name: string; url: string } => Boolean(source));
}

async function createPost(formData: FormData) {
  "use server";
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugInput || slugify(title);
  const excerpt = String(formData.get("excerpt") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim() || null;
  const category = String(formData.get("category") || "").trim() || null;
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const readTime = String(formData.get("readTime") || "").trim() || null;
  const keyPoints = parseLines(String(formData.get("keyPoints") || ""));
  const tips = parseLines(String(formData.get("tips") || ""));
  const sources = parseSources(String(formData.get("sources") || ""));
  const isPublished = formData.get("isPublished") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const featuredOrderValue = Number(formData.get("featuredOrder") || 0);
  const featuredOrder = Number.isFinite(featuredOrderValue) ? featuredOrderValue : 0;

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt,
      summary: summary || null,
      content,
      coverImage,
      category,
      tags,
      readTime,
      keyPoints,
      tips,
      sources,
      isFeatured,
      featuredOrder,
      isPublished,
      publishedAt: isPublished ? new Date() : null
    }
  });

  redirect(`/admin/blog/${post.id}`);
}

export default function AdminBlogNewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Yeni Blog Yazisi</h1>
        <p className="text-sm text-slate-500">Yeni bir yazi ekleyin.</p>
      </div>
      <form action={createPost} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Baslik</span>
          <input
            name="title"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Slug (opsiyonel)</span>
          <input name="slug" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Ozet</span>
          <textarea name="excerpt" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Ozet (detay)</span>
          <textarea name="summary" rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Icerik</span>
          <textarea
            name="content"
            rows={12}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Okuma suresi</span>
            <input
              name="readTime"
              placeholder="6 dk okuma"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Kapak gorsel URL</span>
            <input
              name="coverImage"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Kategori</span>
            <input
              name="category"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Etiketler (virgulle)</span>
            <input name="tags" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">One cikan sirasi</span>
            <input
              name="featuredOrder"
              type="number"
              defaultValue={0}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm flex items-center gap-2 mt-6">
            <input type="checkbox" name="isPublished" />
            <span className="text-slate-600">Yayinla</span>
          </label>
          <label className="text-sm flex items-center gap-2 mt-6">
            <input type="checkbox" name="isFeatured" />
            <span className="text-slate-600">One cikan</span>
          </label>
        </div>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">One cikan noktalar (satir)</span>
          <textarea name="keyPoints" rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Evde ipuclari (satir)</span>
          <textarea name="tips" rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Kaynaklar (Isim | URL)</span>
          <textarea name="sources" rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
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
