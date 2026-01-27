import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [contactCount, bookingCount, postCount] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.booking.count(),
    prisma.blogPost.count()
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Yönetim Paneli</h1>
        <p className="text-sm text-slate-500">
          İçerikler, medya ve otomasyon ayarlarını buradan yönetin.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Yeni İletişim", value: contactCount },
          { label: "Randevular", value: bookingCount },
          { label: "Blog Yazıları", value: postCount }
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/content"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-primary-500 transition-colors"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Sayfa İçerikleri
          </h2>
          <p className="text-sm text-slate-500">
            Ana sayfa, hakkımda, hizmetler ve diğer sayfaları güncelleyin.
          </p>
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-primary-500 transition-colors"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Ayarlar</h2>
          <p className="text-sm text-slate-500">
            E-posta, hatırlatma, yedekleme ve site bilgilerini yönetin.
          </p>
        </Link>
      </div>
    </div>
  );
}
