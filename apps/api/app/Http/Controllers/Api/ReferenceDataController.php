<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Models\City;
use App\Models\Province;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CityResource;
use App\Http\Resources\ProvinceResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReferenceDataController extends ApiController
{
    /**
     * Get all categories.
     */
    public function categories()
    {
        $categories = Category::where('is_active', true)
            ->withCount('handymen')
            ->get();
        return CategoryResource::collection($categories);
    }

    /**
     * Get all provinces.
     */
    public function provinces()
    {
        $provinces = Province::all();
        return ProvinceResource::collection($provinces);
    }

    /**
     * Get all cities, optionally filtered by province.
     */
    public function cities(Request $request)
    {
        $query = City::with('province');

        if ($request->has('province_id')) {
            $query->where('province_id', $request->province_id);
        }

        $cities = $query->get();
        return CityResource::collection($cities);
    }
}
