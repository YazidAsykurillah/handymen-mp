<?php

namespace App\Observers;

use App\Models\Review;

class ReviewObserver
{
    public function saved(Review $review): void
    {
        $this->updateRatingCache($review);
    }

    public function deleted(Review $review): void
    {
        $this->updateRatingCache($review);
    }

    public function restored(Review $review): void
    {
        $this->updateRatingCache($review);
    }

    public function forceDeleted(Review $review): void
    {
        $this->updateRatingCache($review);
    }

    private function updateRatingCache(Review $review): void
    {
        $handyman = $review->handyman;

        if ($handyman) {
            $handyman->update([
                'rating_avg'   => $handyman->approvedReviews()->avg('rating') ?? 0,
                'review_count' => $handyman->approvedReviews()->count(),
            ]);
        }
    }
}
