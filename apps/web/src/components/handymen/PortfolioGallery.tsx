"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useTranslations } from "next-intl";

interface PortfolioImage {
  id: number;
  image_url: string;
  caption: string | null;
  is_thumbnail: boolean;
  order: number;
}

interface Portfolio {
  id: number;
  title: string;
  description: string | null;
  images: PortfolioImage[];
  thumbnail: PortfolioImage | null;
}

interface PortfolioGalleryProps {
  portfolios: Portfolio[];
}

export function PortfolioGallery({ portfolios }: PortfolioGalleryProps) {
  const t = useTranslations("handyman");
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-border bg-muted/30">
        <p className="text-muted-foreground">{t("noPortfolio")}</p>
      </div>
    );
  }

  const activeProject = activeProjectIndex !== null ? portfolios[activeProjectIndex] : null;

  const goNext = () => {
    if (activeProject) {
      setImageIndex((imageIndex + 1) % activeProject.images.length);
    }
  };

  const goPrev = () => {
    if (activeProject) {
      setImageIndex((imageIndex - 1 + activeProject.images.length) % activeProject.images.length);
    }
  };

  return (
    <>
      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {portfolios.map((project, index) => (
          <motion.div
            key={project.id}
            whileHover={{ y: -4 }}
            className="flex flex-col group cursor-pointer"
            onClick={() => {
              setActiveProjectIndex(index);
              setImageIndex(0);
            }}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 shadow-sm border border-border/40">
              <img
                src={project.thumbnail?.image_url || "/images/placeholder.png"}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  View Project
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm flex items-center gap-1">
                <Images className="w-3 h-3" />
                {project.images.length}
              </div>
            </div>
            <h4 className="font-heading font-bold text-base group-hover:text-primary transition-colors">
              {project.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {project.description || "Project Gallery"}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeProjectIndex !== null && activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
            onClick={() => setActiveProjectIndex(null)}
          >
            {/* Header Info */}
            <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/50 to-transparent">
              <div className="text-white">
                <h3 className="font-heading font-bold text-xl">{activeProject.title}</h3>
                <p className="text-sm text-white/60">{activeProject.description}</p>
              </div>
              <button
                onClick={() => setActiveProjectIndex(null)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Prev Button */}
            {activeProject.images.length > 1 && (
              <button
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all z-10 hover:scale-110 active:scale-90"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Next Button */}
            {activeProject.images.length > 1 && (
              <button
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all z-10 hover:scale-110 active:scale-90"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Image Container */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeProject.id}-${imageIndex}`}
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center max-w-full"
                >
                  <img
                    src={activeProject.images[imageIndex].image_url}
                    alt={activeProject.images[imageIndex].caption || activeProject.title}
                    className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
                  />
                  {activeProject.images[imageIndex].caption && (
                    <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl mt-6 border border-white/10">
                      <p className="text-white text-sm text-center">
                        {activeProject.images[imageIndex].caption}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 px-3 py-1 rounded-full bg-white/10 text-white/40 text-[10px] font-bold">
                    {imageIndex + 1} / {activeProject.images.length}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-10 inset-x-0 flex justify-center gap-2 overflow-x-auto p-4 z-20">
              {activeProject.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={(e) => { e.stopPropagation(); setImageIndex(idx); }}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    idx === imageIndex ? "border-primary scale-110 shadow-lg shadow-primary/20" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img.image_url} className="w-full h-full object-cover" alt="Thumbnail" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
