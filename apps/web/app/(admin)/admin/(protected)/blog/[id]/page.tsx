import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

type Props = {
  params: { id: string };
};

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

function formatSources(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }
  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return "";
      }
      const record = item as Record<string, unknown>;
      const name = String(record.name || "").trim();
      const url = String(record.url || "").trim();
      if (!name || !url) {
        return "";
      }
      return `${name} | ${url}`;
    })
    .filter(Boolean)
    .join("\n");
}

async function updatePost(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
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

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return;
  }

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
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
      publishedAt: isPublished ? existing.publishedAt || new Date() : null
    }
  });
}

async function deletePost(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.blogPost.delete({ where: { id } });
  redirect("/admin/blog");
}

export default async function AdminBlogEditPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Blog Yazisi</h1>
          <p className="text-sm text-slate-500">{post.slug}</p>
        </div>
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <button
            type="submit"
            className="rounded-lg border border-red-200 text-red-600 px-4 py-2 text-sm"
          >
            Sil
          </button>
        </form>
      </div>
      <form action={updatePost} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <input type="hidden" name="id" value={post.id} />
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Baslik</span>
          <input
            name="title"
            defaultValue={post.title}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Slug</span>
          <input
            name="slug"
            defaultValue={post.slug}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Ozet</span>
          <textarea
            name="excerpt"
            defaultValue={post.excerpt || ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Ozet (detay)</span>
          <textarea
            name="summary"
            rows={4}
            defaultValue={post.summary || ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Icerik</span>
          <textarea
            name="content"
            rows={12}
            defaultValue={post.content}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Okuma suresi</span>
            <input
              name="readTime"
              defaultValue={post.readTime || ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Kapak gorsel URL</span>
            <input
              name="coverImage"
              defaultValue={post.coverImage || ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Kategori</span>
            <input
              name="category"
              defaultValue={post.category || ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Etiketler (virgulle)</span>
            <input
              name="tags"
              defaultValue={post.tags.join(", ")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">One cikan sirasi</span>
            <input
              name="featuredOrder"
              type="number"
              defaultValue={post.featuredOrder || 0}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm flex items-center gap-2 mt-6">
            <input type="checkbox" name="isPublished" defaultChecked={post.isPublished} />
            <span className="text-slate-600">Yayinda</span>
          </label>
          <label className="text-sm flex items-center gap-2 mt-6">
            <input type="checkbox" name="isFeatured" defaultChecked={post.isFeatured} />
            <span className="text-slate-600">One cikan</span>
          </label>
        </div>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">One cikan noktalar (satir)</span>
          <textarea
            name="keyPoints"
            rows={4}
            defaultValue={post.keyPoints.join("\n")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Evde ipuclari (satir)</span>
          <textarea
            name="tips"
            rows={4}
            defaultValue={post.tips.join("\n")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Kaynaklar (Isim | URL)</span>
          <textarea
            name="sources"
            rows={4}
            defaultValue={formatSources(post.sources)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
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
