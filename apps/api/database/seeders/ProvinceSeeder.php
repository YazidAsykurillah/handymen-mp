<?php

namespace Database\Seeders;

use App\Models\Province;
use Illuminate\Database\Seeder;

class ProvinceSeeder extends Seeder
{
    public function run(): void
    {
        $provinces = [
            ['name' => 'DKI Jakarta',          'code' => 'JK'],
            ['name' => 'Jawa Barat',            'code' => 'JB'],
            ['name' => 'Jawa Tengah',           'code' => 'JT'],
            ['name' => 'Jawa Timur',            'code' => 'JI'],
            ['name' => 'DI Yogyakarta',         'code' => 'YO'],
            ['name' => 'Banten',                'code' => 'BT'],
            ['name' => 'Bali',                  'code' => 'BA'],
            ['name' => 'Sumatera Utara',        'code' => 'SU'],
            ['name' => 'Sumatera Selatan',      'code' => 'SS'],
            ['name' => 'Kalimantan Timur',      'code' => 'KI'],
            ['name' => 'Sulawesi Selatan',      'code' => 'SN'],
        ];

        foreach ($provinces as $province) {
            Province::firstOrCreate(['code' => $province['code']], $province);
        }
    }
}
