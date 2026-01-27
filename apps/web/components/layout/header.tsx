"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteInfoSettings } from "@/lib/settings-defaults";

const navigation = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Hizmetler", href: "/hizmetler" },
  { name: "Hakkımda", href: "/hakkimda" },
  { name: "Blog", href: "/blog" },
  { name: "İletişim", href: "/iletisim" }
];

type HeaderProps = {
  siteInfo: SiteInfoSettings;
};

export function Header({ siteInfo }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const phoneLink = `tel:${siteInfo.phone.replace(/\s+/g, "")}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="bg-primary-600 text-white py-2 text-center text-sm">
        <span>İlk görüşme %20 indirimli! </span>
        <Link href="/randevu" className="underline font-semibold">
          Hemen Randevu Al
        </Link>
      </div>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-white"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">{"V\u00d6"}</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-heading font-bold text-xl text-gray-900">
                  {siteInfo.siteName}
                </p>
                <p className="text-xs text-gray-500">{siteInfo.title}</p>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary-500",
                    pathname === item.href ? "text-primary-500" : "text-gray-600"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="hidden lg:flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <a href={phoneLink}>
                  <Phone className="w-4 h-4 mr-2" />
                  Ara
                </a>
              </Button>
              <Button asChild>
                <Link href="/randevu">
                  <Calendar className="w-4 h-4 mr-2" />
                  Randevu Al
                </Link>
              </Button>
            </div>
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-gray-600 hover:text-primary-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/randevu">Randevu Al</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

