import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendBookingConfirmation } from "@/lib/email";
import { sendWhatsAppNotification } from "@/lib/whatsapp";
import { scheduleBookingReminders } from "@/lib/reminders";
import { z } from "zod";

const bookingSchema = z.object({
  serviceId: z.string(),
  date: z.string(),
  startTime: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  childName: z.string().optional(),
  childAge: z.string().optional(),
  notes: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId }
    });

    if (!service) {
      return NextResponse.json({ error: "Hizmet bulunamadi" }, { status: 400 });
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: new Date(data.date),
        startTime: data.startTime,
        status: { in: ["PENDING", "CONFIRMED"] }
      }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Bu saat dolu, lütfen başka bir saat seçin" },
        { status: 409 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          phone: data.phone
        }
      });
    }

    let childId: string | null = null;
    if (data.childName) {
      const child = await prisma.child.create({
        data: {
          name: data.childName,
          birthDate: new Date(),
          parentId: user.id
        }
      });
      childId = child.id;
    }

    const [startHour, startMinute] = data.startTime.split(":").map((value) => Number(value));
    const endMinutesTotal = startHour * 60 + startMinute + service.duration;
    const endHour = Math.floor(endMinutesTotal / 60);
    const endMinute = endMinutesTotal % 60;
    const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`;

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        childId,
        serviceId: data.serviceId,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime,
        status: "PENDING",
        notes: data.notes
      },
      include: {
        service: true
      }
    });

    await sendBookingConfirmation({
      to: data.email,
      name: data.name,
      date: data.date,
      time: data.startTime,
      service: booking.service.title
    });

    await scheduleBookingReminders(booking);

    await sendWhatsAppNotification({
      message: `Yeni randevu: ${data.name} - ${booking.service.title} - ${data.date} ${data.startTime}`
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        date: data.date,
        time: data.startTime,
        service: booking.service.title
      }
    });
  } catch (error) {
    console.error("Booking error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Randevu oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
