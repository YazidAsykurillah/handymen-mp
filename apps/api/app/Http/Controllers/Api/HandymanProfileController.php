<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\HandymanResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;


class HandymanProfileController extends ApiController
{
    /**
     * Get the authenticated handyman's profile.
     */
    public function show(Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;

        if (!$handyman) {
            return $this->error('Handyman profile not found.', 404);
        }

        $handyman->load(['city', 'province', 'categories']);

        return $this->success(new HandymanResource($handyman));
    }

    /**
     * Get dashboard statistics for the authenticated handyman.
     */
    public function stats(Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;

        if (!$handyman) {
            return $this->error('Handyman profile not found.', 404);
        }

        $stats = [
            'portfolio_count' => $handyman->portfolios()->count(),
            'review_count'    => $handyman->reviews()->count(),
            'rating_avg'      => (float) $handyman->rating_avg,
            'is_verified'     => $handyman->is_verified,
            'profile_completeness' => $this->calculateCompleteness($handyman),
        ];

        return $this->success($stats);
    }

    /**
     * Calculate profile completeness percentage.
     */
    private function calculateCompleteness($handyman): int
    {
        $fields = [
            'bio', 'province_id', 'city_id', 'address', 'photo_profile'
        ];
        
        $completed = 0;
        foreach ($fields as $field) {
            if (!empty($handyman->$field)) {
                $completed++;
            }
        }
        
        if ($handyman->categories()->exists()) {
            $completed++;
        }
        
        return round(($completed / (count($fields) + 1)) * 100);
    }

    /**
     * Update the authenticated handyman's profile.
     */
    public function update(Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;

        if (!$handyman) {
            return $this->error('Handyman profile not found.', 404);
        }

        if ($request->has('whatsapp')) {
            $request->merge(['whatsapp' => preg_replace('/\s+/', '', $request->whatsapp)]);
        }

        $request->validate([
            'name'        => 'sometimes|string|max:255',
            'bio'         => 'sometimes|string',
            'whatsapp'    => [
                'sometimes',
                'string',
                'max:20',
                Rule::unique('users', 'phone')->ignore($request->user()->id),
            ],
            'address'     => 'sometimes|string|max:255',
            'latitude'    => 'sometimes|numeric',
            'longitude'   => 'sometimes|numeric',
            'province_id' => 'sometimes|exists:provinces,id',
            'city_id'     => 'sometimes|exists:cities,id',
            'district_id' => 'sometimes|exists:districts,id',
        ]);

        return DB::transaction(function () use ($request, $handyman) {
            $data = $request->all();
            if ($request->has('whatsapp')) {
                $whatsapp = $request->whatsapp;
                $data['phone'] = $whatsapp;
                
                $user = $request->user();
                $user->phone = $whatsapp;
                $user->save();
            }

            $handyman->update($data);

            return $this->success(new HandymanResource($handyman), 'Profile updated successfully.');
        });
    }

    /**
     * Upload or replace profile photo.
     */
    public function uploadPhoto(Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;

        if (!$handyman) {
            return $this->error('Handyman profile not found.', 404);
        }

        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Delete old photo if exists
        if ($handyman->photo_profile) {
            Storage::disk('public')->delete($handyman->photo_profile);
        }

        $path = $request->file('photo')->store('photos', 'public');
        $handyman->update(['photo_profile' => $path]);

        return $this->success([
            'photo_profile' => Storage::disk('public')->url($path),
        ], 'Profile photo updated successfully.');
    }

    /**
     * Remove the profile photo.
     */
    public function deletePhoto(Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;

        if (!$handyman) {
            return $this->error('Handyman profile not found.', 404);
        }

        if ($handyman->photo_profile) {
            Storage::disk('public')->delete($handyman->photo_profile);
            $handyman->update(['photo_profile' => null]);
        }

        return $this->success(null, 'Profile photo removed successfully.');
    }

    /**
     * Sync categories for the handyman.
     */
    public function syncCategories(Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;

        if (!$handyman) {
            return $this->error('Handyman profile not found.', 404);
        }

        $request->validate([
            'categories'   => 'required|array',
            'categories.*' => 'exists:categories,id',
        ]);

        $handyman->categories()->sync($request->categories);

        $handyman->load('categories');

        return $this->success([
            'categories' => $handyman->categories->map(fn($c) => [
                'id'   => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
            ]),
        ], 'Categories updated successfully.');
    }
}
