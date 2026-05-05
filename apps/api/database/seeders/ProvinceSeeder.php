<?php

namespace Database\Seeders;

use App\Models\Province;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class ProvinceSeeder extends Seeder
{
    public function run(): void
    {
        $response = Http::get('https://api-regional-indonesia.vercel.app/api/provinces');

        if ($response->successful()) {
            $provinces = $response->json('data');
            foreach ($provinces as $province) {
                Province::updateOrCreate(
                    ['id' => $province['id']],
                    ['name' => $province['name']]
                );
            }
        }
    }
}
