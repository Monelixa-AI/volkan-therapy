import { NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/admin-auth";

export async function POST() {
  await destroyAdminSession();
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "https://volkan-therapy-web.vercel.app"));
}
