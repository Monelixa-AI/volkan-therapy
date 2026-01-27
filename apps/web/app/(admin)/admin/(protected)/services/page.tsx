import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }]
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Hizmetler</h1>
          <p className="text-sm text-slate-500">Hizmetleri ekleyin ve duzenleyin.</p>
        </div>
        <Link
          href="/admin/services/new"
          className="rounded-lg bg-primary-500 text-white px-4 py-2 text-sm font-medium"
        >
          Yeni Hizmet
        </Link>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-200">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-slate-900">{service.title}</p>
                <p className="text-xs text-slate-500">
                  {service.slug} • {service.category} •{" "}
                  {service.isActive ? "Aktif" : "Pasif"}
                </p>
              </div>
              <Link
                href={`/admin/services/${service.id}`}
                className="text-sm text-primary-600 hover:underline"
              >
                Duzenle
              </Link>
            </div>
          ))}
          {services.length === 0 && (
            <div className="px-6 py-8 text-sm text-slate-500">
              Henuz hizmet yok.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
