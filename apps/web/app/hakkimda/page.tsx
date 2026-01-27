import { Metadata } from "next";
import {
  GraduationCap,
  Award,
  Building,
  Heart,
import { IMAGE_DISCLAIMER } from "@/lib/ui-copy";
  BookOpen,
  Users,
  User
} from "lucide-react";
import { getAboutContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Volkan Özcihan Kimdir? | Uzman Fizyoterapist",
  description:
    "30 yillik devlet deneyimi, uluslararasi sertifikalar ve binlerce mutlu aile. Volkan Özcihan'i taniyin."
};

const ICONS = {
  graduation: GraduationCap,
  award: Award,
  building: Building,
  heart: Heart,
  book: BookOpen,
  users: Users
};

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <main className="py-12">
      <section className="container mx-auto px-4 mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={content.hero.image.src}
                alt={content.hero.image.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <p className="absolute bottom-3 left-3 right-3 text-[10px] sm:text-xs text-gray-500 bg-white/70 backdrop-blur-sm rounded-md px-2 py-1 leading-snug pointer-events-none">
                {IMAGE_DISCLAIMER}
              </p>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              {content.hero.stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-lg px-6 py-4 text-center">
                  <p className="text-3xl font-bold text-primary-500">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {content.hero.name}{" "}
              <span className="text-primary-500">{content.hero.highlight}</span>
            </h1>
            <p className="text-xl text-primary-600 mb-6">{content.hero.title}</p>
            <div className="prose prose-lg max-w-none">
              {content.hero.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <blockquote className="mt-8 p-6 bg-primary-50 rounded-xl border-l-4 border-primary-500">
              <p className="text-lg italic text-gray-700">{content.hero.quote}</p>
            </blockquote>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            Kariyer <span className="text-primary-500">Yolculugum</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            {content.timeline.map((item, index) => {
              const Icon = ICONS[item.icon as keyof typeof ICONS] ?? User;
              return (
                <div key={`${item.year}-${index}`} className="flex gap-6 mb-8 last:mb-0">
                  <div className="w-24 flex-shrink-0 text-right">
                    <span className="font-bold text-primary-500">{item.year}</span>
                  </div>
                  <div className="relative flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white z-10">
                      <Icon className="w-6 h-6" />
                    </div>
                    {index !== content.timeline.length - 1 && (
                      <div className="w-0.5 bg-primary-200 flex-1 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            Sertifikalar & <span className="text-primary-500">Uzmanliklar</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {content.certifications.map((cert) => (
              <div
                key={cert}
                className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <Award className="w-8 h-8 text-accent-500 mr-4 flex-shrink-0" />
                <span className="text-gray-700">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-primary-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            Degerlerimiz
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {content.values.map((value, index) => {
              const Icon = ICONS[value.icon as keyof typeof ICONS] ?? User;
              return (
                <div key={`${value.title}-${index}`} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{value.title}</h3>
                  <p className="text-primary-100">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
