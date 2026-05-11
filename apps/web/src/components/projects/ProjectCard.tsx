"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Images, ExternalLink, MapPin, User } from "lucide-react";
import { PublicProjectDetailsModal } from "./PublicProjectDetailsModal";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PortfolioImage {
  id: number;
  image_url: string;
  is_thumbnail: boolean;
}

interface Handyman {
  id: number;
  name: string;
  slug: string;
  photo_profile: string;
  city?: { name: string };
  province?: { name: string };
}

interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail?: PortfolioImage;
  images?: PortfolioImage[];
  handyman?: Handyman;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("projects");
  const common = useTranslations("common");

  const thumbnailSrc = project.thumbnail?.image_url || "/images/featured-project.png";
  const handymanName = project.handyman?.name || "Professional Handyman";
  const totalImages = project.images?.length || (project.thumbnail ? 1 : 0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="group overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col p-0 border-none">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={thumbnailSrc}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white hover:text-primary transition-all active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              {t("viewProject")}
            </button>
          </div>
          
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-primary font-bold rounded-full px-3 py-1 border-none shadow-sm flex items-center gap-1.5">
              <Images className="w-3.5 h-3.5" />
              {totalImages}
            </Badge>
          </div>
        </div>

        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          <h3 className="font-heading font-bold text-lg sm:text-xl text-primary mb-2 sm:mb-3 line-clamp-1 group-hover:text-secondary transition-colors">
            {project.title}
          </h3>
          
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-4 sm:mb-6 flex-1">
            {project.description || "Project showcase by " + handymanName}
          </p>

          <Separator className="mb-4 sm:mb-6 opacity-50" />

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-muted border border-border/40">
                {project.handyman?.photo_profile ? (
                  <img src={project.handyman.photo_profile} className="w-full h-full object-cover" alt={handymanName} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-medium uppercase leading-none mb-0.5 sm:mb-1">oleh</span>
                <span className="text-xs sm:text-sm font-bold text-primary line-clamp-1">{handymanName}</span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground font-bold uppercase">
                <MapPin className="w-2.5 h-2.5 sm:w-3 h-3" />
                {project.handyman?.city?.name || "Multiple"}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <PublicProjectDetailsModal 
        project={project}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </motion.div>
  );
}
