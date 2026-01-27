import { Metadata } from "next";
import { BookingForm } from "@/components/booking/booking-form";
import { Phone, MessageCircle, Clock, Shield } from "lucide-react";
import { getBookingContent } from "@/lib/content";
import { getSiteInfo } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Online Randevu Al | Volkan Özcihan",
  description: "7/24 online randevu alin. Anlik onay, ucretsiz iptal."
};

const ICONS = {
  clock: Clock,
  shield: Shield,
  message: MessageCircle
};

export default async function BookingPage() {
  const [content, siteInfo] = await Promise.all([getBookingContent(), getSiteInfo()]);

  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">
            {content.title} <span className="text-primary-500">{content.highlight}</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            {content.description}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {content.features.map((feature, index) => {
              const Icon = ICONS[feature.icon as keyof typeof ICONS] ?? Clock;
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
          <BookingForm />
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">{content.contactPrompt}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${siteInfo.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2 text-primary-500" />
              {content.phoneCtaLabel}
            </a>
            <a
              href={`https://wa.me/${siteInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {content.whatsappCtaLabel}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
