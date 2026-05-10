<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PortfolioImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'image_url'    => $this->image_url ? Storage::disk('public')->url($this->image_url) : null,
            'caption'      => $this->caption,
            'is_thumbnail' => $this->is_thumbnail,
            'order'        => $this->order,
        ];
    }
}
