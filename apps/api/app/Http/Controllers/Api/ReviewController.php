<?php

namespace App\Http\Controllers\Api;

use App\Models\Handyman;
use App\Models\Review;
use App\Http\Resources\ReviewResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends ApiController
{
    /**
     * Submit a review for a handyman.
     */
    public function store(string $slug, Request $request): JsonResponse
    {
        $handyman = Handyman::where('slug', $slug)->first();

        if (!$handyman) {
            return $this->error('Handyman not found.', 404);
        }

        $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10',
        ]);

        $review = Review::create([
            'user_id'     => $request->user()->id,
            'handyman_id' => $handyman->id,
            'rating'      => $request->rating,
            'comment'     => $request->comment,
            'is_approved' => false, // Requires admin approval
        ]);

        return $this->success(new ReviewResource($review), 'Review submitted successfully and is pending approval.', 201);
    }

    /**
     * Delete own review.
     */
    public function destroy(int $id, Request $request): JsonResponse
    {
        $review = Review::find($id);

        if (!$review) {
            return $this->error('Review not found.', 404);
        }

        if ($review->user_id !== $request->user()->id) {
            return $this->error('You are not authorized to delete this review.', 403);
        }

        $review->delete();

        return $this->success(null, 'Review deleted successfully.');
    }

    /**
     * Get reviews written by the authenticated user.
     */
    public function userReviews(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10);
        $reviews = Review::with('handyman')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $this->successPaginated(ReviewResource::collection($reviews));
    }
}
