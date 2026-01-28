"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Image, Video, X, Copy } from "lucide-react";
import type {
  HomeContent,
  AboutContent,
  BookingContent,
  AssessmentContent,
  TherapyContent,
  ContactContent,
  BlogContent,
  ServicesPageContent
} from "@/lib/content-defaults";

type ContentEditorProps = {
  contentKey: string;
  title: string;
  initialContent: unknown;
};

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "media";
  placeholder?: string;
};

type SystemFile = {
  name: string;
  url: string;
  type: "image" | "video";
  size: number;
  folder: string;
};

type ListEditorProps = {
  label: string;
  items: Record<string, any>[];
  fields: FieldDef[];
  emptyItem: Record<string, any>;
  onChange: (items: Record<string, any>[]) => void;
};

const inputClasses =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";
const labelClasses = "text-xs font-medium text-slate-600";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className={labelClasses}>{label}</span>
      <input
        className={inputClasses}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className={labelClasses}>{label}</span>
      <input
        type="number"
        className={inputClasses}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value || 0))}
      />
    </label>
  );
}

function MediaField({
  label,
  value,
  onChange,
  mediaType = "all"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mediaType?: "image" | "video" | "all";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<SystemFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/media/files");
      const data = await res.json();
      let filtered = data.files || [];
      if (mediaType !== "all") {
        filtered = filtered.filter((f: SystemFile) => f.type === mediaType);
      }
      setFiles(filtered);
    } catch (error) {
      toast.error("Medya dosyaları yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    loadFiles();
  };

  const selectFile = (url: string) => {
    onChange(url);
    setIsOpen(false);
    toast.success("Medya seçildi.");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  };

  return (
    <div className="block space-y-1 text-sm">
      <span className={labelClasses}>{label}</span>
      <div className="flex gap-2">
        <input
          className={`${inputClasses} flex-1`}
          value={value}
          placeholder="/images/... veya /videos/..."
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          onClick={openModal}
          className="px-3 py-2 bg-primary-500 text-white text-xs font-medium rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-1"
        >
          {mediaType === "video" ? <Video className="w-4 h-4" /> : <Image className="w-4 h-4" />}
          Seç
        </button>
      </div>
      {value && (
        <div className="mt-2">
          {value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
            <img src={value} alt="Önizleme" className="h-16 w-24 object-cover rounded-lg border" />
          ) : value.match(/\.(mp4|webm|mov)$/i) ? (
            <div className="h-16 w-24 bg-slate-100 rounded-lg border flex items-center justify-center">
              <Video className="w-6 h-6 text-slate-400" />
            </div>
          ) : null}
        </div>
      )}

      {/* Media Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Medya Seç</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isLoading ? (
                <div className="text-center py-10 text-slate-500">Yükleniyor...</div>
              ) : files.length === 0 ? (
                <div className="text-center py-10 text-slate-500">Dosya bulunamadı.</div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {files.map((file) => (
                    <button
                      key={file.url}
                      type="button"
                      onClick={() => selectFile(file.url)}
                      className="group relative rounded-xl border-2 border-transparent hover:border-primary-400 overflow-hidden transition-colors"
                    >
                      <div className="aspect-video bg-slate-100 flex items-center justify-center">
                        {file.type === "image" ? (
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <Video className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                      <div className="p-1.5">
                        <p className="text-xs font-medium text-slate-700 truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className={labelClasses}>{label}</span>
      <textarea
        rows={rows}
        className={`${inputClasses} resize-none`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function StringListField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className={labelClasses}>{label}</span>
      <textarea
        rows={4}
        className={`${inputClasses} resize-none`}
        value={value.join("\n")}
        onChange={(event) =>
          onChange(
            event.target.value
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
          )
        }
      />
      <p className="text-xs text-slate-400">Her satıra bir madde yazın.</p>
    </label>
  );
}

function ObjectListField({ label, items, fields, emptyItem, onChange }: ListEditorProps) {
  const updateItem = (index: number, key: string, value: any) => {
    const next = items.map((item, idx) =>
      idx === index ? { ...item, [key]: value } : item
    );
    onChange(next);
  };

  const addItem = () => {
    onChange([...items, { ...emptyItem }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <button
          type="button"
          onClick={addItem}
          className="text-xs font-medium text-primary-600 hover:underline"
        >
          + Ekle
        </button>
      </div>
      {items.length === 0 && (
        <p className="text-xs text-slate-400">Liste boş.</p>
      )}
      {items.map((item, index) => (
        <div
          key={`${label}-${index}`}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {fields.map((field) => {
              const value = item[field.key] ?? "";
              if (field.type === "textarea") {
                return (
                  <TextAreaField
                    key={field.key}
                    label={field.label}
                    rows={3}
                    value={String(value)}
                    onChange={(nextValue) => updateItem(index, field.key, nextValue)}
                  />
                );
              }
              if (field.type === "number") {
                return (
                  <NumberField
                    key={field.key}
                    label={field.label}
                    value={Number(value) || 0}
                    onChange={(nextValue) => updateItem(index, field.key, nextValue)}
                  />
                );
              }
              // URL alanları için MediaField kullan
              const isMediaField = field.key.toLowerCase().includes("url") ||
                field.key.toLowerCase().includes("src") ||
                field.key.toLowerCase().includes("thumbnail") ||
                field.key.toLowerCase().includes("image") ||
                field.key.toLowerCase().includes("video");

              if (isMediaField) {
                const mediaType = field.key.toLowerCase().includes("video") ? "video" :
                  field.key.toLowerCase().includes("thumbnail") ? "image" : "all";
                return (
                  <MediaField
                    key={field.key}
                    label={field.label}
                    value={String(value)}
                    mediaType={mediaType as "image" | "video" | "all"}
                    onChange={(nextValue) => updateItem(index, field.key, nextValue)}
                  />
                );
              }
              return (
                <TextField
                  key={field.key}
                  label={field.label}
                  value={String(value)}
                  placeholder={field.placeholder}
                  onChange={(nextValue) => updateItem(index, field.key, nextValue)}
                />
              );
            })}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-xs text-red-600 hover:underline"
            >
              Sil
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ContentEditor({ contentKey, title, initialContent }: ContentEditorProps) {
  const [form, setForm] = useState<any>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [featuredJson, setFeaturedJson] = useState(() => {
    if (contentKey !== "blog") {
      return "";
    }
    const blog = initialContent as BlogContent;
    return JSON.stringify(blog.featuredArticles, null, 2);
  });
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  const updateField = (path: string, value: any) => {
    setForm((prev: any) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let current = next;
      keys.slice(0, -1).forEach((key) => {
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      });
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    if (contentKey === "blog" && featuredError) {
      toast.error("Featured JSON hatalı. Önce düzeltin.");
      return;
    }

    let payload = form;
    if (contentKey === "blog") {
      try {
        const parsed = JSON.parse(featuredJson || "[]");
        payload = {
          ...(form as BlogContent),
          featuredArticles: Array.isArray(parsed) ? parsed : []
        };
      } catch (error) {
        toast.error("Featured JSON hatalı.");
        return;
      }
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${contentKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Kayıt başarısız");
      }
      setForm(data.data);
      toast.success("İçerik kaydedildi.");
    } catch (error: any) {
      toast.error(error.message || "Kayıt sırasında hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const home = useMemo(() => form as HomeContent, [form]);
  const about = useMemo(() => form as AboutContent, [form]);
  const servicesPage = useMemo(() => form as ServicesPageContent, [form]);
  const booking = useMemo(() => form as BookingContent, [form]);
  const assessment = useMemo(() => form as AssessmentContent, [form]);
  const therapy = useMemo(() => form as TherapyContent, [form]);
  const contact = useMemo(() => form as ContactContent, [form]);
  const blog = useMemo(() => form as BlogContent, [form]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">Sayfa içeriğini güncelleyin.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg bg-primary-500 text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {isSaving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
      {contentKey === "home" && (
        <div className="space-y-6">
          <Section title="Hero">
            <TextField
              label="Badge"
              value={home.hero.badge}
              onChange={(value) => updateField("hero.badge", value)}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Başlık"
                value={home.hero.title}
                onChange={(value) => updateField("hero.title", value)}
              />
              <TextField
                label="Vurgu"
                value={home.hero.highlight}
                onChange={(value) => updateField("hero.highlight", value)}
              />
              <TextField
                label="Başlık Sonu"
                value={home.hero.titleSuffix}
                onChange={(value) => updateField("hero.titleSuffix", value)}
              />
            </div>
            <TextAreaField
              label="Açıklama"
              value={home.hero.description}
              onChange={(value) => updateField("hero.description", value)}
              rows={4}
            />
            <StringListField
              label="Başarılar"
              value={home.hero.achievements}
              onChange={(value) => updateField("hero.achievements", value)}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Birincil CTA Etiketi"
                value={home.hero.primaryCta.label}
                onChange={(value) => updateField("hero.primaryCta.label", value)}
              />
              <TextField
                label="Birincil CTA Link"
                value={home.hero.primaryCta.href}
                onChange={(value) => updateField("hero.primaryCta.href", value)}
              />
              <TextField
                label="İkincil CTA Etiketi"
                value={home.hero.secondaryCta.label}
                onChange={(value) => updateField("hero.secondaryCta.label", value)}
              />
              <TextField
                label="İkincil CTA Link"
                value={home.hero.secondaryCta.href}
                onChange={(value) => updateField("hero.secondaryCta.href", value)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <MediaField
                label="Arka Plan Görsel URL"
                value={home.hero.backgroundImage.src}
                mediaType="image"
                onChange={(value) => updateField("hero.backgroundImage.src", value)}
              />
              <TextField
                label="Arka Plan Alt"
                value={home.hero.backgroundImage.alt}
                onChange={(value) => updateField("hero.backgroundImage.alt", value)}
              />
              <MediaField
                label="Portre Görsel URL"
                value={home.hero.portraitImage.src}
                mediaType="image"
                onChange={(value) => updateField("hero.portraitImage.src", value)}
              />
              <TextField
                label="Portre Alt"
                value={home.hero.portraitImage.alt}
                onChange={(value) => updateField("hero.portraitImage.alt", value)}
              />
            </div>
            <ObjectListField
              label="Hero Stat Kartlari"
              items={home.hero.statCards}
              onChange={(items) => updateField("hero.statCards", items)}
              emptyItem={{ value: "", label: "" }}
              fields={[
                { key: "value", label: "Değer" },
                { key: "label", label: "Etiket" }
              ]}
            />
          </Section>

          <Section title="Stats">
            <ObjectListField
              label="İstatistikler"
              items={home.stats.items}
              onChange={(items) => updateField("stats.items", items)}
              emptyItem={{ icon: "clock", value: 0, suffix: "", label: "", color: "" }}
              fields={[
                { key: "icon", label: "İkon Anahtarı" },
                { key: "value", label: "Değer", type: "number" },
                { key: "suffix", label: "Ek (%, +)" },
                { key: "label", label: "Etiket" },
                { key: "color", label: "Renk Sınıfı" }
              ]}
            />
          </Section>

          <Section title="Problemler">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Başlık"
                value={home.problems.title}
                onChange={(value) => updateField("problems.title", value)}
              />
              <TextField
                label="Vurgu"
                value={home.problems.highlight}
                onChange={(value) => updateField("problems.highlight", value)}
              />
            </div>
            <TextAreaField
              label="Açıklama"
              value={home.problems.description}
              onChange={(value) => updateField("problems.description", value)}
              rows={3}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="CTA Etiket"
                value={home.problems.cta.label}
                onChange={(value) => updateField("problems.cta.label", value)}
              />
              <TextField
                label="CTA Link"
                value={home.problems.cta.href}
                onChange={(value) => updateField("problems.cta.href", value)}
              />
            </div>
            <ObjectListField
              label="Problem Kartlari"
              items={home.problems.items}
              onChange={(items) => updateField("problems.items", items)}
              emptyItem={{ title: "", description: "", icon: "eye" }}
              fields={[
                { key: "title", label: "Başlık" },
                { key: "description", label: "Açıklama", type: "textarea" },
                { key: "icon", label: "İkon Anahtarı" }
              ]}
            />
          </Section>

          <Section title="Hizmetler">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Başlık"
                value={home.services.title}
                onChange={(value) => updateField("services.title", value)}
              />
              <TextField
                label="Vurgu"
                value={home.services.highlight}
                onChange={(value) => updateField("services.highlight", value)}
              />
              <TextAreaField
                label="Açıklama"
                value={home.services.description}
                onChange={(value) => updateField("services.description", value)}
                rows={2}
              />
              <TextField
                label="Çocuk Etiketi"
                value={home.services.childrenLabel}
                onChange={(value) => updateField("services.childrenLabel", value)}
              />
              <TextField
                label="Yetişkin Etiketi"
                value={home.services.adultsLabel}
                onChange={(value) => updateField("services.adultsLabel", value)}
              />
            </div>
          </Section>

          <Section title="Terapi Bölümü">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Başlık"
                value={home.therapy.title}
                onChange={(value) => updateField("therapy.title", value)}
              />
              <TextField
                label="Vurgu"
                value={home.therapy.highlight}
                onChange={(value) => updateField("therapy.highlight", value)}
              />
            </div>
            <TextAreaField
              label="Açıklama"
              value={home.therapy.description}
              onChange={(value) => updateField("therapy.description", value)}
            />
            <StringListField
              label="Adımlar"
              value={home.therapy.steps}
              onChange={(value) => updateField("therapy.steps", value)}
            />
            <ObjectListField
              label="Galeri"
              items={home.therapy.gallery}
              onChange={(items) => updateField("therapy.gallery", items)}
              emptyItem={{ src: "", title: "" }}
              fields={[
                { key: "src", label: "Görsel URL" },
                { key: "title", label: "Başlık" }
              ]}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="CTA Etiket"
                value={home.therapy.cta.label}
                onChange={(value) => updateField("therapy.cta.label", value)}
              />
              <TextField
                label="CTA Link"
                value={home.therapy.cta.href}
                onChange={(value) => updateField("therapy.cta.href", value)}
              />
            </div>
          </Section>

          <Section title="Hakkımda Önizleme">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="İsim"
                value={home.aboutPreview.name}
                onChange={(value) => updateField("aboutPreview.name", value)}
              />
              <TextField
                label="Vurgu"
                value={home.aboutPreview.highlight}
                onChange={(value) => updateField("aboutPreview.highlight", value)}
              />
              <TextField
                label="Ünvan"
                value={home.aboutPreview.title}
                onChange={(value) => updateField("aboutPreview.title", value)}
              />
              <TextField
                label="Deneyim Değer"
                value={home.aboutPreview.experienceValue}
                onChange={(value) => updateField("aboutPreview.experienceValue", value)}
              />
              <TextField
                label="Deneyim Etiket"
                value={home.aboutPreview.experienceLabel}
                onChange={(value) => updateField("aboutPreview.experienceLabel", value)}
              />
            </div>
            <TextAreaField
              label="Alıntı"
              value={home.aboutPreview.quote}
              onChange={(value) => updateField("aboutPreview.quote", value)}
              rows={3}
            />
            <ObjectListField
              label="Yetkinlikler"
              items={home.aboutPreview.credentials}
              onChange={(items) => updateField("aboutPreview.credentials", items)}
              emptyItem={{ title: "", subtitle: "", icon: "" }}
              fields={[
                { key: "title", label: "Başlık" },
                { key: "subtitle", label: "Alt Başlık" },
                { key: "icon", label: "İkon Anahtarı" }
              ]}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <MediaField
                label="Görsel URL"
                value={home.aboutPreview.image.src}
                mediaType="image"
                onChange={(value) => updateField("aboutPreview.image.src", value)}
              />
              <TextField
                label="Görsel Alt"
                value={home.aboutPreview.image.alt}
                onChange={(value) => updateField("aboutPreview.image.alt", value)}
              />
            </div>
          </Section>

          <Section title="AI CTA">
            <TextField
              label="Başlık"
              value={home.aiCta.title}
              onChange={(value) => updateField("aiCta.title", value)}
            />
            <TextAreaField
              label="Açıklama"
              value={home.aiCta.description}
              onChange={(value) => updateField("aiCta.description", value)}
              rows={3}
            />
            <ObjectListField
              label="Özellikler"
              items={home.aiCta.features}
              onChange={(items) => updateField("aiCta.features", items)}
              emptyItem={{ text: "", icon: "" }}
              fields={[
                { key: "text", label: "Metin" },
                { key: "icon", label: "İkon Anahtarı" }
              ]}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Buton Etiket"
                value={home.aiCta.buttonLabel}
                onChange={(value) => updateField("aiCta.buttonLabel", value)}
              />
              <TextField
                label="Buton Link"
                value={home.aiCta.buttonHref}
                onChange={(value) => updateField("aiCta.buttonHref", value)}
              />
            </div>
            <TextField
              label="Dipnot"
              value={home.aiCta.footnote}
              onChange={(value) => updateField("aiCta.footnote", value)}
            />
          </Section>

          <Section title="Yorumlar">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Başlık"
                value={home.testimonials.title}
                onChange={(value) => updateField("testimonials.title", value)}
              />
              <TextField
                label="Vurgu"
                value={home.testimonials.highlight}
                onChange={(value) => updateField("testimonials.highlight", value)}
              />
            </div>
            <TextAreaField
              label="Açıklama"
              value={home.testimonials.description}
              onChange={(value) => updateField("testimonials.description", value)}
              rows={2}
            />
            <ObjectListField
              label="Yorum Kartlari"
              items={home.testimonials.items}
              onChange={(items) => updateField("testimonials.items", items)}
              emptyItem={{
                content: "",
                author: "",
                relation: "",
                location: "",
                date: "",
                rating: 5,
                serviceType: ""
              }}
              fields={[
                { key: "content", label: "İçerik", type: "textarea" },
                { key: "author", label: "Yazar" },
                { key: "relation", label: "İlişki" },
                { key: "location", label: "Konum" },
                { key: "date", label: "Tarih" },
                { key: "rating", label: "Puan", type: "number" },
                { key: "serviceType", label: "Hizmet Tipi" }
              ]}
            />
            <TextField
              label="Video Başlık"
              value={home.testimonials.videoTitle}
              onChange={(value) => updateField("testimonials.videoTitle", value)}
            />
            <ObjectListField
              label="Video Kartlari"
              items={home.testimonials.videos}
              onChange={(items) => updateField("testimonials.videos", items)}
              emptyItem={{ title: "", thumbnail: "", videoUrl: "" }}
              fields={[
                { key: "title", label: "Başlık" },
                { key: "thumbnail", label: "Kapak URL" },
                { key: "videoUrl", label: "Video URL" }
              ]}
            />
          </Section>
        </div>
      )}
      {contentKey === "about" && (
        <div className="space-y-6">
          <Section title="Hero">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="İsim"
                value={about.hero.name}
                onChange={(value) => updateField("hero.name", value)}
              />
              <TextField
                label="Vurgu"
                value={about.hero.highlight}
                onChange={(value) => updateField("hero.highlight", value)}
              />
              <TextField
                label="Ünvan"
                value={about.hero.title}
                onChange={(value) => updateField("hero.title", value)}
              />
            </div>
            <StringListField
              label="Paragraflar"
              value={about.hero.paragraphs}
              onChange={(value) => updateField("hero.paragraphs", value)}
            />
            <TextAreaField
              label="Alıntı"
              value={about.hero.quote}
              onChange={(value) => updateField("hero.quote", value)}
            />
            <ObjectListField
              label="Statlar"
              items={about.hero.stats}
              onChange={(items) => updateField("hero.stats", items)}
              emptyItem={{ value: "", label: "" }}
              fields={[
                { key: "value", label: "Değer" },
                { key: "label", label: "Etiket" }
              ]}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <MediaField
                label="Görsel URL"
                value={about.hero.image.src}
                mediaType="image"
                onChange={(value) => updateField("hero.image.src", value)}
              />
              <TextField
                label="Görsel Alt"
                value={about.hero.image.alt}
                onChange={(value) => updateField("hero.image.alt", value)}
              />
            </div>
          </Section>

          <Section title="Kariyer Timeline">
            <ObjectListField
              label="Timeline"
              items={about.timeline}
              onChange={(items) => updateField("timeline", items)}
              emptyItem={{ year: "", title: "", description: "", icon: "" }}
              fields={[
                { key: "year", label: "Yıl" },
                { key: "title", label: "Başlık" },
                { key: "description", label: "Açıklama", type: "textarea" },
                { key: "icon", label: "İkon Anahtarı" }
              ]}
            />
          </Section>

          <Section title="Sertifikalar">
            <StringListField
              label="Sertifika Listesi"
              value={about.certifications}
              onChange={(value) => updateField("certifications", value)}
            />
          </Section>

          <Section title="Değerler">
            <ObjectListField
              label="Deger Kartlari"
              items={about.values}
              onChange={(items) => updateField("values", items)}
              emptyItem={{ title: "", description: "", icon: "" }}
              fields={[
                { key: "title", label: "Başlık" },
                { key: "description", label: "Açıklama", type: "textarea" },
                { key: "icon", label: "İkon Anahtarı" }
              ]}
            />
          </Section>
        </div>
      )}

      {contentKey === "services-page" && (
        <Section title="Hizmetler Sayfası">
          <TextField
            label="Başlık"
            value={servicesPage.title}
            onChange={(value) => updateField("title", value)}
          />
          <TextAreaField
            label="Açıklama"
            value={servicesPage.description}
            onChange={(value) => updateField("description", value)}
            rows={3}
          />
          <TextField
            label="Çocuk Başlık"
            value={servicesPage.childrenTitle}
            onChange={(value) => updateField("childrenTitle", value)}
          />
          <TextAreaField
            label="Çocuk Açıklama"
            value={servicesPage.childrenDescription}
            onChange={(value) => updateField("childrenDescription", value)}
            rows={2}
          />
          <TextField
            label="Yetişkin Başlık"
            value={servicesPage.adultsTitle}
            onChange={(value) => updateField("adultsTitle", value)}
          />
          <TextAreaField
            label="Yetişkin Açıklama"
            value={servicesPage.adultsDescription}
            onChange={(value) => updateField("adultsDescription", value)}
            rows={2}
          />
        </Section>
      )}

      {contentKey === "booking" && (
        <Section title="Randevu">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Başlık"
              value={booking.title}
              onChange={(value) => updateField("title", value)}
            />
            <TextField
              label="Vurgu"
              value={booking.highlight}
              onChange={(value) => updateField("highlight", value)}
            />
          </div>
          <TextAreaField
            label="Açıklama"
            value={booking.description}
            onChange={(value) => updateField("description", value)}
            rows={2}
          />
          <ObjectListField
            label="Özellikler"
            items={booking.features}
            onChange={(items) => updateField("features", items)}
            emptyItem={{ text: "", icon: "" }}
            fields={[
              { key: "text", label: "Metin" },
              { key: "icon", label: "İkon Anahtarı" }
            ]}
          />
          <TextField
            label="İletişim Metni"
            value={booking.contactPrompt}
            onChange={(value) => updateField("contactPrompt", value)}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Telefon CTA"
              value={booking.phoneCtaLabel}
              onChange={(value) => updateField("phoneCtaLabel", value)}
            />
            <TextField
              label="WhatsApp CTA"
              value={booking.whatsappCtaLabel}
              onChange={(value) => updateField("whatsappCtaLabel", value)}
            />
          </div>
        </Section>
      )}

      {contentKey === "assessment" && (
        <Section title="Değerlendirme">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Badge"
              value={assessment.badge}
              onChange={(value) => updateField("badge", value)}
            />
            <TextField
              label="Başlık"
              value={assessment.title}
              onChange={(value) => updateField("title", value)}
            />
            <TextField
              label="Vurgu"
              value={assessment.highlight}
              onChange={(value) => updateField("highlight", value)}
            />
          </div>
          <TextAreaField
            label="Açıklama"
            value={assessment.description}
            onChange={(value) => updateField("description", value)}
            rows={3}
          />
          <ObjectListField
            label="Özellikler"
            items={assessment.features}
            onChange={(items) => updateField("features", items)}
            emptyItem={{ text: "", icon: "" }}
            fields={[
              { key: "text", label: "Metin" },
              { key: "icon", label: "İkon Anahtarı" }
            ]}
          />
        </Section>
      )}

      {contentKey === "therapy" && (
        <div className="space-y-6">
          <Section title="Hero">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Badge"
                value={therapy.hero.badge}
                onChange={(value) => updateField("hero.badge", value)}
              />
              <TextField
                label="Başlık"
                value={therapy.hero.title}
                onChange={(value) => updateField("hero.title", value)}
              />
              <TextField
                label="Vurgu"
                value={therapy.hero.highlight}
                onChange={(value) => updateField("hero.highlight", value)}
              />
            </div>
            <TextAreaField
              label="Açıklama"
              value={therapy.hero.description}
              onChange={(value) => updateField("hero.description", value)}
              rows={3}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="CTA 1 Etiket"
                value={therapy.hero.ctaPrimaryLabel}
                onChange={(value) => updateField("hero.ctaPrimaryLabel", value)}
              />
              <TextField
                label="CTA 1 Link"
                value={therapy.hero.ctaPrimaryHref}
                onChange={(value) => updateField("hero.ctaPrimaryHref", value)}
              />
              <TextField
                label="CTA 2 Etiket"
                value={therapy.hero.ctaSecondaryLabel}
                onChange={(value) => updateField("hero.ctaSecondaryLabel", value)}
              />
              <TextField
                label="CTA 2 Link"
                value={therapy.hero.ctaSecondaryHref}
                onChange={(value) => updateField("hero.ctaSecondaryHref", value)}
              />
            </div>
          </Section>

          <Section title="Eğitim Rotası">
            <TextField
              label="Özet Başlık"
              value={therapy.routeSummaryTitle}
              onChange={(value) => updateField("routeSummaryTitle", value)}
            />
            <ObjectListField
              label="Adımlar"
              items={therapy.routeSteps}
              onChange={(items) => updateField("routeSteps", items)}
              emptyItem={{ title: "", description: "" }}
              fields={[
                { key: "title", label: "Başlık" },
                { key: "description", label: "Açıklama", type: "textarea" }
              ]}
            />
          </Section>

          <Section title="Setler">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Başlık"
                value={therapy.toolsTitle}
                onChange={(value) => updateField("toolsTitle", value)}
              />
              <TextAreaField
                label="Açıklama"
                value={therapy.toolsDescription}
                onChange={(value) => updateField("toolsDescription", value)}
                rows={2}
              />
            </div>
            <ObjectListField
              label="Set Kartlari"
              items={therapy.toolSets}
              onChange={(items) => updateField("toolSets", items)}
              emptyItem={{ title: "", description: "", icon: "" }}
              fields={[
                { key: "title", label: "Başlık" },
                { key: "description", label: "Açıklama", type: "textarea" },
                { key: "icon", label: "İkon Anahtarı" }
              ]}
            />
          </Section>

          <Section title="Galeri">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Başlık"
                value={therapy.galleryTitle}
                onChange={(value) => updateField("galleryTitle", value)}
              />
              <TextAreaField
                label="Açıklama"
                value={therapy.galleryDescription}
                onChange={(value) => updateField("galleryDescription", value)}
                rows={2}
              />
            </div>
            <ObjectListField
              label="Galeri Görselleri"
              items={therapy.gallery}
              onChange={(items) => updateField("gallery", items)}
              emptyItem={{ src: "", label: "" }}
              fields={[
                { key: "src", label: "Görsel URL" },
                { key: "label", label: "Etiket" }
              ]}
            />
          </Section>
        </div>
      )}

      {contentKey === "contact" && (
        <Section title="İletişim">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Hero Badge"
              value={contact.heroBadge}
              onChange={(value) => updateField("heroBadge", value)}
            />
            <TextField
              label="Hero Başlık"
              value={contact.heroTitle}
              onChange={(value) => updateField("heroTitle", value)}
            />
            <TextField
              label="Hero Vurgu"
              value={contact.heroHighlight}
              onChange={(value) => updateField("heroHighlight", value)}
            />
          </div>
          <TextAreaField
            label="Hero Açıklama"
            value={contact.heroDescription}
            onChange={(value) => updateField("heroDescription", value)}
            rows={3}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Hero CTA 1"
              value={contact.heroPrimaryCta}
              onChange={(value) => updateField("heroPrimaryCta", value)}
            />
            <TextField
              label="Hero CTA 2"
              value={contact.heroSecondaryCta}
              onChange={(value) => updateField("heroSecondaryCta", value)}
            />
          </div>
          <TextField
            label="Randevu Başlık"
            value={contact.appointmentTitle}
            onChange={(value) => updateField("appointmentTitle", value)}
          />
          <TextAreaField
            label="Randevu Açıklama"
            value={contact.appointmentDescription}
            onChange={(value) => updateField("appointmentDescription", value)}
            rows={2}
          />
          <StringListField
            label="Randevu Özellikleri"
            value={contact.appointmentFeatures}
            onChange={(value) => updateField("appointmentFeatures", value)}
          />
          <TextField
            label="Mesaj Başlık"
            value={contact.messageTitle}
            onChange={(value) => updateField("messageTitle", value)}
          />
          <TextAreaField
            label="Mesaj Açıklama"
            value={contact.messageDescription}
            onChange={(value) => updateField("messageDescription", value)}
            rows={2}
          />
          <TextField
            label="Bilgi Başlık"
            value={contact.infoTitle}
            onChange={(value) => updateField("infoTitle", value)}
          />
          <TextField
            label="Hızlı İletişim Başlık"
            value={contact.quickContactTitle}
            onChange={(value) => updateField("quickContactTitle", value)}
          />
          <TextAreaField
            label="Hızlı İletişim Açıklama"
            value={contact.quickContactDescription}
            onChange={(value) => updateField("quickContactDescription", value)}
            rows={2}
          />
          <TextField
            label="Konum Başlık"
            value={contact.locationTitle}
            onChange={(value) => updateField("locationTitle", value)}
          />
        </Section>
      )}

      {contentKey === "blog" && (
        <div className="space-y-6">
          <Section title="Blog">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Başlık"
                value={blog.title}
                onChange={(value) => updateField("title", value)}
              />
              <TextField
                label="Vurgu"
                value={blog.highlight}
                onChange={(value) => updateField("highlight", value)}
              />
            </div>
            <TextAreaField
              label="Açıklama"
              value={blog.description}
              onChange={(value) => updateField("description", value)}
              rows={2}
            />
            <StringListField
              label="Kategoriler"
              value={blog.categories}
              onChange={(value) => updateField("categories", value)}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Featured Başlık"
                value={blog.featuredTitle}
                onChange={(value) => updateField("featuredTitle", value)}
              />
              <TextAreaField
                label="Featured Açıklama"
                value={blog.featuredDescription}
                onChange={(value) => updateField("featuredDescription", value)}
                rows={2}
              />
            </div>
            <label className="block space-y-1 text-sm">
              <span className={labelClasses}>Featured Articles (JSON)</span>
              <textarea
                rows={10}
                className={`${inputClasses} font-mono text-xs`}
                value={featuredJson}
                onChange={(event) => {
                  const value = event.target.value;
                  setFeaturedJson(value);
                  try {
                    JSON.parse(value || "[]");
                    setFeaturedError(null);
                  } catch (error: any) {
                    setFeaturedError("JSON format hatalı.");
                  }
                }}
              />
              {featuredError && (
                <p className="text-xs text-red-600">{featuredError}</p>
              )}
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Bülten Başlık"
                value={blog.newsletterTitle}
                onChange={(value) => updateField("newsletterTitle", value)}
              />
              <TextAreaField
                label="Bülten Açıklama"
                value={blog.newsletterDescription}
                onChange={(value) => updateField("newsletterDescription", value)}
                rows={2}
              />
              <TextField
                label="Bülten Placeholder"
                value={blog.newsletterPlaceholder}
                onChange={(value) => updateField("newsletterPlaceholder", value)}
              />
              <TextField
                label="Bülten Buton"
                value={blog.newsletterButton}
                onChange={(value) => updateField("newsletterButton", value)}
              />
            </div>
            <TextAreaField
              label="Açıklama Notu"
              value={blog.disclaimer}
              onChange={(value) => updateField("disclaimer", value)}
              rows={2}
            />
          </Section>
        </div>
      )}
    </div>
  );
}
