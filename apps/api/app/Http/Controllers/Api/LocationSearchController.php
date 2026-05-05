<?php

namespace App\Http\Controllers\Api;

use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LocationSearchController extends ApiController
{
    /**
     * Search for locations (Province - City pairs).
     */
    public function search(Request $request): JsonResponse
    {
        $search = $request->get('q');
        
        $query = City::with('province');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('province', function($pq) use ($search) {
                      $pq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $locations = $query->limit(10)->get()->map(function($city) {
            return [
                'id' => "{$city->province_id}-{$city->id}",
                'province_id' => $city->province_id,
                'city_id' => $city->id,
                'province_name' => $city->province->name,
                'city_name' => $city->name,
                'display_name' => "{$city->province->name} - {$city->name}",
            ];
        });

        return response()->json([
            'data' => $locations
        ]);
    }
}
