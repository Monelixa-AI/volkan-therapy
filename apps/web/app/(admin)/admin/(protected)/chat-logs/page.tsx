import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ChatLogsPage() {
  const conversations = await prisma.chatConversation.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Chat Görüşmeleri</h1>

      {conversations.length === 0 ? (
        <p className="text-sm text-slate-500">Henüz chat görüşmesi yok.</p>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tarih</th>
                <th className="px-4 py-3 text-left font-medium">Mesaj</th>
                <th className="px-4 py-3 text-left font-medium">Önizleme</th>
                <th className="px-4 py-3 text-left font-medium">Durum</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {conversations.map((conv) => {
                const msgs = conv.messages as Array<{ role: string; content: string }>;
                const firstUserMsg = msgs.find((m) => m.role === "user");
                const preview = firstUserMsg
                  ? firstUserMsg.content.slice(0, 80) + (firstUserMsg.content.length > 80 ? "..." : "")
                  : "-";

                return (
                  <tr key={conv.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600">
                      {conv.createdAt.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}
                    </td>
                    <td className="px-4 py-3 text-slate-900 font-medium">
                      {conv.messageCount}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                      {preview}
                    </td>
                    <td className="px-4 py-3">
                      {conv.isNotified ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Bildirildi
                        </span>
                      ) : conv.endedAt ? (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          Tamamlandı
                        </span>
                      ) : (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/chat-logs/${conv.id}`}
                        className="text-primary-500 hover:underline text-xs"
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
