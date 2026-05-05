<?php

namespace App\Http\Controllers\Api;

use App\Models\Handyman;
use App\Http\Resources\HandymanResource;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\PortfolioResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HandymanController extends ApiController
{
    /**
     * List all handymen with filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Handyman::with(['city', 'province', 'categories'])
            ->where('is_active', true);

        // Filtering
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->filled('province_id')) {
            $query->where('province_id', $request->province_id);
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->filled('district_id')) {
            $query->where('district_id', $request->district_id);
        }

        if ($request->boolean('is_verified')) {
            $query->where('is_verified', true);
        }

        if ($request->boolean('is_premium')) {
            $query->where('is_premium', true);
        }

        if ($request->filled('rating_min')) {
            $query->where('rating_avg', '>=', $request->rating_min);
        }

        // Sorting
        $sort = $request->get('sort', 'created_at');
        $order = $request->get('order', 'desc');

        $allowedSorts = ['rating_avg', 'review_count', 'created_at'];
        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $order === 'asc' ? 'asc' : 'desc');
        }

        $perPage = $request->get('per_page', 12);
        $handymen = $query->paginate($perPage);

        return $this->successPaginated(HandymanResource::collection($handymen));
    }

    /**
     * Show a specific handyman profile.
     */
    public function show(string $slug): JsonResponse
    {
        $handyman = Handyman::with(['city', 'province', 'categories', 'portfolios'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();

        if (!$handyman) {
            return $this->error('Handyman not found.', 404);
        }

        return $this->success(new HandymanResource($handyman));
    }

    /**
     * Get approved reviews for a handyman.
     */
    public function reviews(string $slug, Request $request): JsonResponse
    {
        $handyman = Handyman::where('slug', $slug)->first();

        if (!$handyman) {
            return $this->error('Handyman not found.', 404);
        }

        $perPage = $request->get('per_page', 10);
        $reviews = $handyman->approvedReviews()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $this->successPaginated(ReviewResource::collection($reviews));
    }

    /**
     * Get portfolios for a handyman.
     */
    public function portfolios(string $slug): JsonResponse
    {
        $handyman = Handyman::where('slug', $slug)->first();

        if (!$handyman) {
            return $this->error('Handyman not found.', 404);
        }

        $portfolios = $handyman->portfolios()->orderBy('order')->get();

        return $this->success(PortfolioResource::collection($portfolios));
    }
}
