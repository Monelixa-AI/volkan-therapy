"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeContent } from "@/lib/content-defaults";

type TestimonialsSectionProps = {
  content: HomeContent["testimonials"];
};

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const testimonials = content.items;
  const videos = content.videos;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const total = testimonials.length;
  const safeIndex = total === 0 ? 0 : currentIndex % total;
  const current = useMemo(() => testimonials[safeIndex], [testimonials, safeIndex]);

  const nextTestimonial = () => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevTestimonial = () => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

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
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 md:p-12 shadow-lg">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-primary-200" />
            {current ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={safeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <div className="flex justify-center mb-6">
                      {[...Array(current.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-8 font-display italic">
                      &ldquo;{current.content}&rdquo;
                    </blockquote>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">
                        {current.author} - {current.relation}
                      </p>
                      <p className="text-sm text-gray-500">
                        {current.location} • {current.date}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                        {current.serviceType}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="flex justify-center items-center mt-8 space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === safeIndex ? "bg-primary-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-10">
                Henüz yorum bulunamadi.
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-center mb-8">
            {content.videoTitle}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {videos.map((video, index) => {
              const isLocalVideo = video.videoUrl && (video.videoUrl.startsWith("/") || video.videoUrl.endsWith(".mp4"));
              const handleClick = () => {
                if (isLocalVideo) {
                  setActiveVideo(video.videoUrl);
                }
              };

              return (
                <motion.div
                  key={`${video.title}-${index}`}
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                  onClick={isLocalVideo ? handleClick : undefined}
                >
                  {!isLocalVideo && video.videoUrl ? (
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 block"
                    >
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-primary-500 ml-1" />
                        </div>
                      </div>
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600" />
                      )}
                      <p className="absolute bottom-4 left-4 text-white font-medium z-20">
                        {video.title}
                      </p>
                    </a>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-primary-500 ml-1" />
                        </div>
                      </div>
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600" />
                      )}
                      <p className="absolute bottom-4 left-4 text-white font-medium z-20">
                        {video.title}
                      </p>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Video Modal */}
        <AnimatePresence>
          {activeVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setActiveVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setActiveVideo(null)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
                <video
                  src={activeVideo}
                  controls
                  autoPlay
                  className="w-full rounded-xl"
                >
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
