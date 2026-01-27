import type { Metadata } from "next";
import { Open_Sans, Poppins, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingButtons } from "@/components/layout/floating-buttons";
import { Toaster } from "@/components/ui/sonner";
import { getSiteInfo } from "@/lib/site-settings";
import { getLegalPages } from "@/lib/legal";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-open-sans"
});

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "Volkan Özcihan | Uzman Fizyoterapist & Duyusal Bütünleme Terapisti",
  description:
    "30 yıllık deneyimle duyusal bütünleme, otizm, ADHD ve disleksi terapisi. Çocuğunuzun potansiyelini birlikte keşfedelim.",
  keywords: [
    "duyusal bütünleme",
    "otizm terapisi",
    "ADHD",
    "disleksi",
    "çocuk fizyoterapisi",
    "İstanbul"
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://volkanozcihan.com",
    siteName: "Volkan Özcihan",
    title: "Volkan Özcihan | Uzman Fizyoterapist",
    description: "Çocuğunuzun potansiyelini birlikte keşfedelim",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Volkan Özcihan"
      }
    ]
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [siteInfo, legalPages] = await Promise.all([getSiteInfo(), getLegalPages()]);

  return (
    <html
      lang="tr"
      className={`${openSans.variable} ${poppins.variable} ${playfair.variable}`}
    >
      <body className="font-sans antialiased">
        <Header siteInfo={siteInfo} />
        {children}
        <Footer siteInfo={siteInfo} legalPages={legalPages} />
        <FloatingButtons siteInfo={siteInfo} />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
