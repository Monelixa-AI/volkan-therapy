"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { SiteInfoSettings } from "@/lib/settings-defaults";
import type { ContactContent } from "@/lib/content-defaults";

type ContactSectionProps = {
  siteInfo: SiteInfoSettings;
  content: ContactContent;
};

export function ContactSection({ siteInfo, content }: ContactSectionProps) {
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.heroTitle}{" "}
            <span className="text-primary-500">{content.heroHighlight}</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{content.heroDescription}</p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="font-heading text-xl font-semibold mb-6">
                {content.infoTitle}
              </h3>
              <div className="space-y-6">
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
              <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" asChild>
                  <a href={`tel:${siteInfo.phone.replace(/\s+/g, "")}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Şimdi Ara
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`mailto:${siteInfo.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    E-posta Gönder
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-primary-500 rounded-2xl p-8 text-white">
              <div className="flex items-center mb-6">
                <Calendar className="w-8 h-8 mr-3" />
                <h3 className="font-heading text-xl font-semibold">
                  {content.appointmentTitle}
                </h3>
              </div>
              <p className="mb-6 text-primary-100">{content.appointmentDescription}</p>
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
                <Link href="/randevu">
                  <Calendar className="w-5 h-5 mr-2" />
                  Randevu Takvimini Aç
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
