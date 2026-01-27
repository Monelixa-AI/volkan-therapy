"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Clock, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeContent } from "@/lib/content-defaults";

const ICONS = {
  clock: Clock,
  sparkles: Sparkles,
  shield: Shield
};

type AIAssessmentCTAProps = {
  content: HomeContent["aiCta"];
};

export function AIAssessmentCTA({ content }: AIAssessmentCTAProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            viewport={{ once: true }}
            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            {content.title}
          </h2>
          <p className="text-xl text-primary-100 mb-8">{content.description}</p>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {content.features.map((feature, index) => {
              const Icon = ICONS[feature.icon as keyof typeof ICONS] ?? Sparkles;
              return (
                <div key={`${feature.text}-${index}`} className="flex items-center text-white/90">
                  <Icon className="w-5 h-5 mr-2" />
                  <span>{feature.text}</span>
                </div>
              );
            })}
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-white text-primary-600 hover:bg-primary-50"
              asChild
            >
              <Link href={content.buttonHref}>
                {content.buttonLabel}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
          <p className="text-primary-200 text-sm mt-6">{content.footnote}</p>
        </motion.div>
      </div>
    </section>
  );
}
