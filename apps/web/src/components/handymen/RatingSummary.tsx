"use client";

import { Star } from "lucide-react";

interface RatingSummaryProps {
  ratingAvg: string | number;
  reviewCount: number;
  compact?: boolean;
}

export function RatingSummary({ ratingAvg, reviewCount, compact = false }: RatingSummaryProps) {
  const rating = typeof ratingAvg === "string" ? parseFloat(ratingAvg) : ratingAvg;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const renderStars = () => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${compact ? "w-4 h-4" : "w-5 h-5"} fill-secondary text-secondary`} />
      ))}
      {hasHalfStar && (
        <div className={`relative ${compact ? "w-4 h-4" : "w-5 h-5"}`}>
          <Star className={`absolute inset-0 ${compact ? "w-4 h-4" : "w-5 h-5"} text-muted-foreground/30`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${compact ? "w-4 h-4" : "w-5 h-5"} fill-secondary text-secondary`} />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-muted-foreground/30`} />
      ))}
    </div>
  );

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {renderStars()}
        <span className="text-sm font-bold text-primary">{rating.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="text-5xl font-heading font-bold text-primary">{rating.toFixed(1)}</div>
        <div className="text-xs text-muted-foreground mt-1">out of 5</div>
      </div>
      <div className="flex flex-col gap-1">
        {renderStars()}
        <span className="text-sm text-muted-foreground">{reviewCount} reviews</span>
      </div>
    </div>
  );
}
