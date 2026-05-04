<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\Province;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\City>
 */
class CityFactory extends Factory
{
    protected $model = City::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'province_id' => Province::inRandomOrder()->first()?->id ?? Province::factory(),
            'name' => $this->faker->city(),
            'type' => $this->faker->randomElement(['Kota', 'Kabupaten']),
        ];
    }
}
