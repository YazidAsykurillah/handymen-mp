"use client";

import { Card } from "@/components/ui/card";
import { Zap, Wrench, ThermometerSnowflake, PaintRoller, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  zap: Zap,
  wrench: Wrench,
  thermometer: ThermometerSnowflake,
  paint: PaintRoller,
  electricity: Zap,
  plumbing: Wrench,
  hvac: ThermometerSnowflake,
  painting: PaintRoller,
};

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  className?: string;
}

export function CategoryCard({ category, onClick, className }: CategoryCardProps) {
  const ct = useTranslations("categories");
  const Icon = ICON_MAP[category.icon || ""] || Zap;

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-10 rounded-[2.5rem] bg-white border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group",
        className
      )}
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <span className="font-heading font-semibold text-xl text-primary group-hover:text-secondary transition-colors">
        {ct(category.slug)}
      </span>
    </Card>
  );
}
