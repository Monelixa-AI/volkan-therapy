"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Linkedin
} from "lucide-react";
import type { SiteInfoSettings } from "@/lib/settings-defaults";

const footerLinks = {
  hizmetler: [
    { name: "Duyusal Bütünleme", href: "/hizmetler/duyusal-butunleme" },
    { name: "Otizm Terapisi", href: "/hizmetler/otizm-terapisi" },
    { name: "ADHD Desteği", href: "/hizmetler/adhd-hiperaktivite" },
    { name: "Disleksi Terapisi", href: "/hizmetler/disleksi-terapisi" },
    { name: "Evde Bakım", href: "/hizmetler/ameliyat-sonrasi-bakim" }
  ],
  kurumsal: [
    { name: "Hakkımda", href: "/hakkimda" },
    { name: "Blog", href: "/blog" },
    { name: "Sıkça Sorulan Sorular", href: "/sss" },
    { name: "İletişim", href: "/iletisim" }
  ]
};

const socialIconMap = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin
};

type FooterProps = {
  siteInfo: SiteInfoSettings;
  legalPages: { slug: string; title: string }[];
};

export function Footer({ siteInfo, legalPages }: FooterProps) {
  const phoneLink = `tel:${siteInfo.phone.replace(/\s+/g, "")}`;
  const mailLink = `mailto:${siteInfo.email}`;

  const socialLinks = [
    { name: "Facebook", icon: socialIconMap.facebook, href: siteInfo.socialLinks.facebook },
    { name: "Instagram", icon: socialIconMap.instagram, href: siteInfo.socialLinks.instagram },
    { name: "YouTube", icon: socialIconMap.youtube, href: siteInfo.socialLinks.youtube },
    { name: "LinkedIn", icon: socialIconMap.linkedin, href: siteInfo.socialLinks.linkedin }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">{"V\u00d6"}</span>
              </div>
              <div>
                <p className="font-heading font-bold text-xl text-white">
                  {siteInfo.siteName}
                </p>
                <p className="text-xs text-gray-400">{siteInfo.title}</p>
              </div>
            </Link>
            <p className="text-sm mb-6">
              30 yıllık deneyimle çocukların gelişimine ve ailelerin mutluluğuna
              katkıda bulunuyoruz.
            </p>
            <div className="space-y-3">
              <a href={phoneLink} className="flex items-center hover:text-white">
                <Phone className="w-4 h-4 mr-3" />
                {siteInfo.phone}
              </a>
              <a href={mailLink} className="flex items-center hover:text-white">
                <Mail className="w-4 h-4 mr-3" />
                {siteInfo.email}
              </a>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 mt-1" />
                <span>{siteInfo.address}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Hizmetlerimiz</h4>
            <ul className="space-y-2">
              {footerLinks.hizmetler.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Kurumsal</h4>
            <ul className="space-y-2">
              {footerLinks.kurumsal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Yasal</h4>
            <ul className="space-y-2 mb-6">
              {legalPages.map((link) => (
                <li key={link.slug}>
                  <Link
                    href={`/${link.slug}`}
                    className="hover:text-white transition-colors text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold text-white mb-4">Bizi Takip Edin</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {"V\u00d6"}
              </span>
              <p>
                © {new Date().getFullYear()} {siteInfo.siteName}. Tüm hakları
                saklıdır.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 md:mt-0">
              <a
                href={siteInfo.poweredBy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Image
                  src={siteInfo.poweredBy.logo}
                  alt={siteInfo.poweredBy.label}
                  width={96}
                  height={24}
                  className="h-5 w-auto"
                />
                <span>{siteInfo.poweredBy.label}</span>
              </a>
              <p>Türkiye'de sevgiyle yapıldı</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
