import { motion } from "framer-motion";
import { Star, MapPin, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Card } from "@/components/ui/card";
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

interface HandymanCardProps {
  handyman: Handyman;
}

export function HandymanCard({ handyman }: HandymanCardProps) {
  const ct = useTranslations("categories");
  const profileSrc = handyman.photo_profile || "/images/placeholder-avatar.png";

  return (
    <Link href={`/handymen/${handyman.slug}`}>
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-full"
      >
        <Card className="group overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 h-full flex flex-col p-0 gap-0">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={profileSrc}
              alt={handyman.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {handyman.is_premium && (
              <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                Premium
              </div>
            )}
          </div>
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <span className="font-bold text-sm">{handyman.rating_avg}</span>
                <span className="text-muted-foreground text-xs">({handyman.review_count})</span>
              </div>
              {handyman.is_verified && (
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <h4 className="font-heading font-bold text-lg sm:text-xl text-primary mb-2 truncate">
              {handyman.name}
            </h4>
            {handyman.province?.name && handyman.city?.name && (
              <p className="text-muted-foreground text-[13px] flex items-start gap-1 mb-4 leading-tight">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-secondary" />
                <span>{handyman.province.name} - {handyman.city.name}</span>
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-auto">
              {handyman.categories?.slice(0, 3).map((cat) => (
                <span key={cat.id} className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground bg-muted px-2 py-1 rounded">
                  {ct(cat.slug)}
                </span>
              ))}
              {handyman.categories && handyman.categories.length > 3 && (
                <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  +{handyman.categories.length - 3}
                </span>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
