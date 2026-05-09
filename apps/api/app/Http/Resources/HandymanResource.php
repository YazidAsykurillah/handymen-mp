<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class HandymanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'slug'          => $this->slug,
            'bio'           => $this->bio,
            'phone'         => $this->phone,
            'whatsapp'      => $this->whatsapp,
            'photo_profile' => $this->photo_profile 
                ? (filter_var($this->photo_profile, FILTER_VALIDATE_URL) ? $this->photo_profile : Storage::disk('public')->url($this->photo_profile)) 
                : null,
            'province_id'   => $this->province_id,
            'city_id'       => $this->city_id,
            'district_id'   => $this->district_id,
            'address'       => $this->address,
            'latitude'      => $this->latitude,
            'longitude'     => $this->longitude,
            'is_verified'   => $this->is_verified,
            'is_premium'    => $this->is_premium,
            'rating_avg'    => $this->rating_avg,
            'review_count'  => $this->review_count,
            'city'          => new CityResource($this->whenLoaded('city')),
            'province'      => new ProvinceResource($this->whenLoaded('province')),
            'district'      => new DistrictResource($this->whenLoaded('district')),
            'categories'    => CategoryResource::collection($this->whenLoaded('categories')),
            'portfolios'    => PortfolioResource::collection($this->whenLoaded('portfolios')),
        ];
    }
}
