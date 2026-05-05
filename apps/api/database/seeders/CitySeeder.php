<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Province;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provinces = Province::all();

        foreach ($provinces as $province) {
            $response = Http::get("https://api-regional-indonesia.vercel.app/api/cities/{$province->id}");

            if ($response->successful()) {
                $cities = $response->json('data');
                foreach ($cities as $city) {
                    City::updateOrCreate(
                        ['id' => $city['id']],
                        [
                            'province_id' => $province->id,
                            'name' => $city['name'],
                        ]
                    );
                }
            }
        }
    }
}
