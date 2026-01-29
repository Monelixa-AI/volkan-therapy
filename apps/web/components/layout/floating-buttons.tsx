"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteInfoSettings, ChatbotSettings } from "@/lib/settings-defaults";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

function generateSessionId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type UserInfo = {
  name: string;
  email: string;
};

type FloatingButtonsProps = {
  siteInfo: SiteInfoSettings;
  chatbotSettings?: ChatbotSettings;
};

function renderMessageContent(text: string) {
  // Parse markdown links [text](url) and **bold**
  const parts = text.split(/(\[.+?\]\(.+?\)|\*\*.+?\*\*)/g);
  return parts.map((part, i) => {
    const linkMatch = part.match(/^\[(.+?)\]\((.+?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium hover:opacity-80"
        >
          {linkMatch[1]}
        </a>
      );
    }
    const boldMatch = part.match(/^\*\*(.+?)\*\*$/);
    if (boldMatch) {
      return <strong key={i}>{boldMatch[1]}</strong>;
    }
    return part;
  });
}

export function FloatingButtons({ siteInfo, chatbotSettings }: FloatingButtonsProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [shouldBounce, setShouldBounce] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(generateSessionId);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const hasMessagesRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const whatsappLink = `https://wa.me/${siteInfo.whatsapp}?text=Merhaba, bilgi almak istiyorum.`;

  const welcomeMessage = chatbotSettings?.welcomeMessage || "Merhaba! Size nasıl yardımcı olabilirim?";
  const chatEnabled = chatbotSettings?.enabled !== false;
  const maxMessages = chatbotSettings?.maxMessagesPerSession || 20;

  const endSession = useCallback(() => {
    if (!hasMessagesRef.current) return;
    navigator.sendBeacon(
      "/api/chat/end-session",
      JSON.stringify({ sessionId })
    );
  }, [sessionId]);

  useEffect(() => {
    window.addEventListener("beforeunload", endSession);
    return () => window.removeEventListener("beforeunload", endSession);
  }, [endSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Attention animation: bounce + tooltip bubble (first visit only)
  useEffect(() => {
    if (isChatOpen) return;
    const alreadyShown = localStorage.getItem("vomi_bubble_shown");
    if (alreadyShown) return;

    const bounceTimer = setTimeout(() => setShouldBounce(true), 3000);
    const bubbleTimer = setTimeout(() => setShowBubble(true), 5000);
    const hideTimer = setTimeout(() => {
      setShowBubble(false);
      setShouldBounce(false);
      localStorage.setItem("vomi_bubble_shown", "1");
    }, 15000);

    return () => {
      clearTimeout(bounceTimer);
      clearTimeout(bubbleTimer);
      clearTimeout(hideTimer);
    };
  }, [isChatOpen]);

  const handleCloseChat = () => {
    if (isChatOpen && hasMessagesRef.current) {
      fetch("/api/chat/end-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      }).catch(() => {});
    }
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setShowBubble(false);
      setShouldBounce(false);
      localStorage.setItem("vomi_bubble_shown", "1");
    }
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = formName.trim().length >= 3 && isValidEmail(formEmail.trim());

  const handleUserInfoSubmit = () => {
    if (!isFormValid) return;
    setUserInfo({ name: formName.trim(), email: formEmail.trim() });
  };

  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text || isLoading || !userInfo) return;

    hasMessagesRef.current = true;
    const userMessage: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, sessionId, userInfo })
      });
      const data = await res.json();
      const reply = data.reply || data.error || "Yanıt alınamadı.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Bağlantı hatası oluştu. Lütfen ${siteInfo.phone} numarasını arayın veya WhatsApp'tan ulaşın.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const limitReached = userMessageCount >= maxMessages;

  return (
    <>
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <WhatsAppIcon />
      </motion.a>
      <AnimatePresence>
        {showBubble && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed bottom-[5.5rem] right-6 z-50 bg-white rounded-2xl shadow-xl px-4 py-3 max-w-[220px]"
          >
            <button
              onClick={() => {
                setShowBubble(false);
                setShouldBounce(false);
                localStorage.setItem("vomi_bubble_shown", "1");
              }}
              className="absolute -top-2 -left-2 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xs"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-sm text-gray-800">Merhaba! Ben Vomi 👋 Size yardımcı olabilir miyim?</p>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white rotate-45 shadow-sm" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={handleCloseChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={
          shouldBounce && !isChatOpen
            ? { opacity: 1, y: [0, -12, 0, -6, 0], transition: { duration: 0.8, repeat: Infinity, repeatDelay: 2 } }
            : { opacity: 1, y: 0 }
        }
        transition={{ delay: 1.2 }}
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-primary-500 text-white p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Volkan Terapi Asistanı</p>
                  <p className="text-xs text-primary-100">
                    {chatEnabled ? "AI destekli canlı destek" : "Şu anda aktif değil"}
                  </p>
                </div>
              </div>
            </div>

            {!userInfo ? (
              /* User info form */
              <div className="p-5 space-y-4">
                <div className="flex justify-start">
                  <div className="max-w-[90%] p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                    <p className="text-sm">{welcomeMessage}</p>
                    <p className="text-sm mt-2">Sohbete başlamadan önce lütfen bilgilerinizi giriniz.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <User className="w-3.5 h-3.5" />
                    <span>Bilgileriniz</span>
                  </div>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ad Soyad *"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyDown={(e) => e.key === "Enter" && handleUserInfoSubmit()}
                  />
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="E-posta *"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyDown={(e) => e.key === "Enter" && handleUserInfoSubmit()}
                  />
                  <Button
                    className="w-full rounded-lg text-sm"
                    onClick={handleUserInfoSubmit}
                    disabled={!isFormValid}
                  >
                    Sohbete Başla
                  </Button>
                </div>
              </div>
            ) : (
              /* Chat area */
              <>
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                      <p className="text-sm">{welcomeMessage}</p>
                    </div>
                  </div>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.role === "user"
                            ? "bg-primary-500 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{renderMessageContent(msg.content)}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t">
                  {limitReached ? (
                    <p className="text-xs text-center text-gray-500">
                      Mesaj limitine ulaşıldı.{" "}
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">
                        WhatsApp&apos;tan ulaşın
                      </a>.
                    </p>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                        placeholder="Mesajınızı yazın..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                      />
                      <Button
                        size="icon"
                        className="rounded-full"
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
