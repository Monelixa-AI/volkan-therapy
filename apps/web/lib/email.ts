import { Resend } from "resend";
import { decryptSecret } from "@/lib/encryption";
import { getEmailSettings } from "@/lib/site-settings";

export type BookingConfirmationData = {
  to: string;
  name: string;
  date: string;
  time: string;
  service: string;
};

type EmailClient = {
  resend: Resend;
  from: string;
  replyTo?: string;
};

function renderTemplate(template: string, data: Record<string, string>) {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (match, key) => {
    return data[key] ?? match;
  });
}

async function getEmailClient(): Promise<EmailClient | null> {
  const settings = await getEmailSettings();
  const overrideKey = settings.useResendOverride
    ? settings.resendApiKeyEncrypted
    : null;
  let apiKey = process.env.RESEND_API_KEY;
  if (overrideKey) {
    try {
      apiKey = decryptSecret(overrideKey);
    } catch (error) {
      console.warn("Resend anahtari cozumlenemedi.");
    }
  }

  if (!apiKey) {
    console.warn("Missing RESEND_API_KEY.");
    return null;
  }

  const from = `${settings.fromName} <${settings.fromEmail}>`;
  return {
    resend: new Resend(apiKey),
    from,
    replyTo: settings.replyTo || undefined
  };
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  try {
    const client = await getEmailClient();
    const settings = await getEmailSettings();
    if (!client || !settings.enableBookingConfirmation) {
      return { success: false };
    }
    const subject = renderTemplate(settings.templates.confirmationSubject, {
      name: data.name,
      date: data.date,
      time: data.time,
      service: data.service
    });
    const body = renderTemplate(settings.templates.confirmationBody, {
      name: data.name,
      date: data.date,
      time: data.time,
      service: data.service
    });
    await client.resend.emails.send({
      from: client.from,
      to: data.to,
      reply_to: client.replyTo,
      subject,
      html: `<p>${body}</p>`
    });
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error };
  }
}

export async function sendContactFormNotification(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  try {
    const client = await getEmailClient();
    const settings = await getEmailSettings();
    if (!client) {
      return { success: false };
    }
    await client.resend.emails.send({
      from: client.from,
      to: settings.notificationEmail,
      reply_to: client.replyTo || data.email,
      subject: `Yeni iletisim formu: ${data.name}`,
      html: `
        <h2>Yeni iletisim formu mesaji</h2>
        <p><strong>Isim:</strong> ${data.name}</p>
        <p><strong>E-posta:</strong> ${data.email}</p>
        <p><strong>Telefon:</strong> ${data.phone || "Belirtilmedi"}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${data.message}</p>
      `
    });
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
}

export async function sendBookingReminderEmail(data: BookingConfirmationData) {
  try {
    const client = await getEmailClient();
    const settings = await getEmailSettings();
    if (!client || !settings.enableReminders) {
      return { success: false };
    }
    const subject = renderTemplate(settings.templates.reminderSubject, {
      name: data.name,
      date: data.date,
      time: data.time,
      service: data.service
    });
    const body = renderTemplate(settings.templates.reminderBody, {
      name: data.name,
      date: data.date,
      time: data.time,
      service: data.service
    });
    await client.resend.emails.send({
      from: client.from,
      to: data.to,
      reply_to: client.replyTo,
      subject,
      html: `<p>${body}</p>`
    });
    return { success: true };
  } catch (error) {
    console.error("Reminder email error:", error);
    return { success: false, error };
  }
}

export async function sendBookingThankYouEmail(data: BookingConfirmationData) {
  try {
    const client = await getEmailClient();
    const settings = await getEmailSettings();
    if (!client || !settings.enableThankYou) {
      return { success: false };
    }
    const subject = renderTemplate(settings.templates.thankYouSubject, {
      name: data.name,
      date: data.date,
      time: data.time,
      service: data.service
    });
    const body = renderTemplate(settings.templates.thankYouBody, {
      name: data.name,
      date: data.date,
      time: data.time,
      service: data.service
    });
    await client.resend.emails.send({
      from: client.from,
      to: data.to,
      reply_to: client.replyTo,
      subject,
      html: `<p>${body}</p>`
    });
    return { success: true };
  } catch (error) {
    console.error("Thank you email error:", error);
    return { success: false, error };
  }
}

export async function sendTestEmail(to: string, message: string) {
  try {
    const client = await getEmailClient();
    if (!client) {
      return { success: false };
    }
    await client.resend.emails.send({
      from: client.from,
      to,
      reply_to: client.replyTo,
      subject: "Test e-postasi",
      html: `<p>${message}</p>`
    });
    return { success: true };
  } catch (error) {
    console.error("Test email error:", error);
    return { success: false, error };
  }
}

export async function sendAdminPasswordResetEmail(to: string, resetUrl: string) {
  try {
    const client = await getEmailClient();
    if (!client) {
      return { success: false };
    }
    await client.resend.emails.send({
      from: client.from,
      to,
      reply_to: client.replyTo,
      subject: "Sifre sifirlama baglantisi",
      html: `
        <p>Sifrenizi sifirlamak icin asagidaki baglantiyi kullanin:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Bu baglanti 60 dakika boyunca gecerlidir.</p>
      `
    });
    return { success: true };
  } catch (error) {
    console.error("Admin reset email error:", error);
    return { success: false, error };
  }
}
