import { NextResponse } from "next/server";
import { getServiceOptions } from "@/lib/services";

export async function GET() {
  const services = await getServiceOptions();
  return NextResponse.json({ services });
}
