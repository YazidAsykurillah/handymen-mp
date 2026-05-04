<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\Handyman;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Handyman>
 */
class HandymanFactory extends Factory
{
    protected $model = Handyman::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $city = City::inRandomOrder()->first() ?? City::factory()->create();

        return [
            'user_id' => User::factory(),
            'city_id' => $city->id,
            'province_id' => $city->province_id,
            'name' => fn (array $attributes) => User::find($attributes['user_id'])->name,
            'slug' => fn (array $attributes) => Str::slug(User::find($attributes['user_id'])->name) . '-' . $this->faker->unique()->numberBetween(100, 999),
            'bio' => $this->faker->paragraph(),
            'phone' => $this->faker->phoneNumber(),
            'whatsapp' => $this->faker->phoneNumber(),
            'photo_profile' => 'handymen/placeholder.png',
            'address' => $this->faker->address(),
            'latitude' => $this->faker->latitude(-7.9, -6.0),
            'longitude' => $this->faker->longitude(106.0, 108.0),
            'is_verified' => $this->faker->boolean(70),
            'is_premium' => $this->faker->boolean(30),
            'is_active' => $this->faker->boolean(90),
            'rating_avg' => $this->faker->randomFloat(2, 3, 5),
            'review_count' => $this->faker->numberBetween(0, 100),
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Handyman $handyman) {
            $handyman->user->assignRole('handyman');
        });
    }
}
