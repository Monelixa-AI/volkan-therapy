import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/contact-form";
import { getSiteInfo } from "@/lib/site-settings";
import { getContactContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "İletişim | Volkan Özcihan",
  description:
    "Randevu almak, soru sormak veya bilgi talep etmek icin bize ulasin. WhatsApp, telefon, e-posta ve mesaj formu ile hizli iletisim."
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26C2.001 6.442 6.436 2.008 11.888 2.008c2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
  </svg>
);

export default async function ContactPage() {
  const [siteInfo, content] = await Promise.all([getSiteInfo(), getContactContent()]);
  const contactInfo = [
    {
      icon: MapPin,
      title: "Adres",
      content: siteInfo.address,
      subContent: siteInfo.addressNote
    },
    {
      icon: Phone,
      title: "Telefon",
      content: siteInfo.phone,
      href: `tel:${siteInfo.phone.replace(/\s+/g, "")}`
    },
    {
      icon: Mail,
      title: "E-posta",
      content: siteInfo.email,
      href: `mailto:${siteInfo.email}`
    },
    {
      icon: Clock,
      title: "Çalışma Saatleri",
      content: siteInfo.workingHoursWeekday,
      subContent: siteInfo.workingHoursWeekend
    }
  ];

  return (
    <main className="py-12">
      <section className="container mx-auto px-4 mb-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              {content.heroBadge}
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {content.heroTitle}{" "}
              <span className="text-primary-500">{content.heroHighlight}</span>
            </h1>
            <p className="text-gray-600 mb-6 max-w-xl">{content.heroDescription}</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/randevu">
                  <Calendar className="w-5 h-5 mr-2" />
                  {content.heroPrimaryCta}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/degerlendirme">{content.heroSecondaryCta}</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="h-14 px-6 text-base bg-green-500 hover:bg-green-600 text-white"
                asChild
              >
                <a
                  href={`https://wa.me/${siteInfo.whatsapp}?text=Merhaba, bilgi almak istiyorum.`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  <span className="ml-2">WhatsApp ile Yaz</span>
                </a>
              </Button>
              <Button size="lg" className="h-14 px-6 text-base" asChild>
                <a href={`tel:${siteInfo.phone.replace(/\s+/g, "")}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  Telefonla Ara
                </a>
              </Button>
            </div>
          </div>
          <div className="bg-primary-500 text-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Calendar className="w-8 h-8 mr-3" />
              <h2 className="font-heading text-2xl font-semibold">
                {content.appointmentTitle}
              </h2>
            </div>
            <p className="text-primary-100 mb-6">{content.appointmentDescription}</p>
            <ul className="space-y-3 mb-8">
              {content.appointmentFeatures.map((item) => (
                <li key={item} className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              variant="secondary"
              className="w-full text-primary-600"
              asChild
            >
              <Link href="/randevu">Randevu Takvimini Ac</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <MessageCircle className="w-6 h-6 text-primary-500 mr-2" />
                <h2 className="font-heading text-2xl font-semibold text-gray-900">
                  {content.messageTitle}
                </h2>
              </div>
              <p className="text-gray-600 mb-6">{content.messageDescription}</p>
              <ContactForm />
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="font-heading text-xl font-semibold text-gray-900 mb-6">
                  {content.infoTitle}
                </h3>
                <div className="space-y-5">
                  {contactInfo.map((item) => (
                    <div key={item.title} className="flex items-start">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-primary-500" />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{item.title}</p>
                        {item.href ? (
                          <a href={item.href} className="text-primary-500 hover:underline">
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-gray-600">{item.content}</p>
                        )}
                        {item.subContent && (
                          <p className="text-sm text-gray-500">{item.subContent}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4">
                  {content.quickContactTitle}
                </h3>
                <p className="text-gray-600 mb-6">{content.quickContactDescription}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    size="lg"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${siteInfo.whatsapp}?text=Merhaba, bilgi almak istiyorum.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon />
                      <span className="ml-2">WhatsApp</span>
                    </a>
                  </Button>
                  <Button className="flex-1" size="lg" asChild>
                    <a href={`tel:${siteInfo.phone.replace(/\s+/g, "")}`}>
                      <Phone className="w-5 h-5 mr-2" />
                      Telefon
                    </a>
                  </Button>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4">
                  {content.locationTitle}
                </h3>
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  <iframe
                    title="Volkan Özcihan Konum"
                    src={siteInfo.mapEmbedUrl}
                    className="w-full h-64"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">{siteInfo.addressNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
