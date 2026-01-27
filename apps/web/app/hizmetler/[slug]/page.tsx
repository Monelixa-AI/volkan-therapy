import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServiceBySlug } from "@/lib/services";
import { IMAGE_DISCLAIMER } from "@/lib/ui-copy";

const CATEGORY_LABELS: Record<string, string> = {
  CHILD_THERAPY: "Çocuk Terapisi",
  ADULT_REHAB: "Yetişkin Rehabilitasyon",
  CONSULTATION: "Danışma"
};

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) {
    return { title: "Hizmet Bulunamadi" };
  }

  return {
    title: `${service.title} | Volkan Özcihan`,
    description: service.description
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = await getServiceBySlug(params.slug);
  if (!service) {
    notFound();
  }

  const processSteps = Array.isArray(service.process)
    ? (service.process as Array<{ title: string; description: string }>)
    : [];
  const stats = Array.isArray(service.stats)
    ? (service.stats as Array<{ value: string; label: string }>)
    : [];

  return (
    <main className="py-12">
      <section className="container mx-auto px-4 mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm mb-4">
              {service.icon ? <span className="mr-2">{service.icon}</span> : null}
              {CATEGORY_LABELS[service.category] ?? service.category}
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {service.title}
            </h1>
            {service.subtitle && (
              <p className="text-xl text-gray-600 mb-6">{service.subtitle}</p>
            )}
            <p className="text-gray-600 mb-8">{service.description}</p>
            <div className="flex gap-8 mb-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-primary-500">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/randevu">Randevu Al</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/degerlendirme">Ücretsiz Değerlendirme</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            {service.image ? (
              <>
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <p className="absolute bottom-3 left-3 right-3 text-[10px] sm:text-xs text-gray-500 bg-white/70 backdrop-blur-sm rounded-md px-2 py-1 leading-snug pointer-events-none">
                  {IMAGE_DISCLAIMER}
                </p>
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-white" />
            )}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Faydalar</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {service.benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start p-4 bg-white rounded-xl shadow-sm"
              >
                <Check className="w-6 h-6 text-success-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            Tedavi Süreci
          </h2>
          <div className="max-w-3xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={step.title} className="flex gap-6 mb-8">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-primary-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            İlk Adımı Birlikte Atın
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Ücretsiz ön değerlendirme ile ihtiyaçları belirleyelim ve size en uygun
            planımızı oluşturalım.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/degerlendirme">
              Ücretsiz Değerlendirme Yap
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
