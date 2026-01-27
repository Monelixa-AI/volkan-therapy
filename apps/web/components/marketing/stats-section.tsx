"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Heart, Users, Clock } from "lucide-react";
import type { HomeContent } from "@/lib/content-defaults";

const ICONS = {
  clock: Clock,
  users: Users,
  heart: Heart,
  award: Award
};

type StatsSectionProps = {
  items: HomeContent["stats"]["items"];
};

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const stepValue = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString("tr-TR")}
      {suffix}
    </span>
  );
}

export function StatsSection({ items }: StatsSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((stat, index) => {
            const Icon = ICONS[stat.icon as keyof typeof ICONS] ?? Clock;
            return (
              <motion.div
                key={`${stat.label}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div
                  className={`inline-flex p-3 rounded-full bg-white shadow-md mb-4 ${stat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <p className={`text-4xl font-bold ${stat.color} mb-2`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
