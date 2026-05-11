"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Wrench,
  ThermometerSnowflake,
  PaintRoller,
  Hammer,
  Droplets,
  HardHat,
  Wind,
  Axe,
  Home,
  Grid,
  Sparkles,
  LucideIcon
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  "electrical": Zap,
  "plumbing": Droplets,
  "construction": HardHat,
  "painting": PaintRoller,
  "ac-repair": ThermometerSnowflake,
  "carpentry": Hammer,
  "roofing": Home,
  "tiling": Grid,
  "cleaning": Sparkles,
  "other": Wrench,
};

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  handymen_count?: number;
  isPopular?: boolean;
}

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  className?: string;
}

import { motion } from "framer-motion";

export function CategoryCard({ category, onClick, className }: CategoryCardProps) {
  const ct = useTranslations("categories");
  const Icon = ICON_MAP[category.slug] || Wrench;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="h-full"
    >
      <Card
        onClick={onClick}
        className={cn(
          "flex flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12 rounded-[1.5rem] sm:rounded-[2rem] bg-white border border-border shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer group relative h-full",
          className
        )}
      >
        {category.isPopular && (
          <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground hover:bg-secondary font-bold px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider">
            Popular
          </Badge>
        )}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-muted flex items-center justify-center mb-1 sm:mb-4 group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-500">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-secondary transition-colors" />
        </div>
        <span className="font-heading font-bold text-sm sm:text-base text-primary text-center group-hover:text-secondary transition-colors">
          {ct(category.slug)}
        </span>
      </Card>
    </motion.div>
  );
}
