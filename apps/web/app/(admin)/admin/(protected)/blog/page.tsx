import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Blog Yazilari</h1>
          <p className="text-sm text-slate-500">Yeni yazilar ekleyin ve guncelleyin.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-primary-500 text-white px-4 py-2 text-sm font-medium"
        >
          Yeni Yazi
        </Link>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-200">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-slate-900">{post.title}</p>
                <p className="text-xs text-slate-500">
                  {post.slug} · {post.isPublished ? "Yayinda" : "Taslak"}
                  {post.isFeatured ? " · One cikan" : ""}
                </p>
              </div>
              <Link
                href={`/admin/blog/${post.id}`}
                className="text-sm text-primary-600 hover:underline"
              >
                Duzenle
              </Link>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="px-6 py-8 text-sm text-slate-500">
              Henuz blog yazisi yok.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
