"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, MapPin, Zap, ThermometerSnowflake, PaintRoller, Search, Loader2, Star, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { HandymanCard } from "@/components/handyman/HandymanCard";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

interface Handyman {
  id: number;
  name: string;
  slug: string;
  photo_profile: string;
  rating_avg: string;
  review_count: number;
  is_verified: boolean;
  is_premium: boolean;
  city?: { name: string };
  categories?: Category[];
}

interface HomeViewProps {
  initialCategories?: Category[];
  initialHandymen?: Handyman[];
}

const ICON_MAP: Record<string, any> = {
  zap: Zap,
  wrench: Wrench,
  thermometer: ThermometerSnowflake,
  paint: PaintRoller,
  electricity: Zap,
  plumbing: Wrench,
  hvac: ThermometerSnowflake,
  painting: PaintRoller,
};

export default function HomeView({ initialCategories, initialHandymen }: HomeViewProps) {
  const t = useTranslations("home.hero");

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get("/categories");
      return response.data.data as Category[];
    },
    initialData: initialCategories,
  });

  const { data: handymen, isLoading: isHandymenLoading } = useQuery<Handyman[]>({
    queryKey: ["handymen", 12, "top-rated"],
    queryFn: async () => {
      const response = await apiClient.get("/handymen?per_page=12&rating_min=4&sort=rating_avg&order=desc");
      return response.data.data as Handyman[];
    },
    initialData: initialHandymen,
  });

  return (
    <main className="flex-1 flex flex-col bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-24 flex flex-col items-center justify-center text-center px-6 md:px-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-primary max-w-4xl tracking-tight leading-tight mb-6">
          {t("title")}
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mb-12">
          {t("subtitle")}
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border p-2 flex flex-col md:flex-row items-center gap-2 relative z-10">
          <div className="flex-1 flex items-center gap-3 px-6 w-full border-b md:border-b-0 md:border-r border-border py-3 md:py-0">
            <Wrench className="w-5 h-5 text-muted-foreground shrink-0" />
            <Input
              className="border-none shadow-none focus-visible:ring-0 px-0 bg-transparent text-foreground placeholder:text-muted-foreground text-base h-auto"
              placeholder={t("searchPlaceholder")}
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-6 w-full py-3 md:py-0">
            <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
            <Input
              className="border-none shadow-none focus-visible:ring-0 px-0 bg-transparent text-foreground placeholder:text-muted-foreground text-base h-auto"
              placeholder={t("locationPlaceholder")}
            />
          </div>
          <Button className="w-full md:w-auto rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-7 text-base font-semibold shadow-md shrink-0 flex items-center gap-2">
            <Search className="w-4 h-4" />
            {t("ctaSearch")}
          </Button>
        </div>
      </section>

      {/* All Categories */}
      <section className="py-16 px-6 md:px-16">
        <div className="container mx-auto">
          <h2 className="text-4xl font-heading font-bold text-center text-primary mb-12">All Categories</h2>

          {(isCategoriesLoading && !categories) ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories?.map((c) => {
                const Icon = ICON_MAP[c.icon || ""] || Zap;
                return (
                  <Card key={c.id} className="flex flex-col items-center justify-center p-10 rounded-[1.5rem] bg-white border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="font-heading font-semibold text-xl text-primary">{c.name}</span>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Top Rated Handymen */}
      <section className="py-20 px-6 md:px-16 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-heading font-bold text-primary mb-4">Top Rated Handymen</h2>
              <p className="text-muted-foreground text-lg">
                Discover the elite of our marketplace. Verified professionals with consistent 5-star delivery.
              </p>
            </div>
            <Button variant="outline" className="rounded-full px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all">
              View All Professionals
            </Button>
          </div>


          {isHandymenLoading && !handymen ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {handymen?.map((h) => (
                <HandymanCard key={h.id} handyman={h} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Project */}
      <section className="pb-20 px-6 md:px-16 pt-10">
        <div className="container mx-auto">
          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[450px] shadow-xl">
            <Image
              src="/images/featured-project.png"
              alt="Featured Project: Precision Installation"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 sm:p-12 md:p-16 max-w-3xl">
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary mb-6 border-none rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm">
                Featured Project
              </Badge>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
                Precision Installation
              </h3>
              <p className="text-white/80 text-base sm:text-lg md:text-xl leading-relaxed">
                Experience the difference of white-glove service for your next home upgrade.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
