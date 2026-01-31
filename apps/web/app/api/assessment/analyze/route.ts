import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";
import { prisma } from "@/lib/db";

const systemPrompt =
  "Sen pediatrik gelişim uzmanı bir asistansın. Ailelerin çocukları hakkında verdikleri bilgileri analiz ederek, duyusal bütünleme, dikkat eksikliği, otizm spektrum belirtileri ve öğrenme güçlükleri açısından değerlendirme yapıyorsun. ÖNEMLİ: Bu bir ön değerlendirmedir, kesin tanı değildir. Her zaman profesyonel değerlendirme öner. Yanıtlarını Türkçe ver ve ailelerle sıcak, anlayışlı bir dil kullan.";

async function callGoogleAI(prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    { text: systemPrompt },
    { text: prompt }
  ]);

  return result.response.text();
}

async function callOpenRouterAI(prompt: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  });

  // Ücretsiz modeller sırayla denenecek
  const freeModels = [
    "deepseek/deepseek-r1-0528:free",
    "google/gemini-2.5-flash-preview:free",
    "meta-llama/llama-4-maverick:free",
    "google/gemma-3-27b-it:free",
    "microsoft/phi-4-reasoning-plus:free",
    "qwen/qwen3-235b-a22b:free"
  ];

  let lastError: any;
  for (const model of freeModels) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });
      return completion.choices[0].message.content || "";
    } catch (err: any) {
      lastError = err;
      console.log(`Model ${model} failed, trying next...`);
      continue;
    }
  }
  throw lastError;
}

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

    let aiResponse: string;

    // OpenRouter öncelikli, başarısız olursa Google AI'ya düş
    if (process.env.OPENROUTER_API_KEY) {
      try {
        aiResponse = await callOpenRouterAI(prompt);
      } catch (openRouterErr) {
        console.error("OpenRouter failed, trying Google AI:", openRouterErr);
        if (process.env.GOOGLE_AI_API_KEY) {
          aiResponse = await callGoogleAI(prompt);
        } else {
          throw openRouterErr;
        }
      }
    } else if (process.env.GOOGLE_AI_API_KEY) {
      aiResponse = await callGoogleAI(prompt);
    } else {
      throw new Error("No AI API key configured");
    }

    const analysisResult = parseAIResponse(aiResponse);

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

    let errorMessage = "Analiz sırasında bir hata oluştu";

    if (error?.code === "ETIMEDOUT" || error?.code === "ECONNRESET") {
      errorMessage = "Baglanti zaman asimina ugradi. Lutfen tekrar deneyin.";
    } else if (error?.status === 429 || error?.message?.includes("429")) {
      errorMessage = "Cok fazla istek gonderildi. Lutfen biraz bekleyip tekrar deneyin.";
    } else if (error?.message?.includes("API key") || error?.message?.includes("API_KEY")) {
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
