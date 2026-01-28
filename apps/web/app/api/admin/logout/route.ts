import { NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  await destroyAdminSession();

  // 303 See Other - forces GET request after redirect
  const baseUrl = new URL(request.url).origin;
  return NextResponse.redirect(new URL("/", baseUrl), { status: 303 });
}
