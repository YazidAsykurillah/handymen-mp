<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PortfolioResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'photo_url' => $this->photo_url ? Storage::disk('public')->url($this->photo_url) : null,
            'caption'   => $this->caption,
            'order'     => $this->order,
        ];
    }
}
