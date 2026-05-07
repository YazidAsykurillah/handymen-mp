"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Portfolio {
  id: number;
  photo_url: string;
  caption: string | null;
  order: number;
}

interface PortfolioGalleryProps {
  portfolios: Portfolio[];
}

export function PortfolioGallery({ portfolios }: PortfolioGalleryProps) {
  const t = useTranslations("handyman");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-border bg-muted/30">
        <p className="text-muted-foreground">{t("noPortfolio")}</p>
      </div>
    );
  }

  const goNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % portfolios.length);
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + portfolios.length) % portfolios.length);
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {portfolios.map((item, index) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={item.photo_url}
              alt={item.caption || "Portfolio"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Caption Overlay */}
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs font-medium truncate">{item.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Prev Button */}
            {portfolios.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 md:left-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Next Button */}
            {portfolios.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 md:right-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={portfolios[selectedIndex].photo_url}
                alt={portfolios[selectedIndex].caption || "Portfolio"}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg"
              />
              {portfolios[selectedIndex].caption && (
                <p className="text-white/80 text-sm mt-4 text-center">
                  {portfolios[selectedIndex].caption}
                </p>
              )}
              <p className="text-white/40 text-xs mt-2">
                {selectedIndex + 1} / {portfolios.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
