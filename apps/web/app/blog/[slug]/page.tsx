import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getBlogContent } from "@/lib/content";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || !post.isPublished) {
    return { title: "Blog | Volkan Özcihan" };
  }
  return {
    title: `${post.title} | Volkan Özcihan`,
    description: post.excerpt || post.content.slice(0, 160)
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const [content, post] = await Promise.all([
    getBlogContent(),
    prisma.blogPost.findUnique({ where: { slug: params.slug } })
  ]);

  if (!post || !post.isPublished) {
    notFound();
  }

  const publishedAt = post.publishedAt ?? post.createdAt;
  const summary = post.summary ?? post.excerpt ?? post.content.slice(0, 240);
  const paragraphs = post.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const sources = Array.isArray(post.sources)
    ? (post.sources as Array<{ name?: string; url?: string }>)
    : [];

  return (
    <main className="py-12">
      <section className="container mx-auto px-4 mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm mb-4">
              {post.category || "Genel"}
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <p className="text-gray-600 mb-6">{post.excerpt || summary}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{new Date(publishedAt).toLocaleDateString("tr-TR")}</span>
              <span className="mx-2">-</span>
              <Clock className="w-4 h-4 mr-1" />
              <span>{post.readTime || "5 dk okuma"}</span>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={post.coverImage || "/images/blog/default.jpg"}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <p className="absolute bottom-3 left-3 right-3 text-[10px] sm:text-xs text-gray-500 bg-white/70 backdrop-blur-sm rounded-md px-2 py-1 leading-snug pointer-events-none">
              {content.disclaimer}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="space-y-4 text-gray-700">
                  <p>{summary}</p>
                  {paragraphs.map((paragraph, index) => (
                    <p key={`${post.id}-p-${index}`}>{paragraph}</p>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      One Cikan Noktalar
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {post.keyPoints.map((point) => (
                        <li key={point} className="flex items-start">
                          <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 mt-2" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Evde Uygulanabilir Ipuclari
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {post.tips.map((tip) => (
                        <li key={tip} className="flex items-start">
                          <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 mt-2" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Kaynaklar</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {sources.map((source) => {
                      const name = String(source.name || "").trim();
                      const url = String(source.url || "").trim();
                      if (!name || !url) {
                        return null;
                      }
                      return (
                        <li key={name}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-500 hover:underline"
                          >
                            {name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="lg:w-64 flex flex-col gap-4">
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
                  <p className="text-xs text-gray-500 mb-2">Önerilen Adım</p>
                  <p className="text-sm text-gray-700 mb-4">
                    Konuyla ilgili kısa bir değerlendirme yaparak size uygun planımızı
                    birlikte çıkaralım.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/degerlendirme">Ücretsiz Değerlendirme</Link>
                  </Button>
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  Not: Bu içerikler bilgilendirme amaçlıdır ve tıbbi tanı yerine
                  geçmez.
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
