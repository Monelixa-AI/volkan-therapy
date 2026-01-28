import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { getChatbotSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages: ChatMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Mesaj gerekli." }, { status: 400 });
    }

    const settings = await getChatbotSettings();

    if (!settings.enabled) {
      return NextResponse.json({
        reply: "Canlı destek şu anda aktif değil. Lütfen WhatsApp üzerinden bize ulaşın."
      });
    }

    if (messages.length > settings.maxMessagesPerSession) {
      return NextResponse.json({
        reply: "Oturum mesaj limitine ulaşıldı. Daha fazla bilgi için lütfen WhatsApp üzerinden bize ulaşın veya randevu alın."
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY not configured");
      return NextResponse.json({
        reply: "Sistem şu anda kullanılamıyor. Lütfen WhatsApp üzerinden bize ulaşın."
      });
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1"
    });

    const fallbackModels = [
      settings.model,
      "deepseek/deepseek-r1-0528:free",
      "google/gemini-2.5-flash-preview:free",
      "meta-llama/llama-4-maverick:free",
      "google/gemma-3-27b-it:free",
      "microsoft/phi-4-reasoning-plus:free",
      "qwen/qwen3-235b-a22b:free"
    ];

    // Deduplicate models in case settings.model is already in the list
    const uniqueModels = [...new Set(fallbackModels)];

    let lastError: any;
    for (const model of uniqueModels) {
      try {
        const completion = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: settings.systemPrompt },
            ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))
          ],
          temperature: settings.temperature,
          max_tokens: 500
        });

        const reply = completion.choices[0]?.message?.content || "";
        return NextResponse.json({ reply });
      } catch (err: any) {
        lastError = err;
        console.log(`Chat model ${model} failed, trying next...`);
        continue;
      }
    }

    console.error("All chat models failed:", lastError);
    return NextResponse.json({
      reply: "Şu anda yanıt veremiyorum. Lütfen WhatsApp üzerinden bize ulaşın."
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
