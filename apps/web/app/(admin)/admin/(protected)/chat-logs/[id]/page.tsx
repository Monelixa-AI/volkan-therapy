import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function ChatLogDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = await prisma.chatConversation.findUnique({
    where: { id }
  });

  if (!conversation) {
    notFound();
  }

  const messages = conversation.messages as Array<{
    role: string;
    content: string;
    timestamp?: string;
  }>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Chat Detayı</h1>
        <Link href="/admin/chat-logs" className="text-sm text-primary-500 hover:underline">
          ← Geri
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 text-sm">
        <p><strong>Tarih:</strong> {conversation.createdAt.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</p>
        <p><strong>Mesaj Sayısı:</strong> {conversation.messageCount}</p>
        <p>
          <strong>Durum:</strong>{" "}
          {conversation.endedAt
            ? `Tamamlandı (${conversation.endedAt.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })})`
            : "Aktif"}
        </p>
        <p><strong>Bildirim:</strong> {conversation.isNotified ? "Gönderildi" : "Gönderilmedi"}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Konuşma</h2>
        <div className="space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-primary-100 text-primary-900 rounded-br-none"
                    : "bg-slate-100 text-slate-800 rounded-bl-none"
                }`}
              >
                <p className="text-xs font-medium mb-1 text-slate-500">
                  {msg.role === "user" ? "Kullanıcı" : "Asistan"}
                </p>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
