"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { apiClient } from "@/lib/api";
import {
  MapPin,
  CheckCircle2,
  Crown,
  Phone,
  MessageCircle,
  ChevronRight,
  Home,
  Loader2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RatingSummary } from "@/components/handymen/RatingSummary";
import { ReviewCard } from "@/components/handymen/ReviewCard";
import { PortfolioGallery } from "@/components/handymen/PortfolioGallery";
import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface PortfolioImage {
  id: number;
  image_url: string;
  caption: string | null;
  is_thumbnail: boolean;
  order: number;
}

interface Portfolio {
  id: number;
  title: string;
  description: string | null;
  images: PortfolioImage[];
  thumbnail: PortfolioImage | null;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  reviewer_name: string;
  created_at: string;
}

interface Handyman {
  id: number;
  name: string;
  slug: string;
  bio: string | null;
  phone: string | null;
  whatsapp: string | null;
  photo_profile: string | null;
  address: string | null;
  is_verified: boolean;
  is_premium: boolean;
  rating_avg: string;
  review_count: number;
  city?: { name: string };
  province?: { name: string };
  categories?: Category[];
  portfolios?: Portfolio[];
}

interface HandymanDetailViewProps {
  initialData: Handyman | null;
  slug: string;
}

export default function HandymanDetailView({ initialData, slug }: HandymanDetailViewProps) {
  const t = useTranslations("handyman");
  const ct = useTranslations("categories");
  const [reviewPage, setReviewPage] = useState(1);

  // Fetch handyman profile (only if SSR didn't provide data)
  const { data: handymanData } = useQuery({
    queryKey: ["handyman", slug],
    queryFn: async () => {
      const response = await apiClient.get(`/handymen/${slug}`);
      return response.data.data as Handyman;
    },
    enabled: !initialData,
    staleTime: 1000 * 60 * 5,
  });

  const handyman = initialData || handymanData;

  // Fetch reviews
  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["handyman-reviews", slug, reviewPage],
    queryFn: async () => {
      const response = await apiClient.get(
        `/handymen/${slug}/reviews?per_page=5&page=${reviewPage}`
      );
      return response.data;
    },
  });

  // Accumulate reviews across pages
  const [accumulatedReviews, setAccumulatedReviews] = useState<Review[]>([]);
  const reviewMeta = reviewsData?.meta;

  // When new review data arrives, merge it into accumulated list
  const currentPageReviews: Review[] = reviewsData?.data || [];

  // Accumulate reviews when loading subsequent pages
  useEffect(() => {
    if (reviewPage > 1 && currentPageReviews.length > 0) {
      setAccumulatedReviews((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newReviews = currentPageReviews.filter((r) => !existingIds.has(r.id));
        return newReviews.length > 0 ? [...prev, ...newReviews] : prev;
      });
    }
  }, [reviewsData]);

  const uniqueReviews = (() => {
    if (reviewPage === 1) return currentPageReviews;
    const all = [...accumulatedReviews, ...currentPageReviews];
    return Array.from(new Map(all.map((r) => [r.id, r])).values());
  })();

  if (!handyman) {
    return (
      <main className="flex-1 flex items-center justify-center py-32">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-primary mb-2">
            Handyman Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The profile you are looking for does not exist.
          </p>
          <Link href="/explore">
            <Button variant="outline" className="rounded-full">
              {t("backToExplore")}
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const profileSrc = handyman.photo_profile || "/images/placeholder-avatar.png";

  const whatsappUrl = handyman.whatsapp
    ? `https://wa.me/${handyman.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(t("whatsappMessage"))}`
    : null;

  const locationText = [handyman.city?.name, handyman.province?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="flex-1 flex flex-col bg-background">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 md:px-16 pt-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/explore" className="hover:text-primary transition-colors">
            Explore
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary font-medium truncate max-w-[200px]">
            {handyman.name}
          </span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-16 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full lg:w-80 shrink-0"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src={profileSrc}
                alt={handyman.name}
                className="w-full h-full object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {handyman.is_verified && (
                  <Badge className="bg-blue-500 text-white hover:bg-blue-600 gap-1.5 px-3 py-1 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t("verified")}
                  </Badge>
                )}
                {handyman.is_premium && (
                  <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary gap-1.5 px-3 py-1 rounded-full text-xs font-bold">
                    <Crown className="w-3.5 h-3.5" />
                    {t("premium")}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-1 flex flex-col"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-3">
              {handyman.name}
            </h1>

            {/* Location */}
            {locationText && (
              <p className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <span>{locationText}</span>
              </p>
            )}

            {/* Rating */}
            <div className="mb-6">
              <RatingSummary
                ratingAvg={handyman.rating_avg}
                reviewCount={handyman.review_count}
              />
            </div>

            {/* Categories */}
            {handyman.categories && handyman.categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  {t("services")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {handyman.categories.map((cat) => (
                    <Badge
                      key={cat.id}
                      variant="secondary"
                      className="bg-muted text-primary hover:bg-accent px-3 py-1.5 rounded-full text-xs font-semibold"
                    >
                      {ct(cat.slug)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {handyman.bio && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  {t("about")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{handyman.bio}</p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mt-auto pt-4">
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full gap-2 px-8 shadow-lg hover:shadow-xl transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {t("contactViaWhatsApp")}
                  </Button>
                </a>
              )}
              {handyman.phone && (
                <a href={`tel:${handyman.phone}`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full gap-2 px-8 border-2"
                  >
                    <Phone className="w-5 h-5" />
                    {handyman.phone}
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="container mx-auto px-6 md:px-16 pb-20">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Portfolio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-heading font-bold text-primary mb-6">
                {t("portfolio")}
              </h2>
              <PortfolioGallery portfolios={handyman.portfolios || []} />
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-heading font-bold text-primary mb-6">
                {t("reviews")} ({handyman.review_count})
              </h2>

              {isReviewsLoading && uniqueReviews.length === 0 ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                </div>
              ) : uniqueReviews.length === 0 ? (
                <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-border bg-muted/30">
                  <p className="text-muted-foreground">{t("noReviews")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uniqueReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}

                  {/* Load More Button */}
                  {reviewMeta?.current_page < reviewMeta?.last_page && (
                    <div className="text-center pt-4">
                      <Button
                        variant="outline"
                        className="rounded-full px-8"
                        onClick={() => setReviewPage((p) => p + 1)}
                        disabled={isReviewsLoading}
                      >
                        {isReviewsLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        {t("loadMore")}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sticky Sidebar (Desktop) */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-32">
              <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm">
                {/* Compact Rating */}
                <div className="mb-6 pb-6 border-b border-border">
                  <RatingSummary
                    ratingAvg={handyman.rating_avg}
                    reviewCount={handyman.review_count}
                    compact
                  />
                </div>

                {/* Location */}
                {locationText && (
                  <div className="mb-6 pb-6 border-b border-border">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      {t("location")}
                    </h4>
                    <p className="text-sm text-primary flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      {locationText}
                    </p>
                    {handyman.address && (
                      <p className="text-xs text-muted-foreground mt-1 ml-6">
                        {handyman.address}
                      </p>
                    )}
                  </div>
                )}

                {/* Categories */}
                {handyman.categories && handyman.categories.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-border">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                      {t("services")}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {handyman.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground bg-muted px-2 py-1 rounded"
                        >
                          {ct(cat.slug)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* WhatsApp CTA */}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full gap-2 shadow-lg hover:shadow-xl transition-all">
                      <MessageCircle className="w-4 h-4" />
                      {t("contactViaWhatsApp")}
                    </Button>
                  </a>
                )}
              </Card>
            </div>
          </aside>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      {whatsappUrl && (
        <div className="fixed bottom-0 inset-x-0 lg:hidden bg-white/80 backdrop-blur-lg border-t border-border p-4 z-40">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full gap-2 h-12 shadow-lg text-base">
              <MessageCircle className="w-5 h-5" />
              {t("contactViaWhatsApp")}
            </Button>
          </a>
        </div>
      )}
    </main>
  );
}
