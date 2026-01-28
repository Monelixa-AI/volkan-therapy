import Link from "next/link";

const CONTENT_ITEMS = [
  { key: "home", label: "Ana Sayfa" },
  { key: "about", label: "Hakkımda" },
  { key: "services-page", label: "Hizmetler Sayfası" },
  { key: "booking", label: "Randevu" },
  { key: "assessment", label: "Değerlendirme" },
  { key: "therapy", label: "Terapi Süreci" },
  { key: "contact", label: "İletişim" },
  { key: "blog", label: "Blog" }
];

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">İçerik Yönetimi</h1>
        <p className="text-sm text-slate-500">
          Sayfalardaki başlık, metin, görsel ve listeleri buradan düzenleyin.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {CONTENT_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={`/admin/content/${item.key}`}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-primary-500 transition-colors"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-2">{item.label}</h2>
            <p className="text-sm text-slate-500">İçerik alanlarını güncelleyin.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
