import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getChatbotSettings } from "@/lib/site-settings";
import { sendChatConversationNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { sessionId } = (await request.json()) as { sessionId: string };

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId gerekli." }, { status: 400 });
    }

    const conversation = await prisma.chatConversation.findUnique({
      where: { sessionId }
    });

    if (!conversation) {
      return NextResponse.json({ ok: true });
    }

    // Mark session as ended
    await prisma.chatConversation.update({
      where: { sessionId },
      data: { endedAt: new Date() }
    });

    // Send notification if conditions met
    const settings = await getChatbotSettings();
    if (
      settings.enableNotifications &&
      !conversation.isNotified &&
      conversation.messageCount >= settings.notificationMinMessages
    ) {
      const messages = conversation.messages as Array<{
        role: string;
        content: string;
        timestamp?: string;
      }>;

      sendChatConversationNotification({
        sessionId: conversation.sessionId,
        messages,
        messageCount: conversation.messageCount,
        startedAt: conversation.startedAt.toISOString()
      })
        .then(() =>
          prisma.chatConversation.update({
            where: { sessionId },
            data: { isNotified: true }
          })
        )
        .catch((err) => console.error("Chat notification error:", err));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("End session error:", error);
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}
