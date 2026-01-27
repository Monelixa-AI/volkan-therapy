"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Phone,
  Calendar,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Info,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsProps {
  results: {
    scores: {
      sensory: number;
      attention: number;
      social: number;
      learning: number;
      motor: number;
    };
    recommendations: string;
    urgency: "low" | "medium" | "high";
  };
  answers: any;
}

const scoreLabels = {
  sensory: { label: "Duyusal İşlemleme", icon: "👁️" },
  attention: { label: "Dikkat & Odaklanma", icon: "🎯" },
  social: { label: "Sosyal Etkileşim", icon: "👥" },
  learning: { label: "Öğrenme Becerileri", icon: "📚" },
  motor: { label: "Motor Gelişim", icon: "🏃" }
};

const urgencyConfig = {
  low: {
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle,
    title: "Genel Durum İyi Görünüyor",
    description:
      "Değerlendirme sonuçlarınız normal sınırlarda. Yine de profesyonel bir görüş almanızı öneririz."
  },
  medium: {
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: Info,
    title: "Bazı Alanlar Dikkat Gerektiriyor",
    description:
      "Bazı alanlarda destek faydalı olabilir. Profesyonel değerlendirme öneriyoruz."
  },
  high: {
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: AlertTriangle,
    title: "Profesyonel Değerlendirme Önerilir",
    description:
      "Sonuçlar, profesyonel bir değerlendirmenin faydalı olacağını gösteriyor."
  }
};

export function AssessmentResults({ results, answers }: ResultsProps) {
  const urgency = urgencyConfig[results.urgency];
  const UrgencyIcon = urgency.icon;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "İyi";
    if (score >= 60) return "Orta";
    return "Dikkat";
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareText = `Çocuğum için AI destekli gelişim değerlendirmesi yaptırdım. Duyusal İşlemleme: ${results.scores.sensory}/100, Dikkat: ${results.scores.attention}/100, Sosyal: ${results.scores.social}/100`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Değerlendirme Sonuçlarım',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert('Link panoya kopyalandı!');
    }
  };

  const handleRestart = () => {
    window.location.href = '/degerlendirme';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex justify-end"
      >
        <Button variant="outline" size="sm" onClick={handleRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Yeniden Başla
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">📊</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
          Değerlendirme Sonuçlarınız
        </h1>
        <p className="text-gray-600">
          {answers.childAge} yaş grubu için yapay zeka destekli ön değerlendirme
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${urgency.bgColor} ${urgency.borderColor} border rounded-xl p-6 mb-8`}
      >
        <div className="flex items-start gap-4">
          <UrgencyIcon className={`w-8 h-8 ${urgency.color} flex-shrink-0`} />
          <div>
            <h2 className={`font-semibold text-lg ${urgency.color} mb-1`}>
              {urgency.title}
            </h2>
            <p className="text-gray-700">{urgency.description}</p>
          </div>
        </div>
      </motion.div>
      <div className="grid gap-4 mb-8">
        {Object.entries(results.scores).map(([key, score], index) => {
          const info = scoreLabels[key as keyof typeof scoreLabels];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{info.icon}</span>
                  <span className="font-medium text-gray-900">{info.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      score >= 80
                        ? "text-green-600"
                        : score >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {getScoreText(score as number)}
                  </span>
                  <span className="font-bold text-gray-900">{score}/100</span>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-full ${getScoreColor(score as number)} rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-50 rounded-xl p-6 mb-8"
      >
        <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Yapay Zeka Önerileri
        </h3>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="whitespace-pre-line">{results.recommendations}</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8"
      >
        <p className="text-sm text-blue-800">
          <strong>⚠️ Önemli Not:</strong> Bu sonuçlar yapay zeka tarafından
          oluşturulmuş bir ön değerlendirmedir ve kesinlikle tıbbi bir tanı
          yerine geçmez. Kesin değerlendirme için mutlaka bir uzmanla
          görüşmenizi öneriyoruz.
        </p>
        <p className="text-sm text-blue-900 mt-3 pt-3 border-t border-blue-200">
          <strong className="flex items-start gap-2">
            <span className="text-yellow-600 text-base">⚠️</span>
            <span>Lütfen unutmayın ki bu sadece bir ön değerlendirmedir, kesin bir tanı koymak için bir uzmana başvurmanız önemlidir.</span>
          </strong>
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="space-y-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Button size="lg" className="w-full" asChild>
            <Link href="/randevu">
              <Calendar className="w-5 h-5 mr-2" />
              Randevu Al
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full" asChild>
            <a href="tel:+905322862521">
              <Phone className="w-5 h-5 mr-2" />
              Hemen Ara
            </a>
          </Button>
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="ghost" size="sm" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            PDF İndir
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Paylaş
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mt-12 bg-primary-500 text-white rounded-xl p-8 text-center"
      >
        <h3 className="font-heading text-xl font-bold mb-2">Sorularınız mı var?</h3>
        <p className="text-primary-100 mb-6">
          Sonuçlarınız hakkında detaylı bilgi almak için bizimle iletişime geçin.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/905322862521?text=Merhaba, AI değerlendirme sonuçlarım hakkında bilgi almak istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
          >
            WhatsApp ile Ulaşın
          </a>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-8 flex justify-center"
      >
        <Button variant="outline" size="lg" onClick={handleRestart}>
          <RotateCcw className="w-5 h-5 mr-2" />
          Yeniden Başla
        </Button>
      </motion.div>
    </div>
  );
}