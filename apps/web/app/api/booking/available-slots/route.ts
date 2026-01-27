import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addDays, format } from "date-fns";

const WORK_HOURS = {
  weekday: { start: 9, end: 18 },
  saturday: { start: 9, end: 14 }
};


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  if (!dateStr) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 0) {
    return NextResponse.json({ slots: [], message: "Pazar günü kapalıyız" });
  }

  const hours = dayOfWeek === 6 ? WORK_HOURS.saturday : WORK_HOURS.weekday;

  const existingBookings = await prisma.booking.findMany({
    where: {
      date: {
        gte: new Date(format(date, "yyyy-MM-dd")),
        lt: addDays(new Date(format(date, "yyyy-MM-dd")), 1)
      },
      status: {
        in: ["PENDING", "CONFIRMED"]
      }
    },
    select: {
      startTime: true,
      endTime: true
    }
  });

  const service = serviceId
    ? await prisma.service.findUnique({
        where: { id: serviceId },
        select: { duration: true }
      })
    : null;

  const durationMinutes = service?.duration ?? 60;

  const toMinutes = (time: string) => {
    const [hour, minute] = time.split(":").map((value) => Number(value));
    return hour * 60 + minute;
  };

  const toTimeString = (totalMinutes: number) => {
    const hoursValue = Math.floor(totalMinutes / 60);
    const minutesValue = totalMinutes % 60;
    return `${hoursValue.toString().padStart(2, "0")}:${minutesValue
      .toString()
      .padStart(2, "0")}`;
  };

  const availableSlots = [] as Array<{
    time: string;
    displayTime: string;
    available: boolean;
  }>;

  for (let hour = hours.start; hour < hours.end; hour++) {
    const slotStartMinutes = hour * 60;
    const slotEndMinutes = slotStartMinutes + durationMinutes;
    if (slotEndMinutes > hours.end * 60) {
      continue;
    }
    const hasConflict = existingBookings.some((booking) => {
      const bookingStart = toMinutes(booking.startTime);
      const bookingEnd = toMinutes(booking.endTime);
      return slotStartMinutes < bookingEnd && slotEndMinutes > bookingStart;
    });
    if (hasConflict) {
      continue;
    }
    const timeStr = toTimeString(slotStartMinutes);
    const endTimeStr = toTimeString(slotEndMinutes);
    availableSlots.push({
      time: timeStr,
      displayTime: `${timeStr} - ${endTimeStr}`,
      available: true
    });
  }

  return NextResponse.json({ slots: availableSlots });
}
