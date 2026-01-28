import { prisma } from "@/lib/db";
import { getBackupSettings, getChatbotSettings, getEmailSettings, getSiteInfo } from "@/lib/site-settings";
import { AdminSettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const [siteInfo, emailSettings, backupSettings, chatbotSettings, backupRecords] = await Promise.all([
    getSiteInfo(),
    getEmailSettings(),
    getBackupSettings(),
    getChatbotSettings(),
    prisma.backupExport.findMany({
      orderBy: { createdAt: "desc" },
      take: 15
    })
  ]);
  const backups = backupRecords.map((record) => ({
    id: record.id,
    status: record.status,
    fileUrl: record.fileUrl,
    createdAt: record.createdAt.toISOString()
  }));

  return (
    <AdminSettingsForm
      initialSiteInfo={siteInfo}
      initialEmailSettings={emailSettings}
      initialBackupSettings={backupSettings}
      initialChatbotSettings={chatbotSettings}
      initialBackups={backups}
    />
  );
}
