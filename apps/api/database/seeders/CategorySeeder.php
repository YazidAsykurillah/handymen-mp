<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Electrical',    'icon' => 'bolt'],
            ['name' => 'Plumbing',      'icon' => 'pipe'],
            ['name' => 'Construction',  'icon' => 'building'],
            ['name' => 'Painting',      'icon' => 'paint-brush'],
            ['name' => 'AC Repair',     'icon' => 'wind'],
            ['name' => 'Carpentry',     'icon' => 'hammer'],
            ['name' => 'Roofing',       'icon' => 'home'],
            ['name' => 'Tiling',        'icon' => 'grid'],
            ['name' => 'Cleaning',      'icon' => 'sparkles'],
            ['name' => 'Other',         'icon' => 'wrench'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => Str::slug($category['name'])],
                [
                    'name'      => $category['name'],
                    'icon'      => $category['icon'],
                    'is_active' => true,
                ]
            );
        }
    }
}
