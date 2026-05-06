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

export function CategoryCard({ category, onClick, className }: CategoryCardProps) {
  const ct = useTranslations("categories");
  const Icon = ICON_MAP[category.slug] || Wrench;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-10 rounded-[2.5rem] bg-white border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative",
        className
      )}
    >
      {category.isPopular && (
        <Badge className="absolute top-6 right-6 bg-secondary text-secondary-foreground hover:bg-secondary font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
          Popular
        </Badge>
      )}
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <span className="font-heading font-semibold text-xl text-primary text-center">
        {ct(category.slug)}
      </span>
    </Card>
  );
}
