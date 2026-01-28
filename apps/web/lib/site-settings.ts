import { getSetting, setSetting } from "@/lib/settings";
import {
  DEFAULT_SITE_INFO,
  DEFAULT_EMAIL_SETTINGS,
  DEFAULT_BACKUP_SETTINGS,
  DEFAULT_CHATBOT_SETTINGS,
  type SiteInfoSettings,
  type EmailSettings,
  type BackupSettings,
  type ChatbotSettings
} from "@/lib/settings-defaults";

export async function getSiteInfo() {
  return getSetting<SiteInfoSettings>("site_info", DEFAULT_SITE_INFO);
}

export async function setSiteInfo(value: SiteInfoSettings) {
  await setSetting("site_info", value);
}

export async function getEmailSettings() {
  return getSetting<EmailSettings>("email_settings", DEFAULT_EMAIL_SETTINGS);
}

export async function setEmailSettings(value: EmailSettings) {
  await setSetting("email_settings", value);
}

export async function getBackupSettings() {
  return getSetting<BackupSettings>("backup_settings", DEFAULT_BACKUP_SETTINGS);
}

export async function setBackupSettings(value: BackupSettings) {
  await setSetting("backup_settings", value);
}

export async function getChatbotSettings() {
  return getSetting<ChatbotSettings>("chatbot_settings", DEFAULT_CHATBOT_SETTINGS);
}

export async function setChatbotSettings(value: ChatbotSettings) {
  await setSetting("chatbot_settings", value);
}
