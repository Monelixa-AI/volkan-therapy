"use client";
import { IMAGE_DISCLAIMER } from "@/lib/ui-copy";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { HomeContent } from "@/lib/content-defaults";

type ServiceSummary = {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string | null;
  description: string;
  highlights: string[];
  image?: string | null;
  icon?: string | null;
  category: string;
};

type ServicesSectionProps = {
  content: HomeContent["services"];
  services: ServiceSummary[];
};

export function ServicesSection({ content, services }: ServicesSectionProps) {
  const childServices = useMemo(
    () => services.filter((service) => service.category === "CHILD_THERAPY"),
    [services]
  );
  const adultServices = useMemo(
    () => services.filter((service) => service.category === "ADULT_REHAB"),
    [services]
  );

  const initialTab = childServices.length > 0 ? "children" : "adults";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedService, setSelectedService] = useState<ServiceSummary | null>(
    (childServices[0] ?? adultServices[0]) || null
  );

  useEffect(() => {
    const nextSelection =
      activeTab === "children" ? childServices[0] : adultServices[0];
    setSelectedService(nextSelection ?? null);
  }, [activeTab, childServices, adultServices]);

  const currentServices = activeTab === "children" ? childServices : adultServices;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.title}{" "}
            <span className="text-primary-500">{content.highlight}</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{content.description}</p>
        </motion.div>
        <Tabs defaultValue={initialTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="children" className="text-base">
              {content.childrenLabel}
            </TabsTrigger>
            <TabsTrigger value="adults" className="text-base">
              {content.adultsLabel}
            </TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <TabsContent value={activeTab} className="mt-0">
              {currentServices.length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-10">
                  Hizmet bulunamadi.
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    {currentServices.map((service) => (
                      <motion.button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          selectedService?.id === service.id
                            ? "bg-primary-500 text-white shadow-lg"
                            : "bg-white hover:bg-gray-100"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {service.icon && (
                              <span className="text-2xl mr-3">{service.icon}</span>
                            )}
                            <span className="font-medium">
                              {service.shortTitle || service.title}
                            </span>
                          </div>
                          <ChevronRight
                            className={`w-5 h-5 ${
                              selectedService?.id === service.id
                                ? "text-white"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {selectedService && (
                    <motion.div
                      key={selectedService.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                      <div className="grid md:grid-cols-2">
                        <div className="relative h-64 md:h-full min-h-[300px]">
                          {selectedService.image ? (
                            <>
                              <img
                                src={selectedService.image}
                                alt={selectedService.title}
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                              <p className="absolute bottom-2 left-2 right-2 text-[10px] sm:text-xs text-gray-500 bg-white/70 backdrop-blur-sm rounded-md px-2 py-1 leading-snug pointer-events-none">
                                {IMAGE_DISCLAIMER}
                              </p>
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-white" />
                          )}
                        </div>
                        <div className="p-8">
                          <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                            {selectedService.title}
                          </h3>
                          <p className="text-gray-600 mb-6">{selectedService.description}</p>
                          <ul className="space-y-3 mb-8">
                            {selectedService.highlights.map((feature) => (
                              <li key={feature} className="flex items-center text-gray-700">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <Button asChild>
                            <Link href={`/hizmetler/${selectedService.slug}`}>
                              Detayli Bilgi
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  );
}
