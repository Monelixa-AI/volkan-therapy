export type SiteInfoSettings = {
  siteName: string;
  title: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  addressNote: string;
  workingHoursWeekday: string;
  workingHoursWeekend: string;
  mapEmbedUrl: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  poweredBy: {
    label: string;
    url: string;
    logo: string;
  };
  timezoneOffset: string;
};

export type EmailTemplateSettings = {
  confirmationSubject: string;
  confirmationBody: string;
  reminderSubject: string;
  reminderBody: string;
  thankYouSubject: string;
  thankYouBody: string;
};

export type EmailSettings = {
  fromName: string;
  fromEmail: string;
  replyTo: string;
  notificationEmail: string;
  useResendOverride: boolean;
  resendApiKeyEncrypted: string | null;
  enableBookingConfirmation: boolean;
  enableReminders: boolean;
  reminderOffsetsMinutes: number[];
  enableThankYou: boolean;
  thankYouOffsetMinutes: number;
  templates: EmailTemplateSettings;
};

export type BackupSettings = {
  frequency: "manual" | "daily" | "weekly" | "monthly";
  time: string;
  dayOfWeek: number;
  dayOfMonth: number;
  lastRunAt: string | null;
};

export type ChatbotSettings = {
  enabled: boolean;
  model: string;
  systemPrompt: string;
  welcomeMessage: string;
  maxMessagesPerSession: number;
  temperature: number;
  enableNotifications: boolean;
  notificationMinMessages: number;
};

export const DEFAULT_CHATBOT_SETTINGS: ChatbotSettings = {
  enabled: true,
  model: "deepseek/deepseek-r1-0528:free",
  systemPrompt: `Sen Volkan Özcihan'ın terapi kliniğinin dijital asistanısın. Adın "Volkan Terapi Asistanı".

GÖREV: Ailelere çocuk gelişimi, terapi hizmetleri ve randevu konularında yardımcı olmak.

HİZMETLERİMİZ:
- Duyusal Bütünleme Terapisi
- Otizm Spektrum Desteği
- ADHD / Dikkat Eksikliği Desteği
- Disleksi / Öğrenme Güçlükleri
- Pediatrik Fizyoterapi
- Yetişkin Rehabilitasyon
- Evde Bakım Hizmetleri

BİLGİLER:
- Uzman: Volkan Özcihan, 30+ yıl deneyimli Fizyoterapist & Duyusal Bütünleme Terapisti
- Konum: İstanbul, Sarıyer
- Ücretsiz ön değerlendirme mevcut (web sitesinde AI destekli)

KURALLAR:
1. Sadece terapi, çocuk gelişimi, hizmetlerimiz ve randevu konularında yanıt ver
2. Tıbbi teşhis koyma, ilaç önerme
3. Konu dışı sorulara kibarca "Bu konuda yardımcı olamıyorum, ancak terapi hizmetlerimiz hakkında bilgi verebilirim" de
4. Her zaman Türkçe yanıt ver
5. Sıcak, profesyonel ve anlayışlı bir dil kullan
6. Detaylı bilgi için randevu almayı veya WhatsApp'tan iletişime geçmeyi öner
7. Yanıtlarını kısa ve öz tut (maksimum 2-3 paragraf)`,
  welcomeMessage: "Merhaba! Ben Volkan Terapi Asistanı. Size terapi hizmetlerimiz, çocuk gelişimi veya randevu konularında yardımcı olabilirim. Nasıl yardımcı olabilirim?",
  maxMessagesPerSession: 20,
  temperature: 0.7,
  enableNotifications: true,
  notificationMinMessages: 2
};

export const DEFAULT_SITE_INFO: SiteInfoSettings = {
  siteName: "Volkan Özcihan",
  title: "Uzman Fizyoterapist",
  phone: "+90 532 286 25 21",
  email: "info@volkanozcihan.com",
  whatsapp: "905322862521",
  address: "Arıköy Sitesi, Üskümarköy, 34450 Sarıyer/İstanbul",
  addressNote: "Detaylı adres randevu sonrası paylaşılır",
  workingHoursWeekday: "Pzt-Cum: 09:00-18:00",
  workingHoursWeekend: "Cmt: 09:00-14:00",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d16974.427534054586!2d29.01057354420276!3d41.228673669754535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zYXLEsWvDtnkgc2l0ZXNp!5e0!3m2!1sen!2str!4v1768386063768!5m2!1sen!2str",
  socialLinks: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
    linkedin: "#"
  },
  poweredBy: {
    label: "Powered by Monelixa",
    url: "https://autosocial-ai.netlify.app/",
    logo: "/images/monelixa_powered.png"
  },
  timezoneOffset: "+03:00"
};

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  fromName: "Volkan Özcihan",
  fromEmail: "onboarding@resend.dev",
  replyTo: "socif@yahoo.com",
  notificationEmail: "socif@yahoo.com",
  useResendOverride: false,
  resendApiKeyEncrypted: null,
  enableBookingConfirmation: true,
  enableReminders: true,
  reminderOffsetsMinutes: [1440, 240],
  enableThankYou: true,
  thankYouOffsetMinutes: 120,
  templates: {
    confirmationSubject: "Randevunuz onaylandı",
    confirmationBody:
      "Merhaba {{name}}, randevunuz alındı. Tarih: {{date}}, Saat: {{time}}, Hizmet: {{service}}.",
    reminderSubject: "Randevu hatırlatma",
    reminderBody:
      "Merhaba {{name}}, randevunuz yaklaşıyor. Tarih: {{date}}, Saat: {{time}}, Hizmet: {{service}}.",
    thankYouSubject: "Teşekkür ederiz",
    thankYouBody:
      "Merhaba {{name}}, ziyaretiniz için teşekkür ederiz. Geri bildiriminizi bekleriz."
  }
};

export const DEFAULT_BACKUP_SETTINGS: BackupSettings = {
  frequency: "weekly",
  time: "02:00",
  dayOfWeek: 1,
  dayOfMonth: 1,
  lastRunAt: null
};
