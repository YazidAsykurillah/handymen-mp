"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { 
  X, 
  MapPin, 
  MessageCircle, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  User
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface PublicProjectDetailsModalProps {
  project: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PublicProjectDetailsModal({ 
  project, 
  open, 
  onOpenChange 
}: PublicProjectDetailsModalProps) {
  const t = useTranslations("projects");
  const ht = useTranslations("handyman");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!project) return null;

  const images = (project.images && project.images.length > 0) 
    ? project.images 
    : (project.thumbnail ? [project.thumbnail] : []);
    
  const currentImage = images[activeImageIndex];
  const handyman = project.handyman;

  const whatsappUrl = handyman?.whatsapp
    ? `https://wa.me/${handyman.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hi ${handyman.name}, I saw your project "${project.title}" on Handyman platform and I'm interested in your services.`
      )}`
    : null;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length === 0) return;
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length === 0) return;
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] lg:max-w-[1000px] w-full p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white max-h-[95vh] flex flex-col">
        <div className="flex flex-col lg:flex-row h-full w-full overflow-y-auto lg:overflow-hidden lg:h-[600px]">
          {/* Image Gallery Section */}
          <div className="relative w-full lg:min-w-[600px] lg:flex-1 bg-black flex items-center justify-center group overflow-hidden min-h-[300px] lg:h-full shrink-0">
            {/* Close Button (Mobile & Desktop Overlay) */}
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-all border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) > 50;
                  if (swipe && offset.x > 0) prevImage();
                  else if (swipe && offset.x < 0) nextImage();
                }}
              >
                <img
                  src={currentImage?.image_url}
                  alt={project.title}
                  className="w-full h-full object-contain select-none"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-all opacity-0 lg:group-hover:opacity-100 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-all opacity-0 lg:group-hover:opacity-100 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Counter Badge */}
            {images.length > 0 && (
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </div>
            )}

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 px-6 z-10">
                {images.map((img: any, idx: number) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? "border-white scale-110 shadow-lg shadow-black/50" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={img.image_url} className="w-full h-full object-cover" alt="Thumbnail" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-[400px] flex flex-col bg-white lg:overflow-y-auto shrink-0">
            <div className="p-8">
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest mb-3">
                  <span className="bg-secondary/10 px-2 py-0.5 rounded">Project Showcase</span>
                </div>
                <DialogTitle className="text-3xl font-heading font-bold text-primary leading-tight">
                  {project.title}
                </DialogTitle>
              </DialogHeader>

              <div className="prose prose-sm text-muted-foreground mb-10 leading-relaxed">
                {project.description || "No description provided for this project."}
              </div>

              <Separator className="mb-8 opacity-50" />

              {/* Handyman Info Card */}
              <div className="bg-muted/30 rounded-3xl p-6 border border-border/40 mb-8">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Completed By</h4>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-sm ring-2 ring-white">
                    {handyman?.photo_profile ? (
                      <img src={handyman.photo_profile} className="w-full h-full object-cover" alt={handyman.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-heading font-bold text-primary text-lg">{handyman?.name || "Professional Handyman"}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {handyman?.city?.name || "Multiple Locations"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {whatsappUrl && (
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl gap-2 h-12 shadow-lg shadow-green-600/10 transition-all active:scale-95">
                        <MessageCircle className="w-5 h-5" />
                        {ht("contactViaWhatsApp")}
                      </Button>
                    </a>
                  )}
                  <Link href={`/handymen/${handyman?.slug}`} className="block">
                    <Button variant="outline" className="w-full rounded-2xl gap-2 h-12 border-border/60 hover:bg-white hover:border-primary/20 hover:text-primary transition-all active:scale-95">
                      <ExternalLink className="w-4 h-4" />
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>

              <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-tighter">
                Ref: {project.id} • Posted on {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
