<?php

namespace Database\Seeders;

use App\Models\Handyman;
use Illuminate\Database\Seeder;

class HandymanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Handyman::factory()->count(10)->create();
    }
}
