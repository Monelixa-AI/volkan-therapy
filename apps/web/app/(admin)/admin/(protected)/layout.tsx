import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-lg font-semibold text-slate-900">
              Volkan Therapy Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              <Link href="/admin/content" className="hover:text-slate-900">
                İçerikler
              </Link>
              <Link href="/admin/services" className="hover:text-slate-900">
                Hizmetler
              </Link>
              <Link href="/admin/blog" className="hover:text-slate-900">
                Blog
              </Link>
              <Link href="/admin/media" className="hover:text-slate-900">
                Medya
              </Link>
              <Link href="/admin/legal" className="hover:text-slate-900">
                Yasal
              </Link>
              <Link href="/admin/settings" className="hover:text-slate-900">
                Ayarlar
              </Link>
            </nav>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Çıkış Yap
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
