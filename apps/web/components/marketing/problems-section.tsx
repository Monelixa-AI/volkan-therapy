"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Ear,
  Hand,
  BookOpen,
  Zap,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HomeContent } from "@/lib/content-defaults";

const ICONS = {
  eye: Eye,
  ear: Ear,
  hand: Hand,
  book: BookOpen,
  zap: Zap,
  alert: AlertTriangle
};

type ProblemsSectionProps = {
  content: HomeContent["problems"];
};

export function ProblemsSection({ content }: ProblemsSectionProps) {
  return (
    <section className="py-20 bg-white">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {content.items.map((problem, index) => {
            const Icon = ICONS[problem.icon as keyof typeof ICONS] ?? Eye;
            return (
              <motion.div
                key={`${problem.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 bg-gray-50 rounded-xl hover:bg-primary-50 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6 text-primary-500 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {problem.title}
                </h3>
                <p className="text-gray-600 text-sm">{problem.description}</p>
              </motion.div>
            );
          })}
        </div>
        {content.cta?.href && content.cta?.label ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button size="lg" asChild>
              <Link href={content.cta.href}>
                {content.cta.label}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
