import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminFromSession } from "@/lib/admin-auth";
import { encryptSecret } from "@/lib/encryption";
import {
  getBackupSettings,
  getChatbotSettings,
  getEmailSettings,
  getSiteInfo,
  setBackupSettings,
  setChatbotSettings,
  setEmailSettings,
  setSiteInfo
} from "@/lib/site-settings";

const siteInfoSchema = z.object({
  siteName: z.string().min(1),
  title: z.string().min(1),
  phone: z.string().min(3),
  email: z.string().email(),
  whatsapp: z.string().min(6),
  address: z.string().min(3),
  addressNote: z.string(),
  workingHoursWeekday: z.string().min(3),
  workingHoursWeekend: z.string().min(3),
  mapEmbedUrl: z.string().min(3),
  socialLinks: z.object({
    facebook: z.string(),
    instagram: z.string(),
    youtube: z.string(),
    linkedin: z.string()
  }),
  poweredBy: z.object({
    label: z.string(),
    url: z.string(),
    logo: z.string()
  }),
  timezoneOffset: z.string().min(3)
});

const emailSettingsSchema = z.object({
  fromName: z.string().min(1),
  fromEmail: z.string().email(),
  replyTo: z.string().email(),
  notificationEmail: z.string().email(),
  useResendOverride: z.boolean(),
  resendApiKeyEncrypted: z.string().nullable(),
  resendApiKeyPlain: z.string().optional(),
  enableBookingConfirmation: z.boolean(),
  enableReminders: z.boolean(),
  reminderOffsetsMinutes: z.array(z.number().int().min(10)),
  enableThankYou: z.boolean(),
  thankYouOffsetMinutes: z.number().int().min(10),
  templates: z.object({
    confirmationSubject: z.string().min(1),
    confirmationBody: z.string().min(1),
    reminderSubject: z.string().min(1),
    reminderBody: z.string().min(1),
    thankYouSubject: z.string().min(1),
    thankYouBody: z.string().min(1)
  })
});

const backupSettingsSchema = z.object({
  frequency: z.enum(["manual", "daily", "weekly", "monthly"]),
  time: z.string().min(3),
  dayOfWeek: z.number().int().min(0).max(6),
  dayOfMonth: z.number().int().min(1).max(28),
  lastRunAt: z.string().nullable()
});

const chatbotSettingsSchema = z.object({
  enabled: z.boolean(),
  model: z.string().min(1),
  systemPrompt: z.string().min(1),
  welcomeMessage: z.string().min(1),
  maxMessagesPerSession: z.number().int().min(1).max(100),
  temperature: z.number().min(0).max(2),
  enableNotifications: z.boolean(),
  notificationMinMessages: z.number().int().min(1).max(50)
});

export async function GET() {
  const admin = await getAdminFromSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [siteInfo, emailSettings, backupSettings, chatbotSettings] = await Promise.all([
    getSiteInfo(),
    getEmailSettings(),
    getBackupSettings(),
    getChatbotSettings()
  ]);
  return NextResponse.json({ siteInfo, emailSettings, backupSettings, chatbotSettings });
}

export async function PUT(request: Request) {
  const admin = await getAdminFromSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const siteInfo = siteInfoSchema.parse(payload.siteInfo);
    const emailSettingsInput = emailSettingsSchema.parse(payload.emailSettings);
    const backupSettings = backupSettingsSchema.parse(payload.backupSettings);
    const chatbotSettings = chatbotSettingsSchema.parse(payload.chatbotSettings);

    let resendApiKeyEncrypted = emailSettingsInput.resendApiKeyEncrypted;
    if (emailSettingsInput.resendApiKeyPlain) {
      resendApiKeyEncrypted = encryptSecret(emailSettingsInput.resendApiKeyPlain);
    }

    await Promise.all([
      setSiteInfo(siteInfo),
      setEmailSettings({
        ...emailSettingsInput,
        resendApiKeyEncrypted
      }),
      setBackupSettings(backupSettings),
      setChatbotSettings(chatbotSettings)
    ]);

    revalidatePath("/admin/settings");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Settings save error:", error);
    return NextResponse.json({ error: "Kaydedilemedi." }, { status: 500 });
  }
}
