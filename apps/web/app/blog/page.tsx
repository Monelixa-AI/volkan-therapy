import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBlogContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog | Volkan Özcihan",
  description:
    "Cocuk gelisimi, terapi yontemleri ve aile rehberligi hakkinda bilimsel temelli makaleler ve pratik ipuclari."
};

type FeaturedArticle = {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: Date;
  readTime: string;
  image: string;
  excerpt: string;
  summary: string;
  keyPoints: string[];
  tips: string[];
  sources: Array<{ name: string; url: string }>;
};

async function getBlogPosts() {
  try {
    const { prisma } = await import("@/lib/db");
    const [featured, posts] = await Promise.all([
      prisma.blogPost.findMany({
        where: { isPublished: true, isFeatured: true },
        orderBy: [{ featuredOrder: "asc" }, { publishedAt: "desc" }]
      }),
      prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 12
      })
    ]);
    return { featured, posts };
  } catch (error) {
    console.warn("Blog posts unavailable:", error);
    return { featured: [], posts: [] };
  }
}

export default async function BlogPage() {
  const [content, result] = await Promise.all([getBlogContent(), getBlogPosts()]);
  const { featured, posts } = result;
  const hasDbPosts = featured.length > 0 || posts.length > 0;
  let featuredArticles: FeaturedArticle[] = [];
  let otherPosts = posts;

  if (hasDbPosts) {
    const featuredFallback = featured.length > 0 ? featured : posts.slice(0, 3);
    const featuredIds = new Set(featuredFallback.map((post) => post.id));
    otherPosts = posts.filter((post) => !featuredIds.has(post.id));

    featuredArticles = featuredFallback.map((post) => {
      const publishedAt = post.publishedAt ?? post.createdAt;
      const excerpt = post.excerpt ?? post.content.slice(0, 120);
      const summary = post.summary ?? post.excerpt ?? post.content.slice(0, 240);
      const sources = Array.isArray(post.sources)
        ? (post.sources as Array<{ name?: string; url?: string }>)
        : [];

      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        category: post.category || "Genel",
        date: publishedAt,
        readTime: post.readTime || "5 dk okuma",
        image: post.coverImage || "/images/blog/default.jpg",
        excerpt,
        summary,
        keyPoints: post.keyPoints || [],
        tips: post.tips || [],
        sources: sources
          .map((source) => ({
            name: String(source.name || "").trim(),
            url: String(source.url || "").trim()
          }))
          .filter((source) => source.name && source.url)
      };
    });
  } else {
    featuredArticles = content.featuredArticles.map((article, index) => ({
      id: `fallback-${index}`,
      slug: article.slug,
      title: article.title,
      category: article.category,
      date: new Date(article.date),
      readTime: article.readTime,
      image: article.image,
      excerpt: article.excerpt,
      summary: article.summary,
      keyPoints: article.keyPoints,
      tips: article.tips,
      sources: article.sources
    }));
    otherPosts = [];
  }

  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">
            {content.title} <span className="text-primary-500">{content.highlight}</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{content.description}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {content.categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full border border-gray-200 hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">
              {content.featuredTitle}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {content.featuredDescription}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <Link href={`#${article.slug}`}>
                  <div className="relative aspect-square">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary-500 text-white text-sm rounded-full">
                      {article.category}
                    </span>
                  </div>
                </Link>
                <p className="mt-2 px-1 text-[9px] sm:text-[10px] text-gray-400 leading-snug">
                  {content.disclaimer}
                </p>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(article.date).toLocaleDateString("tr-TR")}</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`#${article.slug}`}
                    className="inline-flex items-center text-primary-500 font-medium hover:underline"
                  >
                    Devamini Oku
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-4">
          <div className="space-y-10">
            {featuredArticles.map((article) => (
              <article
                key={article.slug}
                id={article.slug}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-primary-600 font-medium mb-4">
                      {article.category}
                    </p>
                    <p className="text-gray-700 mb-6">{article.summary}</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          One Cikan Noktalar
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {article.keyPoints.map((point) => (
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
                          {article.tips.map((tip) => (
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
                        {article.sources.map((source) => (
                          <li key={source.name}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-500 hover:underline"
                            >
                              {source.name}
                            </a>
                          </li>
                        ))}
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
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {otherPosts.length > 0 && (
          <section className="mt-16">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">
                Diger Yazilar
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Guncel yazilarimizi ve duyurularimizi buradan takip edebilirsiniz.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => {
                const publishedAt = post.publishedAt ?? post.createdAt;
                const excerpt = post.excerpt ?? post.content.slice(0, 120);

                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative aspect-square">
                        <img
                          src={post.coverImage || "/images/blog/default.jpg"}
                          alt={post.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        {post.category && (
                          <span className="absolute top-4 left-4 px-3 py-1 bg-primary-500 text-white text-sm rounded-full">
                            {post.category}
                          </span>
                        )}
                      </div>
                    </Link>
                    <p className="mt-2 px-1 text-[9px] sm:text-[10px] text-gray-400 leading-snug">
                      {content.disclaimer}
                    </p>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(publishedAt).toLocaleDateString("tr-TR")}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{post.readTime || "5 dk okuma"}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2 hover:text-primary-500 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-primary-500 font-medium hover:underline"
                      >
                        Devamini Oku
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-16 bg-primary-50 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">
            {content.newsletterTitle}
          </h3>
          <p className="text-gray-600 mb-6">{content.newsletterDescription}</p>
          <form className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder={content.newsletterPlaceholder}
              className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {content.newsletterButton}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
