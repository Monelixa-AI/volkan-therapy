import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP_NUMBER || "";
const TWILIO_WHATSAPP = process.env.TWILIO_WHATSAPP_NUMBER || "";

interface WhatsAppMessage {
  to?: string;
  message: string;
}

export async function sendWhatsAppNotification({ to, message }: WhatsAppMessage) {
  try {
    const recipient = to || ADMIN_WHATSAPP;

    await client.messages.create({
      body: message,
      from: `whatsapp:${TWILIO_WHATSAPP}`,
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