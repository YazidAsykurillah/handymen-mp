<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PortfolioImageResource;

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
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'order'       => $this->order,
            'images'      => PortfolioImageResource::collection($this->whenLoaded('images')),
            'thumbnail'   => new PortfolioImageResource($this->whenLoaded('thumbnail')),
        ];
    }
}
