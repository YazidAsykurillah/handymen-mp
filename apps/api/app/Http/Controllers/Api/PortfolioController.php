<?php

namespace App\Http\Controllers\Api;

use App\Models\Portfolio;
use App\Http\Resources\PortfolioResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends ApiController
{
    /**
     * Upload a new portfolio photo.
     */
    public function store(Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;

        if (!$handyman) {
            return $this->error('Handyman profile not found.', 404);
        }

        $request->validate([
            'photo'   => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'caption' => 'nullable|string|max:255',
        ]);

        $path = $request->file('photo')->store('portfolios', 'public');

        $maxOrder = $handyman->portfolios()->max('order') ?? 0;

        $portfolio = $handyman->portfolios()->create([
            'photo_url' => $path,
            'caption'   => $request->caption,
            'order'     => $maxOrder + 1,
        ]);

        return $this->success(new PortfolioResource($portfolio), 'Portfolio photo uploaded successfully.', 201);
    }

    /**
     * Delete a portfolio photo.
     */
    public function destroy(int $id, Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;

        if (!$handyman) {
            return $this->error('Handyman profile not found.', 404);
        }

        $portfolio = Portfolio::find($id);

        if (!$portfolio) {
            return $this->error('Portfolio not found.', 404);
        }

        if ($portfolio->handyman_id !== $handyman->id) {
            return $this->error('This portfolio does not belong to you.', 403);
        }

        Storage::disk('public')->delete($portfolio->photo_url);
        $portfolio->delete();

        return $this->success(null, 'Portfolio photo deleted successfully.');
    }

    /**
     * Update the display order of portfolio photos.
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
