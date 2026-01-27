import { Metadata } from "next";
import Link from "next/link";
import { Calendar, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTherapyContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terapi Süreci & Egitim Rotasi | Volkan Özcihan",
  description:
    "Egitim ve terapi surecinin rotasi, kullanilan setler, oyuncaklar ve uygulama alanlari hakkinda detayli bilgi."
};

const toolIcons = {
  balance: (className: string) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v10" />
      <path d="M4 18h16" />
      <path d="M6 8h12" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="16" cy="12" r="2" />
    </svg>
  ),
  sensory: (className: string) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <circle cx="8" cy="16" r="3" />
      <circle cx="17" cy="17" r="2.5" />
    </svg>
  ),
  fineMotor: (className: string) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 16l3-3 2 2 3-4" />
      <circle cx="7" cy="7" r="2" />
      <circle cx="12" cy="9" r="2" />
      <circle cx="17" cy="7" r="2" />
    </svg>
  ),
  visual: (className: string) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ),
  tactile: (className: string) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4c4 0 7 3 7 7" />
      <path d="M12 8c2.5 0 4.5 2 4.5 4.5" />
      <path d="M12 12c1.5 0 2.5 1 2.5 2.5" />
      <circle cx="7" cy="14" r="2" />
    </svg>
  ),
  planning: (className: string) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 16l6-6 4 4 6-6" />
      <path d="M16 8h4v4" />
    </svg>
  )
};

export default async function TherapyProcessPage() {
  const content = await getTherapyContent();

  return (
    <main className="py-12">
      <section className="container mx-auto px-4 mb-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              {content.hero.badge}
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {content.hero.title}{" "}
              <span className="text-primary-500">{content.hero.highlight}</span>
            </h1>
            <p className="text-gray-600 mb-6 max-w-xl">{content.hero.description}</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href={content.hero.ctaPrimaryHref}>
                  <Calendar className="w-5 h-5 mr-2" />
                  {content.hero.ctaPrimaryLabel}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={content.hero.ctaSecondaryHref}>
                  {content.hero.ctaSecondaryLabel}
                </Link>
              </Button>
            </div>
          </div>
          <div className="bg-primary-500 text-white rounded-2xl p-8 shadow-lg">
            <h2 className="font-heading text-2xl font-semibold mb-6">
              {content.routeSummaryTitle}
            </h2>
            <div className="space-y-4">
              {content.routeSteps.map((step) => (
                <div key={step.title} className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 mt-1 text-white" />
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-primary-100 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">
              {content.toolsTitle}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {content.toolsDescription}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.toolSets.map((tool) => (
              <div
                key={tool.title}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 mb-4">
                  {toolIcons[tool.icon as keyof typeof toolIcons]?.("w-5 h-5") ?? (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>
                <p className="font-medium text-gray-900">{tool.title}</p>
                <p className="text-sm text-gray-600 mt-2">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">
              {content.galleryTitle}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {content.galleryDescription}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.gallery.map((item) => (
              <div
                key={item.src}
                className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 mt-3">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
