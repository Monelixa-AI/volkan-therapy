import { notFound } from "next/navigation";
import ContentEditor from "../editor";
import {
  getHomeContent,
  getAboutContent,
  getServicesPageContent,
  getBookingContent,
  getAssessmentContent,
  getTherapyContent,
  getContactContent,
  getBlogContent
} from "@/lib/content";

type ContentKey =
  | "home"
  | "about"
  | "services-page"
  | "booking"
  | "assessment"
  | "therapy"
  | "contact"
  | "blog";

const CONTENT_CONFIG: Record<
  ContentKey,
  { title: string; loader: () => Promise<unknown> }
> = {
  home: { title: "Ana Sayfa", loader: getHomeContent },
  about: { title: "Hakkımda", loader: getAboutContent },
  "services-page": { title: "Hizmetler Sayfası", loader: getServicesPageContent },
  booking: { title: "Randevu", loader: getBookingContent },
  assessment: { title: "Değerlendirme", loader: getAssessmentContent },
  therapy: { title: "Terapi Süreci", loader: getTherapyContent },
  contact: { title: "İletişim", loader: getContactContent },
  blog: { title: "Blog", loader: getBlogContent }
};

type Props = {
  params: { key: string };
};

export default async function AdminContentEditorPage({ params }: Props) {
  const key = params.key as ContentKey;
  const config = CONTENT_CONFIG[key];

  if (!config) {
    notFound();
  }

  const content = await config.loader();

  return (
    <ContentEditor contentKey={key} title={config.title} initialContent={content} />
  );
}
