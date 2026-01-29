"use client";

import { useMemo, useState } from "react";
import type {
  BackupSettings,
  ChatbotSettings,
  EmailSettings,
  SiteInfoSettings
} from "@/lib/settings-defaults";

type BackupExportItem = {
  id: string;
  status: string;
  fileUrl?: string | null;
  createdAt: string;
};

type AdminSettingsFormProps = {
  initialSiteInfo: SiteInfoSettings;
  initialEmailSettings: EmailSettings;
  initialBackupSettings: BackupSettings;
  initialChatbotSettings: ChatbotSettings;
  initialBackups: BackupExportItem[];
};

const dayOfWeekOptions = [
  { value: 0, label: "Pazar" },
  { value: 1, label: "Pazartesi" },
  { value: 2, label: "Sali" },
  { value: 3, label: "Carsamba" },
  { value: 4, label: "Persembe" },
  { value: 5, label: "Cuma" },
  { value: 6, label: "Cumartesi" }
];

export function AdminSettingsForm({
  initialSiteInfo,
  initialEmailSettings,
  initialBackupSettings,
  initialChatbotSettings,
  initialBackups
}: AdminSettingsFormProps) {
  const [siteInfo, setSiteInfo] = useState<SiteInfoSettings>(initialSiteInfo);
  const [emailSettings, setEmailSettings] =
    useState<EmailSettings>(initialEmailSettings);
  const [backupSettings, setBackupSettings] =
    useState<BackupSettings>(initialBackupSettings);
  const [chatbotSettings, setChatbotSettings] =
    useState<ChatbotSettings>(initialChatbotSettings);
  const [backups, setBackups] = useState(initialBackups);
  const [resendKeyInput, setResendKeyInput] = useState("");
  const [reminderOffsets, setReminderOffsets] = useState(
    initialEmailSettings.reminderOffsetsMinutes.map((v) => v / 60).join(", ")
  );
  const [thankYouHours, setThankYouHours] = useState(
    String(initialEmailSettings.thankYouOffsetMinutes / 60)
  );
  const [testEmailTo, setTestEmailTo] = useState(
    initialEmailSettings.notificationEmail
  );
  const [testEmailMessage, setTestEmailMessage] = useState(
    "Test e-postasi basariyla gonderildi."
  );
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const reminderOffsetsMinutes = useMemo(() => {
    return reminderOffsets
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value) && value > 0)
      .map((value) => Math.round(value * 60));
  }, [reminderOffsets]);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      const parsedThankYouHours = Number(thankYouHours);
      const thankYouMinutes = Number.isFinite(parsedThankYouHours)
        ? Math.round(parsedThankYouHours * 60)
        : emailSettings.thankYouOffsetMinutes;
      const offsetsToSave =
        reminderOffsetsMinutes.length > 0
          ? reminderOffsetsMinutes
          : emailSettings.reminderOffsetsMinutes;
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteInfo,
          emailSettings: {
            ...emailSettings,
            resendApiKeyPlain: resendKeyInput || undefined,
            reminderOffsetsMinutes: offsetsToSave,
            thankYouOffsetMinutes: thankYouMinutes
          },
          backupSettings,
          chatbotSettings
        })
      });
      if (!res.ok) {
        const data = await res.json();
        const msg = Array.isArray(data.error)
          ? data.error.map((e: any) => `${e.path?.join(".")}: ${e.message}`).join(", ")
          : data.error || "Kaydedilemedi.";
        throw new Error(msg);
      }
      setResendKeyInput("");
      setStatus("Kaydedildi.");
    } catch (error: any) {
      setStatus(`Hata: ${error.message || "Kaydedilemedi."}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      const res = await fetch("/api/admin/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmailTo, message: testEmailMessage })
      });
      if (!res.ok) {
        throw new Error("Test e-postasi gonderilemedi.");
      }
      setStatus("Test e-postasi gonderildi.");
    } catch (error: any) {
      setStatus(error.message || "Test e-postasi gonderilemedi.");
    }
  };

  const handleBackup = async () => {
    try {
      const res = await fetch("/api/admin/backups", { method: "POST" });
      if (!res.ok) {
        throw new Error("Yedek olusturulamadi.");
      }
      const data = await res.json();
      setBackups((prev) => [data.export, ...prev]);
      setStatus("Yedek olusturuldu.");
    } catch (error: any) {
      setStatus(error.message || "Yedek olusturulamadi.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Ayarlar</h1>
        <p className="text-sm text-slate-500">
          Site bilgileri, e-posta otomasyonlari ve yedeklemeleri buradan yonetin.
        </p>
      </div>

      {status && (
        <p className={`text-sm font-medium ${status.startsWith("Hata") ? "text-red-600" : "text-green-600"}`}>
          {status}
        </p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Site Bilgileri</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Site Adi</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.siteName}
              onChange={(event) =>
                setSiteInfo({ ...siteInfo, siteName: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Unvan</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.title}
              onChange={(event) =>
                setSiteInfo({ ...siteInfo, title: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Telefon</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.phone}
              onChange={(event) =>
                setSiteInfo({ ...siteInfo, phone: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">E-posta</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.email}
              onChange={(event) =>
                setSiteInfo({ ...siteInfo, email: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">WhatsApp</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.whatsapp}
              onChange={(event) =>
                setSiteInfo({ ...siteInfo, whatsapp: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Zaman Dilimi Ofseti</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.timezoneOffset}
              onChange={(event) =>
                setSiteInfo({ ...siteInfo, timezoneOffset: event.target.value })
              }
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Adres</span>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.address}
              onChange={(event) =>
                setSiteInfo({ ...siteInfo, address: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Adres Notu</span>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.addressNote}
              onChange={(event) =>
                setSiteInfo({ ...siteInfo, addressNote: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Hafta ici saatler</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.workingHoursWeekday}
              onChange={(event) =>
                setSiteInfo({ ...siteInfo, workingHoursWeekday: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Hafta sonu saatler</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.workingHoursWeekend}
              onChange={(event) =>
                setSiteInfo({ ...siteInfo, workingHoursWeekend: event.target.value })
              }
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="block text-slate-600 mb-1">Harita URL</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.mapEmbedUrl}
              onChange={(event) =>
                setSiteInfo({ ...siteInfo, mapEmbedUrl: event.target.value })
              }
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Facebook</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.socialLinks.facebook}
              onChange={(event) =>
                setSiteInfo({
                  ...siteInfo,
                  socialLinks: { ...siteInfo.socialLinks, facebook: event.target.value }
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Instagram</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.socialLinks.instagram}
              onChange={(event) =>
                setSiteInfo({
                  ...siteInfo,
                  socialLinks: { ...siteInfo.socialLinks, instagram: event.target.value }
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">YouTube</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.socialLinks.youtube}
              onChange={(event) =>
                setSiteInfo({
                  ...siteInfo,
                  socialLinks: { ...siteInfo.socialLinks, youtube: event.target.value }
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">LinkedIn</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.socialLinks.linkedin}
              onChange={(event) =>
                setSiteInfo({
                  ...siteInfo,
                  socialLinks: { ...siteInfo.socialLinks, linkedin: event.target.value }
                })
              }
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Powered By Etiket</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.poweredBy.label}
              onChange={(event) =>
                setSiteInfo({
                  ...siteInfo,
                  poweredBy: { ...siteInfo.poweredBy, label: event.target.value }
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Powered By URL</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.poweredBy.url}
              onChange={(event) =>
                setSiteInfo({
                  ...siteInfo,
                  poweredBy: { ...siteInfo.poweredBy, url: event.target.value }
                })
              }
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="block text-slate-600 mb-1">Powered By Logo</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={siteInfo.poweredBy.logo}
              onChange={(event) =>
                setSiteInfo({
                  ...siteInfo,
                  poweredBy: { ...siteInfo.poweredBy, logo: event.target.value }
                })
              }
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">E-posta</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Gonderen Adi</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={emailSettings.fromName}
              onChange={(event) =>
                setEmailSettings({ ...emailSettings, fromName: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Gonderen E-posta</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={emailSettings.fromEmail}
              onChange={(event) =>
                setEmailSettings({ ...emailSettings, fromEmail: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Yanita E-posta</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={emailSettings.replyTo}
              onChange={(event) =>
                setEmailSettings({ ...emailSettings, replyTo: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Bildirim E-posta</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={emailSettings.notificationEmail}
              onChange={(event) =>
                setEmailSettings({
                  ...emailSettings,
                  notificationEmail: event.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Resend Anahtari</span>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={resendKeyInput}
              onChange={(event) => setResendKeyInput(event.target.value)}
              placeholder="Opsiyonel"
            />
          </label>
          <label className="text-sm flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={emailSettings.useResendOverride}
              onChange={(event) =>
                setEmailSettings({
                  ...emailSettings,
                  useResendOverride: event.target.checked
                })
              }
            />
            <span className="text-slate-600">Paneldeki Resend anahtarini kullan</span>
          </label>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Hatirlatma Saatleri (saat)</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={reminderOffsets}
              onChange={(event) => setReminderOffsets(event.target.value)}
              placeholder="24, 4"
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Tesekkur Gecikmesi (saat)</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={thankYouHours}
              onChange={(event) => setThankYouHours(event.target.value)}
            />
          </label>
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={emailSettings.enableBookingConfirmation}
              onChange={(event) =>
                setEmailSettings({
                  ...emailSettings,
                  enableBookingConfirmation: event.target.checked
                })
              }
            />
            <span className="text-slate-600">Onay e-postasi gonder</span>
          </label>
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={emailSettings.enableReminders}
              onChange={(event) =>
                setEmailSettings({
                  ...emailSettings,
                  enableReminders: event.target.checked
                })
              }
            />
            <span className="text-slate-600">Hatirlatmalari gonder</span>
          </label>
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={emailSettings.enableThankYou}
              onChange={(event) =>
                setEmailSettings({
                  ...emailSettings,
                  enableThankYou: event.target.checked
                })
              }
            />
            <span className="text-slate-600">Tesekkur e-postasi gonder</span>
          </label>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Onay Konu</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={emailSettings.templates.confirmationSubject}
              onChange={(event) =>
                setEmailSettings({
                  ...emailSettings,
                  templates: {
                    ...emailSettings.templates,
                    confirmationSubject: event.target.value
                  }
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Onay Mesaji</span>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={emailSettings.templates.confirmationBody}
              onChange={(event) =>
                setEmailSettings({
                  ...emailSettings,
                  templates: {
                    ...emailSettings.templates,
                    confirmationBody: event.target.value
                  }
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Hatirlatma Konu</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={emailSettings.templates.reminderSubject}
              onChange={(event) =>
                setEmailSettings({
                  ...emailSettings,
                  templates: {
                    ...emailSettings.templates,
                    reminderSubject: event.target.value
                  }
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Hatirlatma Mesaji</span>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={emailSettings.templates.reminderBody}
              onChange={(event) =>
                setEmailSettings({
                  ...emailSettings,
                  templates: {
                    ...emailSettings.templates,
                    reminderBody: event.target.value
                  }
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Tesekkur Konu</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={emailSettings.templates.thankYouSubject}
              onChange={(event) =>
                setEmailSettings({
                  ...emailSettings,
                  templates: {
                    ...emailSettings.templates,
                    thankYouSubject: event.target.value
                  }
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Tesekkur Mesaji</span>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={emailSettings.templates.thankYouBody}
              onChange={(event) =>
                setEmailSettings({
                  ...emailSettings,
                  templates: {
                    ...emailSettings.templates,
                    thankYouBody: event.target.value
                  }
                })
              }
            />
          </label>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {"Değişkenler: {{name}}, {{date}}, {{time}}, {{service}}"}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 items-end">
          <label className="text-sm flex-1">
            <span className="block text-slate-600 mb-1">Test Alici</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={testEmailTo}
              onChange={(event) => setTestEmailTo(event.target.value)}
            />
          </label>
          <label className="text-sm flex-[2]">
            <span className="block text-slate-600 mb-1">Test Mesaj</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={testEmailMessage}
              onChange={(event) => setTestEmailMessage(event.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={handleTestEmail}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-primary-500"
          >
            Test Gonder
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Yedekleme</h2>
          <button
            type="button"
            onClick={handleBackup}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-primary-500"
          >
            Yedek Olustur
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Periyot</span>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={backupSettings.frequency}
              onChange={(event) =>
                setBackupSettings({ ...backupSettings, frequency: event.target.value as BackupSettings["frequency"] })
              }
            >
              <option value="manual">Manuel</option>
              <option value="daily">Gunluk</option>
              <option value="weekly">Haftalik</option>
              <option value="monthly">Aylik</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Saat</span>
            <input
              type="time"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={backupSettings.time}
              onChange={(event) =>
                setBackupSettings({ ...backupSettings, time: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Haftanin Gunu</span>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={backupSettings.dayOfWeek}
              onChange={(event) =>
                setBackupSettings({
                  ...backupSettings,
                  dayOfWeek: Number(event.target.value)
                })
              }
            >
              {dayOfWeekOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Ay Gunu</span>
            <input
              type="number"
              min={1}
              max={28}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={backupSettings.dayOfMonth}
              onChange={(event) =>
                setBackupSettings({
                  ...backupSettings,
                  dayOfMonth: Number(event.target.value)
                })
              }
            />
          </label>
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          {backups.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span>
                {new Date(item.createdAt).toLocaleString("tr-TR")} - {item.status}
              </span>
              {item.fileUrl && (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  Indir
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">AI Chatbot</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={chatbotSettings.enabled}
              onChange={(event) =>
                setChatbotSettings({ ...chatbotSettings, enabled: event.target.checked })
              }
            />
            <span className="text-slate-600">Chatbot Aktif</span>
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Model</span>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={chatbotSettings.model}
              onChange={(event) =>
                setChatbotSettings({ ...chatbotSettings, model: event.target.value })
              }
            >
              <optgroup label="Ücretsiz Modeller">
                <option value="deepseek/deepseek-r1-0528:free">DeepSeek R1 (Free)</option>
                <option value="google/gemini-2.5-flash-preview:free">Gemini 2.5 Flash (Free)</option>
                <option value="meta-llama/llama-4-maverick:free">Llama 4 Maverick (Free)</option>
                <option value="google/gemma-3-27b-it:free">Gemma 3 27B (Free)</option>
                <option value="microsoft/phi-4-reasoning-plus:free">Phi-4 Reasoning (Free)</option>
                <option value="qwen/qwen3-235b-a22b:free">Qwen 3 235B (Free)</option>
              </optgroup>
              <optgroup label="Ücretli Modeller">
                <option value="anthropic/claude-sonnet-4">Claude Sonnet 4 (Ücretli)</option>
                <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (Ücretli)</option>
                <option value="openai/gpt-4o">GPT-4o (Ücretli)</option>
                <option value="openai/gpt-4o-mini">GPT-4o Mini (Ücretli)</option>
                <option value="google/gemini-2.5-pro-preview">Gemini 2.5 Pro (Ücretli)</option>
                <option value="google/gemini-2.5-flash-preview">Gemini 2.5 Flash (Ücretli)</option>
                <option value="deepseek/deepseek-r1">DeepSeek R1 (Ücretli)</option>
                <option value="meta-llama/llama-4-maverick">Llama 4 Maverick (Ücretli)</option>
              </optgroup>
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Maks. Mesaj Sayisi</span>
            <input
              type="number"
              min={1}
              max={100}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={chatbotSettings.maxMessagesPerSession}
              onChange={(event) =>
                setChatbotSettings({
                  ...chatbotSettings,
                  maxMessagesPerSession: Number(event.target.value)
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Sicaklik (0-2)</span>
            <input
              type="number"
              min={0}
              max={2}
              step={0.1}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={chatbotSettings.temperature}
              onChange={(event) =>
                setChatbotSettings({
                  ...chatbotSettings,
                  temperature: Number(event.target.value)
                })
              }
            />
          </label>
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={chatbotSettings.enableNotifications}
              onChange={(event) =>
                setChatbotSettings({ ...chatbotSettings, enableNotifications: event.target.checked })
              }
            />
            <span className="text-slate-600">Chat bildirimleri gönder (e-posta)</span>
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Min. mesaj (bildirim icin)</span>
            <input
              type="number"
              min={1}
              max={50}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={chatbotSettings.notificationMinMessages}
              onChange={(event) =>
                setChatbotSettings({
                  ...chatbotSettings,
                  notificationMinMessages: Number(event.target.value)
                })
              }
            />
          </label>
        </div>
        <div className="mt-4">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Karsilama Mesaji</span>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              rows={2}
              value={chatbotSettings.welcomeMessage}
              onChange={(event) =>
                setChatbotSettings({ ...chatbotSettings, welcomeMessage: event.target.value })
              }
            />
          </label>
        </div>
        <div className="mt-4">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Sistem Promptu (AI Davranis Talimatlari)</span>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs"
              rows={12}
              value={chatbotSettings.systemPrompt}
              onChange={(event) =>
                setChatbotSettings({ ...chatbotSettings, systemPrompt: event.target.value })
              }
            />
          </label>
          <p className="mt-1 text-xs text-slate-500">
            AI&apos;nin nasil davranacagini, hangi konularda yanit verecegini ve hangi bilgileri kullanacagini burada belirleyin.
          </p>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg bg-primary-500 text-white px-6 py-2 text-sm font-medium disabled:opacity-60"
        >
          {isSaving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
}

