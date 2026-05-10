<?php

namespace App\Http\Controllers\Api;

use App\Models\Portfolio;
use App\Models\PortfolioImage;
use App\Http\Resources\PortfolioResource;
use App\Http\Resources\PortfolioImageResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PortfolioController extends ApiController
{
    /**
     * Get all portfolios for the current handyman.
     */
    public function index(Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;

        if (!$handyman) {
            return $this->error('Handyman profile not found.', 404);
        }

        $portfolios = $handyman->portfolios()
            ->with(['images', 'thumbnail'])
            ->orderBy('order')
            ->get();

        return $this->success(PortfolioResource::collection($portfolios));
    }

    /**
     * Create a new portfolio project with images.
     */
    public function store(Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;

        if (!$handyman) {
            return $this->error('Handyman profile not found.', 404);
        }

        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'images'      => 'required|array|min:1|max:8',
            'images.*'    => 'image|mimes:jpeg,png,jpg|max:5120',
        ]);

        return DB::transaction(function () use ($request, $handyman) {
            $maxOrder = $handyman->portfolios()->max('order') ?? 0;

            $portfolio = $handyman->portfolios()->create([
                'title'       => $request->title,
                'description' => $request->description,
                'order'       => $maxOrder + 1,
            ]);

            foreach ($request->file('images') as $index => $imageFile) {
                $path = $imageFile->store('portfolios', 'public');
                $portfolio->images()->create([
                    'image_url'    => $path,
                    'is_thumbnail' => $index === 0, // Set first image as thumbnail by default
                    'order'        => $index + 1,
                ]);
            }

            $portfolio->load(['images', 'thumbnail']);

            return $this->success(new PortfolioResource($portfolio), 'Portfolio project created successfully.', 201);
        });
    }

    /**
     * Update portfolio project details.
     */
    public function update(int $id, Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;
        $portfolio = Portfolio::where('id', $id)->where('handyman_id', $handyman->id)->first();

        if (!$portfolio) {
            return $this->error('Portfolio not found.', 404);
        }

        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $portfolio->update($request->only(['title', 'description']));

        return $this->success(new PortfolioResource($portfolio), 'Portfolio updated successfully.');
    }

    /**
     * Add more images to an existing portfolio.
     */
    public function addImages(int $id, Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;
        $portfolio = Portfolio::where('id', $id)->where('handyman_id', $handyman->id)->first();

        if (!$portfolio) {
            return $this->error('Portfolio not found.', 404);
        }

        $request->validate([
            'images'   => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $currentCount = $portfolio->images()->count();
        $newCount = count($request->file('images'));

        if ($currentCount + $newCount > 8) {
            return $this->error("You can only add " . (8 - $currentCount) . " more image(s) to this portfolio. (Max 8 total)", 422);
        }

        $maxOrder = $portfolio->images()->max('order') ?? 0;
        $hasThumbnail = $portfolio->images()->where('is_thumbnail', true)->exists();

        foreach ($request->file('images') as $index => $imageFile) {
            $path = $imageFile->store('portfolios', 'public');
            $portfolio->images()->create([
                'image_url'    => $path,
                'is_thumbnail' => !$hasThumbnail && $index === 0,
                'order'        => $maxOrder + $index + 1,
            ]);
        }

        $portfolio->load(['images', 'thumbnail']);

        return $this->success(new PortfolioResource($portfolio), 'Images added successfully.');
    }

    /**
     * Set a specific image as the portfolio thumbnail.
     */
    public function setThumbnail(int $imageId, Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;
        $image = PortfolioImage::where('id', $imageId)
            ->whereHas('portfolio', fn($q) => $q->where('handyman_id', $handyman->id))
            ->first();

        if (!$image) {
            return $this->error('Image not found.', 404);
        }

        DB::transaction(function () use ($image) {
            // Unset current thumbnail
            PortfolioImage::where('portfolio_id', $image->portfolio_id)
                ->update(['is_thumbnail' => false]);

            // Set new thumbnail
            $image->update(['is_thumbnail' => true]);
        });

        return $this->success(null, 'Thumbnail updated successfully.');
    }

    /**
     * Delete a specific image from a portfolio.
     */
    public function deleteImage(int $imageId, Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;
        $image = PortfolioImage::where('id', $imageId)
            ->whereHas('portfolio', fn($q) => $q->where('handyman_id', $handyman->id))
            ->first();

        if (!$image) {
            return $this->error('Image not found.', 404);
        }

        $portfolioId = $image->portfolio_id;
        $wasThumbnail = $image->is_thumbnail;

        Storage::disk('public')->delete($image->image_url);
        $image->delete();

        // If we deleted the thumbnail, assign a new one if images remain
        if ($wasThumbnail) {
            $nextImage = PortfolioImage::where('portfolio_id', $portfolioId)->orderBy('order')->first();
            if ($nextImage) {
                $nextImage->update(['is_thumbnail' => true]);
            }
        }

        return $this->success(null, 'Image deleted successfully.');
    }

    /**
     * Delete an entire portfolio project.
     */
    public function destroy(int $id, Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;
        $portfolio = Portfolio::where('id', $id)->where('handyman_id', $handyman->id)->first();

        if (!$portfolio) {
            return $this->error('Portfolio not found.', 404);
        }

        // Delete all image files from storage
        foreach ($portfolio->images as $image) {
            Storage::disk('public')->delete($image->image_url);
        }

        $portfolio->delete();

        return $this->success(null, 'Portfolio project deleted successfully.');
    }

    /**
     * Update the display order of portfolio projects.
     */
    public function reorder(Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;

        if (!$handyman) {
            return $this->error('Handyman profile not found.', 404);
        }

        $request->validate([
            'order'   => 'required|array',
            'order.*' => 'exists:portfolios,id',
        ]);

        $ids = $request->order;
        foreach ($ids as $index => $id) {
            Portfolio::where('id', $id)
                ->where('handyman_id', $handyman->id)
                ->update(['order' => $index + 1]);
        }

        return $this->success(null, 'Portfolio order updated successfully.');
    }
}
