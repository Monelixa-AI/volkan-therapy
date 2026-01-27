"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMAGE_DISCLAIMER } from "@/lib/ui-copy";
import type { HomeContent } from "@/lib/content-defaults";

type HeroSectionProps = {
  content: HomeContent["hero"];
};

export function HeroSection({ content }: HeroSectionProps) {
  const statCards = content.statCards.slice(0, 2);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/80 z-10" />
        <img
          src={content.backgroundImage.src}
          alt={content.backgroundImage.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="container mx-auto px-4 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse" />
              {content.badge}
            </motion.div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {content.title}{" "}
              <span className="text-primary-500">{content.highlight}</span>{" "}
              {content.titleSuffix}
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl">{content.description}</p>
            <div className="space-y-3 mb-8">
              {content.achievements.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center text-gray-700"
                >
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" asChild>
                <Link href={content.primaryCta.href}>
                  {content.primaryCta.label}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={content.secondaryCta.href}>
                  <Play className="w-5 h-5 mr-2" />
                  {content.secondaryCta.label}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={content.portraitImage.src}
                  alt={content.portraitImage.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              {statCards[0] && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -left-8 top-1/4 bg-white rounded-xl shadow-lg p-4"
                >
                  <p className="text-3xl font-bold text-primary-500">{statCards[0].value}</p>
                  <p className="text-sm text-gray-600">{statCards[0].label}</p>
                </motion.div>
              )}
              {statCards[1] && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute -right-8 bottom-1/4 bg-white rounded-xl shadow-lg p-4"
                >
                  <p className="text-3xl font-bold text-accent-500">{statCards[1].value}</p>
                  <p className="text-sm text-gray-600">{statCards[1].label}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-3 bg-gray-400 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
