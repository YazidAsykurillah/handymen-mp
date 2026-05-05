<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\District;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class DistrictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Increase memory limit and execution time as this might take a while
        ini_set('memory_limit', '512M');
        set_time_limit(0);

        $cities = City::all();

        foreach ($cities as $city) {
            $response = Http::get("https://api-regional-indonesia.vercel.app/api/districts/{$city->id}");

            if ($response->successful()) {
                $districts = $response->json('data');
                if ($districts) {
                    foreach ($districts as $district) {
                        District::updateOrCreate(
                            ['id' => $district['id']],
                            [
                                'city_id' => $city->id,
                                'name' => $district['name'],
                            ]
                        );
                    }
                }
            }
        }
    }
}
