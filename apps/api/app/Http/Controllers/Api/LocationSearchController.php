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
        
        // Search Cities
        $cityQuery = \App\Models\City::with('province');
        if ($search) {
            $cityQuery->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('province', function($pq) use ($search) {
                      $pq->where('name', 'like', "%{$search}%");
                  });
            });
        }
        $cities = $cityQuery->limit(5)->get()->map(function($city) {
            return [
                'type' => 'city',
                'id' => "city-{$city->province_id}-{$city->id}",
                'province_id' => $city->province_id,
                'city_id' => $city->id,
                'district_id' => null,
                'province_name' => $city->province->name,
                'city_name' => $city->name,
                'district_name' => null,
                'display_name' => "{$city->province->name} - {$city->name}",
            ];
        });

        // Search Districts
        $districtQuery = \App\Models\District::with(['city.province']);
        if ($search) {
            $districtQuery->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('city', function($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%")
                        ->orWhereHas('province', function($pq) use ($search) {
                            $pq->where('name', 'like', "%{$search}%");
                        });
                  });
            });
        }
        $districts = $districtQuery->limit(5)->get()->map(function($district) {
            return [
                'type' => 'district',
                'id' => "district-{$district->city->province_id}-{$district->city_id}-{$district->id}",
                'province_id' => $district->city->province_id,
                'city_id' => $district->city_id,
                'district_id' => $district->id,
                'province_name' => $district->city->province->name,
                'city_name' => $district->city->name,
                'district_name' => $district->name,
                'display_name' => "{$district->city->province->name} - {$district->city->name} - {$district->name}",
            ];
        });

        return response()->json([
            'data' => $cities->concat($districts)->values()
        ]);
    }
}
