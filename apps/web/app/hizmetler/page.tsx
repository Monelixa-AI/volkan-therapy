import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActiveServices } from "@/lib/services";
import { getServicesPageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hizmetler | Volkan Özcihan",
  description:
    "Çocuk terapileri ve yetişkin rehabilitasyon hizmetleri hakkında detaylı bilgiler ve ailelerden gelen yorumlar."
};

type ServiceCardProps = {
  title: string;
  subtitle?: string | null;
  description: string;
  highlights: string[];
  review: { text: string; author: string; relation: string; location: string } | null;
  slug: string;
};

function ServiceCard({ title, subtitle, description, highlights, review, slug }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          {subtitle && <p className="text-primary-600 font-medium mb-4">{subtitle}</p>}
          <p className="text-gray-700 mb-6">{description}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {highlights.map((item) => (
              <div key={item} className="flex items-start text-gray-700 text-sm">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-72 flex flex-col gap-4">
          {review && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-2">Mutlu Aile Yorumu</p>
              <div className="text-yellow-500 text-sm mb-2">★★★★★</div>
              <p className="text-sm text-gray-700 italic">&ldquo;{review.text}&rdquo;</p>
              <p className="text-xs text-gray-500 mt-3">
                {review.author} • {review.relation} • {review.location}
              </p>
            </div>
          )}
          <Button asChild className="w-full">
            <Link href={`/hizmetler/${slug}`}>Detayli Bilgi</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default async function ServicesPage() {
  const [content, services] = await Promise.all([
    getServicesPageContent(),
    getActiveServices()
  ]);

  const childServices = services.filter((service) => service.category === "CHILD_THERAPY");
  const adultServices = services.filter((service) => service.category === "ADULT_REHAB");

  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{content.description}</p>
        </div>
      </div>

      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">
              {content.childrenTitle}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {content.childrenDescription}
            </p>
          </div>
          <div className="space-y-8">
            {childServices.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                subtitle={service.subtitle}
                description={service.shortDesc || service.description}
                highlights={service.highlights}
                review={
                  service.reviewText
                    ? {
                        text: service.reviewText,
                        author: service.reviewAuthor || "",
                        relation: service.reviewRelation || "",
                        location: service.reviewLocation || ""
                      }
                    : null
                }
                slug={service.slug}
              />
            ))}
            {childServices.length === 0 && (
              <div className="text-center text-sm text-gray-500">Hizmet bulunamadi.</div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">
              {content.adultsTitle}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {content.adultsDescription}
            </p>
          </div>
          <div className="space-y-8">
            {adultServices.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                subtitle={service.subtitle}
                description={service.shortDesc || service.description}
                highlights={service.highlights}
                review={
                  service.reviewText
                    ? {
                        text: service.reviewText,
                        author: service.reviewAuthor || "",
                        relation: service.reviewRelation || "",
                        location: service.reviewLocation || ""
                      }
                    : null
                }
                slug={service.slug}
              />
            ))}
            {adultServices.length === 0 && (
              <div className="text-center text-sm text-gray-500">Hizmet bulunamadi.</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
