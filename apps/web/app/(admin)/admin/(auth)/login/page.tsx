import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAdminFromSession } from "@/lib/admin-auth";
import { AdminLoginForm } from "./admin-login-form";

export default async function AdminLoginPage() {
  const admin = await getAdminFromSession();
  if (admin) {
    redirect("/admin");
  }
  const adminCount = await prisma.adminUser.count();
  if (adminCount === 0) {
    redirect("/admin/setup");
  }
  return <AdminLoginForm />;
}
