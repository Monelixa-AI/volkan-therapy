"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Baby,
  Eye,
  Brain,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssessmentResults } from "./assessment-results";

const steps = [
  { id: 1, title: "Genel Bilgiler", icon: Baby },
  { id: 2, title: "Duyusal Gözlemler", icon: Eye },
  { id: 3, title: "Detaylı Sorular", icon: Brain },
  { id: 4, title: "Ek Bilgiler", icon: FileText }
];

const ageOptions = [
  "0-2 yaş",
  "2-4 yaş",
  "4-6 yaş",
  "6-8 yaş",
  "8-12 yaş",
  "12+ yaş"
];

const concernOptions = [
  { id: "sensory", label: "Duyusal hassasiyet (ses, dokunma, ışık)" },
  { id: "attention", label: "Dikkat ve odaklanma güçlüğü" },
  { id: "social", label: "Sosyal etkileşim zorlukları" },
  { id: "speech", label: "Konuşma/dil gecikmesi" },
  { id: "motor", label: "Motor beceri zorlukları" },
  { id: "learning", label: "Öğrenme güçlükleri" },
  { id: "anxiety", label: "Kaygı ve korkular" },
  { id: "behavior", label: "Davranış sorunları" }
];

export function AssessmentWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(
    () => `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`
  );

  const [answers, setAnswers] = useState({
    childAge: "",
    childGender: "",
    previousDiagnosis: "",
    concernAreas: [] as string[],
    soundSensitivity: 0,
    touchSensitivity: 0,
    eyeContact: 0,
    sittingDifficulty: 0,
    anxietyLevel: 0,
    letterConfusion: 0,
    playBehavior: "",
    routineReaction: "",
    motorSkills: "",
    teacherFeedback: "",
    mainConcern: ""
  });

  const updateAnswer = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // Scroll to top when step changes, analysis starts, results appear, or error occurs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, isAnalyzing, results, error]);

  const toggleConcern = (concernId: string) => {
    setAnswers((prev) => ({
      ...prev,
      concernAreas: prev.concernAreas.includes(concernId)
        ? prev.concernAreas.filter((c) => c !== concernId)
        : [...prev.concernAreas, concernId]
    }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      await fetch("/api/assessment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answers })
      });
      const res = await fetch("/api/assessment/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answers })
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.analysis);
      } else {
        throw new Error(data.error || "Analiz basarisiz oldu");
      }
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "Analiz sirasinda bir hata olustu. Lutfen tekrar deneyin.");
      setIsAnalyzing(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleAnalyze();
  };

  if (results) {
    return <AssessmentResults results={results} answers={answers} />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 text-red-500">
          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
          Bir Sorun Olustu
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {error}
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => { setError(null); setCurrentStep(4); }}>
            Geri Don
          </Button>
          <Button onClick={handleRetry}>
            Tekrar Dene
          </Button>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="text-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6"
        >
          <Sparkles className="w-full h-full text-primary-500" />
        </motion.div>
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
          Yapay Zeka Analiz Ediyor...
        </h2>
        <p className="text-gray-600">
          Verdiğiniz bilgiler değerlendiriliyor. Bu işlem birkaç saniye sürebilir.
        </p>
        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary-500 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= step.id
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <span className="text-xs mt-2 text-gray-600 hidden sm:block">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 sm:w-24 h-1 mx-2 ${
                  currentStep > step.id ? "bg-primary-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                Çocuğunuz Hakkında Genel Bilgiler
              </h2>
              <p className="text-gray-600">
                Bu bilgiler değerlendirmeyi kişiselleştirmemize yardımcı olacak.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Çocuğunuzun yaşı nedir?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {ageOptions.map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => updateAnswer("childAge", age)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      answers.childAge === age
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Çocuğunuzun cinsiyeti
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Erkek", "Kız", "Belirtmek istemiyorum"].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => updateAnswer("childGender", gender)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      answers.childGender === gender
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Daha önce herhangi bir tanı veya şüphe var mı?
              </label>
              <input
                type="text"
                value={answers.previousDiagnosis}
                onChange={(e) => updateAnswer("previousDiagnosis", e.target.value)}
                placeholder="Örn: Otizm şüphesi, DEHB tanısı, vb. (yoksa boş bırakın)"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hangi alanlarda endişeleriniz var? (Birden fazla seçebilirsiniz)
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {concernOptions.map((concern) => (
                  <button
                    key={concern.id}
                    type="button"
                    onClick={() => toggleConcern(concern.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      answers.concernAreas.includes(concern.id)
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="flex items-center">
                      <span
                        className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                          answers.concernAreas.includes(concern.id)
                            ? "bg-primary-500 border-primary-500 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {answers.concernAreas.includes(concern.id) && "✓"}
                      </span>
                      {concern.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => setCurrentStep(2)}
              disabled={!answers.childAge}
            >
              Devam Et
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                Duyusal Gözlemler
              </h2>
              <p className="text-gray-600">
                Aşağıdaki durumlar çocuğunuzda ne sıklıkla görülüyor?
              </p>
            </div>
            <SensoryQuestion
              question="Belirli seslere karşı aşırı tepki veriyor mu? (kulaklarını kapatma, ağlama vb.)"
              value={answers.soundSensitivity}
              onChange={(v) => updateAnswer("soundSensitivity", v)}
            />
            <SensoryQuestion
              question="Belirli dokunuşlardan veya dokulardan kaçınıyor mu?"
              value={answers.touchSensitivity}
              onChange={(v) => updateAnswer("touchSensitivity", v)}
            />
            <SensoryQuestion
              question="Göz teması kurmakta zorlanıyor mu?"
              value={answers.eyeContact}
              onChange={(v) => updateAnswer("eyeContact", v)}
            />
            <SensoryQuestion
              question="Bir yerde uzun süre oturmakta zorlanıyor mu?"
              value={answers.sittingDifficulty}
              onChange={(v) => updateAnswer("sittingDifficulty", v)}
            />
            <SensoryQuestion
              question="Yeni ortam veya durumlarda aşırı kaygılanıyor mu?"
              value={answers.anxietyLevel}
              onChange={(v) => updateAnswer("anxietyLevel", v)}
            />
            <SensoryQuestion
              question="Harfleri veya sayıları karıştırıyor, ters yazıyor mu?"
              value={answers.letterConfusion}
              onChange={(v) => updateAnswer("letterConfusion", v)}
            />
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ChevronLeft className="w-5 h-5 mr-2" />
                Geri
              </Button>
              <Button className="flex-1" onClick={() => setCurrentStep(3)}>
                Devam Et
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                Detaylı Değerlendirme
              </h2>
              <p className="text-gray-600">
                Bu sorular daha kişiselleştirilmiş bir analiz yapmamızı sağlayacak.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Çocuğunuz nasıl oynuyor? (Tek başına mı, arkadaşlarıyla mı, hayal gücü kullanıyor mu?)
              </label>
              <textarea
                value={answers.playBehavior}
                onChange={(e) => updateAnswer("playBehavior", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Oyun alışkanlıklarını anlatın..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rutinler değiştiğinde nasıl tepki veriyor?
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Hiç sorun olmuyor",
                  "Biraz huzursuzlanıyor",
                  "Çok zorlanıyor",
                  "Aşırı tepki veriyor (ağlama, kriz vb.)"
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateAnswer("routineReaction", option)}
                    className={`p-3 rounded-xl border-2 text-sm transition-all ${
                      answers.routineReaction === option
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motor becerileri hakkında (koşma, merdiven çıkma, kalem tutma vb.)
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Yaşına uygun gelişim gösteriyor",
                  "Kaba motor becerilerde zorluk var",
                  "İnce motor becerilerde zorluk var",
                  "Her iki alanda da zorluk var"
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateAnswer("motorSkills", option)}
                    className={`p-3 rounded-xl border-2 text-sm transition-all ${
                      answers.motorSkills === option
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Öğretmen veya bakıcıdan herhangi bir geri bildirim aldınız mı? (Opsiyonel)
              </label>
              <textarea
                value={answers.teacherFeedback}
                onChange={(e) => updateAnswer("teacherFeedback", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Varsa öğretmen görüşlerini paylaşın..."
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ChevronLeft className="w-5 h-5 mr-2" />
                Geri
              </Button>
              <Button className="flex-1" onClick={() => setCurrentStep(4)}>
                Devam Et
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                Son Adım
              </h2>
              <p className="text-gray-600">
                Ana endişenizi detaylandırın, analiz için hazırız.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                En çok hangi konuda destek almak istiyorsunuz?
              </label>
              <textarea
                value={answers.mainConcern}
                onChange={(e) => updateAnswer("mainConcern", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Çocuğunuzla ilgili en önemli endişenizi ve beklentilerinizi detaylı olarak anlatın..."
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-2">
                📎 Video veya Fotoğraf Ekleyin (Opsiyonel)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Çocuğunuzun oyun anı, davranış örneği veya endişe duyduğunuz
                bir durumu gösteren kısa video veya fotoğraflar değerlendirmemize
                yardımcı olabilir.
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  id="media-upload"
                  onChange={(e) => {
                    console.log("Files:", e.target.files);
                  }}
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">Dosya seçmek için tıklayın veya sürükleyip bırakın</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, MP4 (max. 50MB)</p>
                </label>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <input type="checkbox" id="consent" required className="mt-1" />
              <label htmlFor="consent" className="text-sm text-gray-700">
                Bu bilgilerin yapay zeka ile analiz edilmesine ve{" "}
                <a href="/kvkk" className="text-primary-500 underline">
                  KVKK Aydınlatma Metni
                </a>{" "}
                kapsamında işlenmesine onay veriyorum. Bu değerlendirmenin
                <strong> kesin bir tanı olmadığını</strong> ve profesyonel
                değerlendirme gerektirdiğini anlıyorum.
              </label>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                <ChevronLeft className="w-5 h-5 mr-2" />
                Geri
              </Button>
              <Button className="flex-1" onClick={handleAnalyze} disabled={!answers.mainConcern}>
                <Sparkles className="w-5 h-5 mr-2" />
                AI Analizi Başlat
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SensoryQuestion({
  question,
  value,
  onChange
}: {
  question: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const options = [
    { value: 1, label: "Hiç", emoji: "😊" },
    { value: 2, label: "Bazen", emoji: "🤔" },
    { value: 3, label: "Sık sık", emoji: "😟" },
    { value: 4, label: "Çok sık", emoji: "😰" }
  ];

  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <p className="font-medium text-gray-900 mb-4">{question}</p>
      <div className="grid grid-cols-4 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`p-3 rounded-lg text-center transition-all ${
              value === option.value
                ? "bg-primary-500 text-white"
                : "bg-white border hover:border-primary-300"
            }`}
          >
            <span className="text-2xl block mb-1">{option.emoji}</span>
            <span className="text-xs">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}