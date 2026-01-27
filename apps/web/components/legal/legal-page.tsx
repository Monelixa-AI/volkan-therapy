import { notFound } from "next/navigation";
import { getLegalPageBySlug } from "@/lib/legal";

type LegalPageProps = {
  slug: string;
};

export async function LegalPageContent({ slug }: LegalPageProps) {
  const page = await getLegalPageBySlug(slug);
  if (!page || !page.isPublished) {
    notFound();
  }

  return (
    <main className="py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-6">
          {page.title}
        </h1>
        <div className="prose prose-slate max-w-none">
          {page.content.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
