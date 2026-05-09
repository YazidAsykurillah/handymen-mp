<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\HandymanResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
     * Update the authenticated handyman's profile.
     */
    public function update(Request $request): JsonResponse
    {
        $handyman = $request->user()->handyman;

        if (!$handyman) {
            return $this->error('Handyman profile not found.', 404);
        }

        $request->validate([
            'name'        => 'sometimes|string|max:255',
            'bio'         => 'sometimes|string',
            'whatsapp'    => 'sometimes|string|max:20',
            'address'     => 'sometimes|string|max:255',
            'latitude'    => 'sometimes|numeric',
            'longitude'   => 'sometimes|numeric',
            'province_id' => 'sometimes|exists:provinces,id',
            'city_id'     => 'sometimes|exists:cities,id',
            'district_id' => 'sometimes|exists:districts,id',
        ]);

        $data = $request->all();
        if ($request->has('whatsapp')) {
            $data['phone'] = $request->whatsapp;
        }

        $handyman->update($data);

        return $this->success(new HandymanResource($handyman), 'Profile updated successfully.');
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
