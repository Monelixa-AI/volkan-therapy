import Link from "next/link";
import { prisma } from "@/lib/db";
import { ensureLegalPages } from "@/lib/legal";

export default async function AdminLegalPage() {
  await ensureLegalPages();
  const pages = await prisma.legalPage.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Yasal Metinler</h1>
        <p className="text-sm text-slate-500">
          Footer yasal linklerinin icerigini buradan yonetin.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-200">
          {pages.map((page) => (
            <div key={page.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-slate-900">{page.title}</p>
                <p className="text-xs text-slate-500">/{page.slug}</p>
              </div>
              <Link
                href={`/admin/legal/${page.id}`}
                className="text-sm text-primary-600 hover:underline"
              >
                Duzenle
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
