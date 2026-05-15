"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, MapPin, Zap, ThermometerSnowflake, PaintRoller, Search, Loader2, Star, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { HandymanCard } from "@/components/handymen/HandymanCard";
import { LocationAutocomplete } from "@/components/home/LocationAutocomplete";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { TopRatedHandymen } from "@/components/handymen/TopRatedHandymen";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  handymen_count?: number;
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
  province?: { name: string };
  categories?: Category[];
}

interface HomeViewProps {
  initialCategories?: Category[];
  initialHandymen?: Handyman[];
}



export default function HomeView({ initialCategories, initialHandymen }: HomeViewProps) {
  const t = useTranslations("home.hero");
  const ct = useTranslations("categories");
  const router = useRouter();

  // Search State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<{ province_id: number; city_id: number; district_id?: number | null } | null>(null);

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get("/categories");
      return response.data.data as Category[];
    },
    initialData: initialCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Determine the most popular category
  const maxHandymenCount = useMemo(() => {
    if (!categories || categories.length === 0) return 0;
    return Math.max(...categories.map(c => c.handymen_count || 0));
  }, [categories]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.append("category", selectedCategory);
    if (selectedLocation) {
      params.append("province_id", selectedLocation.province_id.toString());
      params.append("city_id", selectedLocation.city_id.toString());
      if (selectedLocation.district_id) {
        params.append("district_id", selectedLocation.district_id.toString());
      }
    }

    router.push(`/explore?${params.toString()}`);
  };

  return (
    <main className="flex-1 flex flex-col bg-background">
      {/* Hero Section */}
      <section className="pt-14 pb-20 flex flex-col items-center justify-center text-center px-6 md:px-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary max-w-4xl tracking-tight leading-tight mb-6">
          {t("title")}
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mb-12">
          {t("subtitle")}
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-4xl bg-white rounded-[2.5rem] md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border p-2 flex flex-col md:flex-row items-stretch md:items-center relative z-20 gap-1 md:gap-0">
          <div className="flex-1 flex items-center gap-3 px-6 w-full border-b md:border-b-0 md:border-r border-border py-4 md:py-0 md:h-[72px]">
            <Wrench className="w-5 h-5 text-muted-foreground shrink-0" />
            <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val || "all")}>
              <SelectTrigger className="border-none shadow-none focus:ring-0 p-0 bg-transparent text-foreground placeholder:text-muted-foreground text-base h-auto w-full flex justify-between">
                <SelectValue>
                  {selectedCategory === "all"
                    ? t("categoryPlaceholder")
                    : ct(selectedCategory)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>{ct(cat.slug)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 w-full px-6 py-4 md:py-0 md:h-[72px] flex items-center">
            <LocationAutocomplete
              onSelect={setSelectedLocation}
              placeholder={t("locationPlaceholder")}
              className="h-full"
            />
          </div>

          <Button
            onClick={handleSearch}
            className="w-full md:w-auto rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 md:py-8 text-base font-semibold shadow-md shrink-0 flex items-center justify-center gap-2 md:ml-2"
          >
            <Search className="w-4 h-4" />
            {t("ctaSearch")}
          </Button>
        </div>
      </section>

      {/* All Categories */}
      <section className="py-16 px-6 md:px-16">
        <div className="container mx-auto">
          <h2 className="text-4xl font-heading font-bold text-center text-primary mb-12">{t("allCategories")}</h2>

          {(isCategoriesLoading && !categories) ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
            </div>
          ) : (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {categories?.map((c) => (
                <motion.div
                  key={c.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <CategoryCard
                    category={{
                      ...c,
                      isPopular: (c.handymen_count || 0) > 0 && c.handymen_count === maxHandymenCount
                    }}
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.append("category", c.slug);
                      router.push(`/explore?${params.toString()}`);
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <TopRatedHandymen initialHandymen={initialHandymen} />

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
              <p className="text-white/80 text-sm sm:text-sm md:text-base leading-relaxed">
                Experience the difference of white-glove service for your next home upgrade.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
