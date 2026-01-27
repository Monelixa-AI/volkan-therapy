import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  sendBookingReminderEmail,
  sendBookingThankYouEmail
} from "@/lib/email";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return true;
  }
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const reminders = await prisma.bookingReminder.findMany({
    where: {
      status: "PENDING",
      sendAt: { lte: now }
    },
    include: {
      booking: {
        include: {
          user: true,
          service: true
        }
      }
    },
    take: 50
  });

  for (const reminder of reminders) {
    const booking = reminder.booking;
    const email = booking.user.email;
    if (!email) {
      await prisma.bookingReminder.update({
        where: { id: reminder.id },
        data: {
          status: "FAILED",
          errorMessage: "Missing user email"
        }
      });
      continue;
    }

    const date = booking.date.toISOString().slice(0, 10);
    const data = {
      to: email,
      name: booking.user.name || "Danisan",
      date,
      time: booking.startTime,
      service: booking.service.title
    };

    try {
      let result = { success: false };
      if (reminder.reminderType === "REMINDER") {
        result = await sendBookingReminderEmail(data);
      }
      if (reminder.reminderType === "THANK_YOU") {
        result = await sendBookingThankYouEmail(data);
      }

      await prisma.bookingReminder.update({
        where: { id: reminder.id },
        data: {
          status: result.success ? "SENT" : "SKIPPED",
          sentAt: result.success ? new Date() : null
        }
      });
    } catch (error: any) {
      await prisma.bookingReminder.update({
        where: { id: reminder.id },
        data: {
          status: "FAILED",
          errorMessage: error?.message || "Send failed"
        }
      });
    }
  }

  return NextResponse.json({ success: true, processed: reminders.length });
}

export async function POST(request: Request) {
  return handle(request);
}

export async function GET(request: Request) {
  return handle(request);
}
