import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { prisma } from "@/lib/db";

// OpenRouter veya OpenAI kullan (fallback)
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "sk-or-v1-demo",
  baseURL: process.env.OPENROUTER_API_KEY
    ? "https://openrouter.ai/api/v1"
    : undefined
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, answers } = body;

    const assessment = await prisma.assessment.findUnique({
      where: { sessionId }
    });

    if (!assessment) {
      return NextResponse.json(
        { error: "Değerlendirme bulunamadı" },
        { status: 404 }
      );
    }

    const prompt = buildAnalysisPrompt(answers);

    // OpenRouter ücretsiz model veya OpenAI
    const modelName = process.env.OPENROUTER_API_KEY
      ? "google/gemini-2.0-flash-exp:free" // Ücretsiz Gemini model
      : "gpt-4-turbo-preview";

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "system",
          content:
            "Sen pediatrik gelişim uzmanı bir asistansın. Ailelerin çocukları hakkında verdikleri bilgileri analiz ederek, duyusal bütünleme, dikkat eksikliği, otizm spektrum belirtileri ve öğrenme güçlükleri açısından değerlendirme yapıyorsun. ÖNEMLİ: Bu bir ön değerlendirmedir, kesin tanı değildir. Her zaman profesyonel değerlendirme öner. Yanıtlarını Türkçe ver ve ailelerle sıcak, anlayışlı bir dil kullan."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiResponse = completion.choices[0].message.content;
    const analysisResult = parseAIResponse(aiResponse || "");

    await prisma.assessment.update({
      where: { sessionId },
      data: {
        aiAnalysis: analysisResult.scores,
        aiRecommendations: analysisResult.recommendations,
        status: "COMPLETED",
        completedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      analysis: analysisResult
    });
  } catch (error: any) {
    console.error("AI Analysis error:", error);

    // Provide more specific error messages
    let errorMessage = "Analiz sırasında bir hata oluştu";

    if (error?.code === "ETIMEDOUT" || error?.code === "ECONNRESET") {
      errorMessage = "Baglanti zaman asimina ugradi. Lutfen tekrar deneyin.";
    } else if (error?.status === 429) {
      errorMessage = "Cok fazla istek gonderildi. Lutfen biraz bekleyip tekrar deneyin.";
    } else if (error?.message?.includes("API key")) {
      errorMessage = "AI servisi yapilandirma hatasi. Lutfen yoneticiye bildirin.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

function buildAnalysisPrompt(answers: any): string {
  return `Aşağıdaki bilgilere göre çocuk için bir ön değerlendirme yap:

## Genel Bilgiler
- Çocuğun Yaşı: ${answers.childAge}
- Cinsiyeti: ${answers.childGender}
- Önceki tanı/şüphe: ${answers.previousDiagnosis || "Yok"}
- Endişe alanları: ${answers.concernAreas?.join(", ") || "Belirtilmedi"}

## Duyusal Gözlemler (1-4 ölçeği, 1=hiç, 4=çok sık)
- Seslere hassasiyet: ${answers.soundSensitivity}/4
- Dokunmaya hassasiyet: ${answers.touchSensitivity}/4
- Göz teması: ${answers.eyeContact}/4
- Yerinde oturmada zorluk: ${answers.sittingDifficulty}/4
- Kaygı düzeyi: ${answers.anxietyLevel}/4
- Harf karıştırma: ${answers.letterConfusion}/4

## Detaylı Gözlemler
- Oyun davranışı: ${answers.playBehavior}
- Rutin değişikliklerine tepki: ${answers.routineReaction}
- Motor beceriler: ${answers.motorSkills}
- Öğretmen geri bildirimi: ${answers.teacherFeedback || "Yok"}
- Ana endişe: ${answers.mainConcern}

Lütfen şu formatta analiz yap:
1. DUYUSAL İŞLEMLEME SKORU (0-100)
2. DİKKAT/ODAKLANMA SKORU (0-100)
3. SOSYAL ETKİLEŞİM SKORU (0-100)
4. ÖĞRENME BECERİLERİ SKORU (0-100)
5. MOTOR GELİŞİM SKORU (0-100)

Her alan için kısa açıklama ve önerilen hizmetleri belirt.
Genel değerlendirme özeti ve aciliyet düzeyi (düşük/orta/yüksek) ver.`;
}

function parseAIResponse(response: string) {
  const scores = {
    sensory: extractScore(response, "DUYUSAL") || 70,
    attention: extractScore(response, "DİKKAT") || 65,
    social: extractScore(response, "SOSYAL") || 75,
    learning: extractScore(response, "ÖĞRENME") || 70,
    motor: extractScore(response, "MOTOR") || 80
  };

  return {
    scores,
    recommendations: response,
    urgency: determineUrgency(scores)
  };
}

function extractScore(text: string, keyword: string): number | null {
  const regex = new RegExp(`${keyword}[^0-9]*([0-9]+)`, "i");
  const match = text.match(regex);
  return match ? parseInt(match[1]) : null;
}

function determineUrgency(scores: Record<string, number>): string {
  const avgScore =
    Object.values(scores).reduce((a, b) => a + b, 0) /
    Object.values(scores).length;
  if (avgScore < 50) return "high";
  if (avgScore < 70) return "medium";
  return "low";
}