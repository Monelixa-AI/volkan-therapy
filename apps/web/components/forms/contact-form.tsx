"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact_page" })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Mesaj gönderilemedi.");
      }
      toast.success("Mesajınız alındı. En kısa sürede dönüş yapacağız.");
      setForm(initialState);
    } catch (error: any) {
      toast.error(error.message || "Mesaj gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ad Soyad *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Adınız Soyadınız"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-posta *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="ornek@email.com"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefon (Opsiyonel)
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="+90 532 286 25 21"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konu (Opsiyonel)
          </label>
          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Kısa başlık"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mesajınız *
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Size nasıl yardımcı olabiliriz?"
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-gray-500">
          Göndererek KVKK Aydınlatma Metni kapsamında kişisel verilerinizin
          işlenmesini kabul etmiş olursunuz.
        </p>
        <Button type="submit" className="sm:w-auto w-full" disabled={isSubmitting}>
          {isSubmitting ? "Gönderiliyor..." : "Mesaj Gönder"}
          <Send className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
