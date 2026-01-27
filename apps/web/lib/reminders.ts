import { prisma } from "@/lib/db";
import { getEmailSettings, getSiteInfo } from "@/lib/site-settings";
import type { Booking } from "@prisma/client";
import { ReminderType } from "@prisma/client";

function buildDateTime(date: Date, time: string, offset: string) {
  const day = date.toISOString().slice(0, 10);
  return new Date(`${day}T${time}:00${offset}`);
}

export async function scheduleBookingReminders(booking: Booking) {
  const [settings, siteInfo] = await Promise.all([
    getEmailSettings(),
    getSiteInfo()
  ]);

  const appointmentStart = buildDateTime(
    booking.date,
    booking.startTime,
    siteInfo.timezoneOffset
  );
  const appointmentEnd = buildDateTime(
    booking.date,
    booking.endTime,
    siteInfo.timezoneOffset
  );

  const now = Date.now();
  const reminders = [];

  if (settings.enableReminders) {
    for (const offset of settings.reminderOffsetsMinutes) {
      const sendAt = new Date(appointmentStart.getTime() - offset * 60 * 1000);
      if (sendAt.getTime() > now) {
        reminders.push({
          bookingId: booking.id,
          reminderType: ReminderType.REMINDER,
          offsetMinutes: offset,
          sendAt
        });
      }
    }
  }

  if (settings.enableThankYou) {
    const sendAt = new Date(
      appointmentEnd.getTime() + settings.thankYouOffsetMinutes * 60 * 1000
    );
    if (sendAt.getTime() > now) {
      reminders.push({
        bookingId: booking.id,
        reminderType: ReminderType.THANK_YOU,
        offsetMinutes: settings.thankYouOffsetMinutes,
        sendAt
      });
    }
  }

  if (reminders.length === 0) {
    return [];
  }

  return prisma.bookingReminder.createMany({
    data: reminders
  });
}
