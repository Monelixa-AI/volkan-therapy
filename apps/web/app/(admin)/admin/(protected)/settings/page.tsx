import { prisma } from "@/lib/db";
import { getBackupSettings, getEmailSettings, getSiteInfo } from "@/lib/site-settings";
import { AdminSettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const [siteInfo, emailSettings, backupSettings, backupRecords] = await Promise.all([
    getSiteInfo(),
    getEmailSettings(),
    getBackupSettings(),
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
      initialBackups={backups}
    />
  );
}
