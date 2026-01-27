"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { tr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, User, Mail, Phone, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const bookingSchema = z.object({
  serviceId: z.string().min(1, "Hizmet seçiniz"),
  date: z.string().min(1, "Tarih seçiniz"),
  startTime: z.string().min(1, "Saat seçiniz"),
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  childName: z.string().optional(),
  childAge: z.string().optional(),
  notes: z.string().optional()
});

type BookingFormData = z.infer<typeof bookingSchema>;

type ServiceOption = {
  id: string;
  title: string;
  duration: number;
};

export function BookingForm() {
  const [step, setStep] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: "",
      date: "",
      startTime: "",
      name: "",
      email: "",
      phone: "",
      childName: "",
      notes: ""
    }
  });

  const selectedDate = form.watch("date");
  const selectedService = form.watch("serviceId");

  useEffect(() => {
    const loadServices = async () => {
      setIsLoadingServices(true);
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data.services || []);
      } catch (error) {
        toast.error("Hizmetler yuklenemedi");
      } finally {
        setIsLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedService]);

  const fetchAvailableSlots = async (date: string) => {
    setIsLoadingSlots(true);
    try {
      const res = await fetch(
        `/api/booking/available-slots?date=${date}&serviceId=${selectedService}`
      );
      const data = await res.json();
      setAvailableSlots(data.slots || []);
    } catch (error) {
      toast.error("Müsait saatler yüklenirken hata oluştu");
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleDateChange = (date: string) => {
    form.setValue("date", date);
    form.setValue("startTime", "");
    if (selectedService) {
      fetchAvailableSlots(date);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Randevu oluşturulamadı");
      }
      setBookingComplete(true);
      toast.success("Randevunuz başarıyla oluşturuldu!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i + 1);
    const dayOfWeek = date.getDay();
    return {
      date: format(date, "yyyy-MM-dd"),
      display: format(date, "d MMMM", { locale: tr }),
      dayName: format(date, "EEEE", { locale: tr }),
      disabled: dayOfWeek === 0
    };
  });

  if (bookingComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
          Randevunuz Onaylandı!
        </h2>
        <p className="text-gray-600 mb-2">
          Randevu detayları e-posta adresinize gönderildi.
        </p>
        <p className="text-gray-600 mb-8">
          WhatsApp üzerinden de hatırlatma alacaksınız.
        </p>
        <Button onClick={() => window.location.reload()}>
          Yeni Randevu Oluştur
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s
                  ? "bg-primary-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-24 h-1 mx-2 ${
                  step > s ? "bg-primary-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-xl font-semibold mb-6">
                Hizmet ve Tarih Seçin
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hizmet Türü
                </label>
                <div className="grid gap-3">
                  {isLoadingServices ? (
                    <div className="flex items-center justify-center py-6 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Hizmetler yukleniyor...
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-sm text-gray-500 py-4">Hizmet bulunamadi.</div>
                  ) : (
                    services.map((service) => (
                      <label
                        key={service.id}
                        className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                          form.watch("serviceId") === service.id
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          value={service.id}
                          {...form.register("serviceId")}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{service.title}</p>
                          <p className="text-sm text-gray-500">{service.duration} dakika</p>
                        </div>
                        {form.watch("serviceId") === service.id && (
                          <Check className="w-5 h-5 text-primary-500" />
                        )}
                      </label>
                    ))
                  )}
                </div>
                {form.formState.errors.serviceId && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.serviceId.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih Seçin
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableDates.map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      disabled={d.disabled}
                      onClick={() => handleDateChange(d.date)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        d.disabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : form.watch("date") === d.date
                          ? "bg-primary-500 text-white"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <p className="text-xs">{d.dayName}</p>
                      <p className="font-semibold">{d.display}</p>
                    </button>
                  ))}
                </div>
              </div>
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saat Seçin
                  </label>
                  {isLoadingSlots ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                      <span className="ml-2">Müsait saatler yükleniyor...</span>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">
                      Bu tarihte müsait saat bulunmuyor
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => form.setValue("startTime", slot.time)}
                          className={`p-3 rounded-xl text-center transition-all ${
                            form.watch("startTime") === slot.time
                              ? "bg-primary-500 text-white"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <Clock className="w-4 h-4 mx-auto mb-1" />
                          <p className="font-medium">{slot.displayTime}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <Button
                type="button"
                className="w-full"
                disabled={!form.watch("serviceId") || !form.watch("date") || !form.watch("startTime")}
                onClick={() => setStep(2)}
              >
                Devam Et
              </Button>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-xl font-semibold mb-6">
                İletişim Bilgileriniz
              </h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      {...form.register("name")}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      {...form.register("email")}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      {...form.register("phone")}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="+90 532 286 25 21"
                    />
                  </div>
                  {form.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Çocuğunuzun Adı (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    {...form.register("childName")}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Çocuğunuzun adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eklemek İstedikleriniz (Opsiyonel)
                  </label>
                  <textarea
                    {...form.register("notes")}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Belirtmek istediğiniz özel durumlar..."
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Geri
                </Button>
                <Button type="button" className="flex-1" onClick={() => setStep(3)}>
                  Devam Et
                </Button>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-xl font-semibold mb-6">
                Randevu Özeti
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hizmet:</span>
                  <span className="font-medium">
                    {services.find((s) => s.id === form.watch("serviceId"))?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarih:</span>
                  <span className="font-medium">
                    {form.watch("date") &&
                      format(new Date(form.watch("date")), "d MMMM yyyy, EEEE", {
                        locale: tr
                      })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saat:</span>
                  <span className="font-medium">{form.watch("startTime")}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-gray-600">Ad Soyad:</span>
                  <span className="font-medium">{form.watch("name")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">E-posta:</span>
                  <span className="font-medium">{form.watch("email")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Telefon:</span>
                  <span className="font-medium">{form.watch("phone")}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" id="kvkk" required className="mt-1" />
                <label htmlFor="kvkk" className="text-sm text-gray-600">
                  <a href="/kvkk" className="text-primary-500 underline">
                    KVKK Aydınlatma Metni
                  </a>
                  'ni okudum ve kabul ediyorum. Kişisel verilerimin işlenmesine
                  onay veriyorum.
                </label>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Geri
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    "Randevuyu Onayla"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}