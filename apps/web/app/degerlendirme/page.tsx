import { Metadata } from "next";
import { AssessmentWizard } from "@/components/assessment/assessment-wizard";
import { Shield, Clock, Sparkles } from "lucide-react";
import { getAssessmentContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ucretsiz AI Degerlendirme | Volkan Özcihan",
  description:
    "Yapay zeka destekli ucretsiz on degerlendirme ile cocugunuzun gelisimi hakkinda kisisellestirilmis rapor alin."
};

const ICONS = {
  clock: Clock,
  sparkles: Sparkles,
  shield: Shield
};

export default async function AssessmentPage() {
  const content = await getAssessmentContent();

  return (
    <main className="py-12 min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            {content.badge}
          </div>
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">
            {content.title} <span className="text-primary-500">{content.highlight}</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            {content.description}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {content.features.map((feature, index) => {
              const Icon = ICONS[feature.icon as keyof typeof ICONS] ?? Sparkles;
              return (
                <div key={`${feature.text}-${index}`} className="flex items-center text-gray-600">
                  <Icon className="w-5 h-5 text-primary-500 mr-2" />
                  {feature.text}
                </div>
              );
            })}
          </div>
        </div>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <AssessmentWizard />
        </div>
      </div>
    </main>
  );
}
