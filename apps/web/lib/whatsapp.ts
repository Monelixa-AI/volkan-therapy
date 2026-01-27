import twilio from "twilio";

function getClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    return null;
  }
  return twilio(accountSid, authToken);
}

interface WhatsAppMessage {
  to?: string;
  message: string;
}

export async function sendWhatsAppNotification({ to, message }: WhatsAppMessage) {
  try {
    const client = getClient();
    if (!client) {
      console.warn("Twilio credentials not configured");
      return { success: false, error: "Twilio not configured" };
    }

    const adminWhatsApp = process.env.ADMIN_WHATSAPP_NUMBER || "";
    const twilioWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || "";
    const recipient = to || adminWhatsApp;

    await client.messages.create({
      body: message,
      from: `whatsapp:${twilioWhatsApp}`,
      to: `whatsapp:${recipient}`
    });
    return { success: true };
  } catch (error) {
    console.error("WhatsApp error:", error);
    return { success: false, error };
  }
}

export async function sendBookingReminder(data: {
  phone: string;
  name: string;
  date: string;
  time: string;
  service: string;
}) {
  const message = `🔔 Randevu Hatırlatması
Sayın ${data.name},
Yarınki randevunuzu hatırlatmak isteriz:
📅 Tarih: ${data.date}
⏰ Saat: ${data.time}
🏥 Hizmet: ${data.service}
📍 Adres: Arıköy Sitesi, Uskumruköy, 34450 Sarıyer/İstanbul
(Detaylı adres için yanıtlayın)
İptal veya değişiklik için lütfen en kısa sürede bizimle iletişime geçin.
Görüşmek üzere! 🙏
Volkan Özcihan`;

  return sendWhatsAppNotification({ to: data.phone, message });
}