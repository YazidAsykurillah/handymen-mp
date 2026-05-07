"use client";

import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ReviewCardProps {
  review: {
    id: number;
    rating: number;
    comment: string;
    reviewer_name: string;
    created_at: string;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const date = new Date(review.created_at);
  const formattedDate = date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Generate initials for the avatar
  const initials = review.reviewer_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-primary">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-heading font-semibold text-primary truncate">
              {review.reviewer_name}
            </h4>
            <span className="text-xs text-muted-foreground shrink-0 ml-4">
              {formattedDate}
            </span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < review.rating
                    ? "fill-secondary text-secondary"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
