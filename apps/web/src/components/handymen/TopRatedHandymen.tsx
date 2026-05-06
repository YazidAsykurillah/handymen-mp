"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HandymanCard } from "@/components/handymen/HandymanCard";
import { Link } from "@/i18n/navigation";

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
  province?: { name: string };
  categories?: Category[];
}

interface TopRatedHandymenProps {
  initialHandymen?: Handyman[];
}

export function TopRatedHandymen({ initialHandymen }: TopRatedHandymenProps) {
  const tr = useTranslations("home.topRatedSection");

  const { data: handymen, isLoading: isHandymenLoading } = useQuery<Handyman[]>({
    queryKey: ["handymen", 12, "top-rated"],
    queryFn: async () => {
      const response = await apiClient.get("/handymen?per_page=12&rating_min=4&sort=rating_avg&order=desc");
      return response.data.data as Handyman[];
    },
    initialData: initialHandymen,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <section className="py-20 px-6 md:px-16 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">{tr("title")}</h2>
            <p className="text-muted-foreground text-base">
              {tr("subtitle")}
            </p>
          </div>
          <Link href="/explore?sort=rating_avg&order=desc">
            <Button variant="outline" className="rounded-full px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all">
              {tr("ctaViewAll")}
            </Button>
          </Link>
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
  );
}
