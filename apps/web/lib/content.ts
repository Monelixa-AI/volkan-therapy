import { prisma } from "@/lib/db";
import {
  DEFAULT_HOME_CONTENT,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_BOOKING_CONTENT,
  DEFAULT_ASSESSMENT_CONTENT,
  DEFAULT_THERAPY_CONTENT,
  DEFAULT_CONTACT_CONTENT,
  DEFAULT_SERVICES_PAGE_CONTENT,
  DEFAULT_BLOG_CONTENT,
  type HomeContent,
  type AboutContent,
  type BookingContent,
  type AssessmentContent,
  type TherapyContent,
  type ContactContent,
  type ServicesPageContent,
  type BlogContent
} from "@/lib/content-defaults";

export async function getContentEntry<T>(key: string, fallback: T): Promise<T> {
  try {
    const entry = await prisma.contentEntry.findUnique({ where: { key } });
    if (!entry) {
      return fallback;
    }
    return mergeDeep(fallback, entry.data);
  } catch (error) {
    console.warn(`Content load failed: ${key}`, error);
    return fallback;
  }
}

function mergeDeep<T>(fallback: T, value: unknown): T {
  if (Array.isArray(fallback)) {
    return (Array.isArray(value) ? value : fallback) as T;
  }

  if (fallback && typeof fallback === "object") {
    const base = fallback as Record<string, unknown>;
    const incoming =
      value && typeof value === "object" ? (value as Record<string, unknown>) : {};
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(base)) {
      if (key in incoming) {
        result[key] = mergeDeep(base[key], incoming[key]);
      } else {
        result[key] = base[key];
      }
    }

    for (const key of Object.keys(incoming)) {
      if (!(key in result)) {
        result[key] = incoming[key];
      }
    }

    return result as T;
  }

  return (value === undefined ? fallback : value) as T;
}

export async function getHomeContent() {
  return getContentEntry<HomeContent>("home", DEFAULT_HOME_CONTENT);
}

export async function getAboutContent() {
  return getContentEntry<AboutContent>("about", DEFAULT_ABOUT_CONTENT);
}

export async function getBookingContent() {
  return getContentEntry<BookingContent>("booking", DEFAULT_BOOKING_CONTENT);
}

export async function getAssessmentContent() {
  return getContentEntry<AssessmentContent>("assessment", DEFAULT_ASSESSMENT_CONTENT);
}

export async function getTherapyContent() {
  return getContentEntry<TherapyContent>("therapy", DEFAULT_THERAPY_CONTENT);
}

export async function getContactContent() {
  return getContentEntry<ContactContent>("contact", DEFAULT_CONTACT_CONTENT);
}

export async function getServicesPageContent() {
  return getContentEntry<ServicesPageContent>(
    "services-page",
    DEFAULT_SERVICES_PAGE_CONTENT
  );
}

export async function getBlogContent() {
  return getContentEntry<BlogContent>("blog", DEFAULT_BLOG_CONTENT);
}
