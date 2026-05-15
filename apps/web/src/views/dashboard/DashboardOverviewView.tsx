"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import PermissionGuard from "@/components/auth/PermissionGuard";
import {
  Compass,
  Star,
  CheckCircle2,
  Images,
  TrendingUp,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HandymanStats {
  portfolio_count: number;
  review_count: number;
  rating_avg: number;
  is_verified: boolean;
  profile_completeness: number;
}

export default function DashboardOverviewView() {
  const t = useTranslations("dashboard");
  const user = useAuthStore((s) => s.user);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["handyman-stats"],
    queryFn: async () => {
      const res = await apiClient.get("/handyman/stats");
      return res.data.data as HandymanStats;
    },
    enabled: !!user?.roles?.includes("handyman"),
  });

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">
          {t("welcomeBack")}, {user.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* 
        ========================================================
        USER DASHBOARD (Requires user role/permission)
        ========================================================
      */}
      <PermissionGuard role="user">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-border/40">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-secondary/10 rounded-xl">
                <Compass className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-xl font-heading font-semibold">{t("exploreCategories")}</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Need something fixed? Browse our verified professionals across dozens of categories.
            </p>
            <Link href="/explore">
              <Button className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
                {t("exploreCategories")} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-border/40">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-heading font-semibold">{t("recentReviews")}</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              You haven't left any reviews recently.
            </p>
            <Link href="/dashboard/reviews">
              <Button variant="outline" className="w-full sm:w-auto border-border">
                {t("myReviews")}
              </Button>
            </Link>
          </div>
        </div>
      </PermissionGuard>

      {/* 
        ========================================================
        HANDYMAN DASHBOARD (Requires handyman role/permission)
        ========================================================
      */}
      <PermissionGuard role="handyman">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-3 mb-8">
            <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-border/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-muted-foreground">{t("profileCompleteness")}</h3>
                <CheckCircle2 className={`w-5 h-5 ${stats?.profile_completeness === 100 ? 'text-green-500' : 'text-amber-500'}`} />
              </div>
              <div className="text-3xl font-heading font-bold text-primary mb-2">
                {stats?.profile_completeness || 0}%
              </div>
              <Link href="/dashboard/profile" className="text-sm text-secondary hover:underline font-medium flex items-center">
                {t("completeProfile")} <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-border/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-muted-foreground">{t("portfolioCount")}</h3>
                <Images className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-heading font-bold text-primary mb-2">
                {stats?.portfolio_count || 0}
              </div>
              <Link href="/dashboard/portfolios" className="text-sm text-secondary hover:underline font-medium flex items-center">
                {t("addPortfolio")} <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-border/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-muted-foreground">Rating Average</h3>
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-heading font-bold text-primary mb-2">
                {stats?.rating_avg || 0}
              </div>
              <p className="text-sm text-muted-foreground">Based on {stats?.review_count || 0} reviews</p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border/40 overflow-hidden">
          <div className="p-6 border-b border-border/40 flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              {t("recentReviews")}
            </h2>
          </div>
          <div className="p-8 text-center text-muted-foreground">
            {t("noReviewsYet")}
          </div>
        </div>
      </PermissionGuard>
    </div>
  );
}
