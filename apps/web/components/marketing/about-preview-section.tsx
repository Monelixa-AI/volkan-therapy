"use client";
import { IMAGE_DISCLAIMER } from "@/lib/ui-copy";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  GraduationCap,
  Building,
  Baby,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeContent } from "@/lib/content-defaults";

const ICONS = {
  graduation: GraduationCap,
  award: Award,
  building: Building,
  baby: Baby
};

type AboutPreviewSectionProps = {
  content: HomeContent["aboutPreview"];
};

export function AboutPreviewSection({ content }: AboutPreviewSectionProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={content.image.src}
                  alt={content.image.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-100 rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent-100 rounded-2xl -z-10" />
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-4 text-center"
              >
                <span className="text-4xl font-bold text-primary-500">
                  {content.experienceValue}
                </span>
                <p className="text-sm text-gray-600">{content.experienceLabel}</p>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {content.name} <span className="text-primary-500">{content.highlight}</span>
            </h2>
            <p className="text-xl text-gray-600 mb-4">{content.title}</p>
            <div className="w-16 h-1 bg-primary-500 mb-6" />
            <blockquote className="text-lg text-gray-700 italic mb-8 border-l-4 border-primary-500 pl-4">
              {content.quote}
            </blockquote>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {content.credentials.map((item, index) => {
                const Icon = ICONS[item.icon as keyof typeof ICONS] ?? User;
                return (
                  <motion.div
                    key={`${item.title}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.subtitle}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <Button size="lg" asChild>
              <Link href="/hakkimda">
                Detayli Ozgecmis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
