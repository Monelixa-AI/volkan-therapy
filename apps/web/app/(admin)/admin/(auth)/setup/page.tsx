import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAdminFromSession } from "@/lib/admin-auth";
import { AdminSetupForm } from "./setup-form";

export default async function AdminSetupPage() {
  const admin = await getAdminFromSession();
  if (admin) {
    redirect("/admin");
  }
  const adminCount = await prisma.adminUser.count();
  if (adminCount > 0) {
    redirect("/admin/login");
  }
  return <AdminSetupForm />;
}
