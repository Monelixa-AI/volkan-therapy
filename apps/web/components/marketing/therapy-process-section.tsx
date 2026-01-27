import Link from "next/link";
import { IMAGE_DISCLAIMER } from "@/lib/ui-copy";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeContent } from "@/lib/content-defaults";

type TherapyProcessSectionProps = {
  content: HomeContent["therapy"];
};

export function TherapyProcessSection({ content }: TherapyProcessSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {content.title}{" "}
              <span className="text-primary-500">{content.highlight}</span>
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl">{content.description}</p>
            <div className="space-y-3 mb-8">
              {content.steps.map((step) => (
                <div key={step} className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <Button size="lg" asChild>
              <Link href={content.cta.href}>
                {content.cta.label}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {content.gallery.map((item) => (
              <div
                key={item.src}
                className="bg-gray-50 rounded-2xl p-3 shadow-sm border border-gray-100"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 mt-3">
                  {item.title}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
