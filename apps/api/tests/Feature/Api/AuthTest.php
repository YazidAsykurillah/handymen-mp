<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Province;
use App\Models\City;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => 'user']);
        Role::create(['name' => 'handyman']);
    }

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/auth/register', [
            'name'                  => 'Budi Santoso',
            'email'                 => 'budi@example.com',
            'phone'                 => '081234567890',
            'password'              => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'user' => ['id', 'name', 'email', 'phone', 'role'],
                    'token',
                ],
                'message',
            ]);

        $this->assertDatabaseHas('users', ['email' => 'budi@example.com']);
    }

    public function test_handyman_can_register()
    {
        $province = Province::create(['name' => 'Jakarta', 'code' => 'JK']);
        $city = City::create(['name' => 'South Jakarta', 'province_id' => $province->id, 'type' => 'city']);
        $category = Category::create(['name' => 'Electrical', 'slug' => 'electrical', 'is_active' => true]);

        $response = $this->postJson('/api/auth/register/handyman', [
            'name'                  => 'Joko Widodo',
            'email'                 => 'joko@example.com',
            'phone'                 => '081298765432',
            'password'              => 'password',
            'password_confirmation' => 'password',
            'province_id'           => $province->id,
            'city_id'               => $city->id,
            'categories'            => [$category->id],
            'bio'                   => 'Tukang listrik berpengalaman.',
            'whatsapp'              => '081298765432',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'user',
                    'handyman' => ['id', 'slug', 'is_verified', 'is_premium'],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('users', ['email' => 'joko@example.com']);
        $this->assertDatabaseHas('handymen', ['name' => 'Joko Widodo']);
    }

    public function test_user_can_login()
    {
        $user = User::create([
            'name'     => 'Budi Santoso',
            'email'    => 'budi@example.com',
            'password' => Hash::make('password'),
            'phone'    => '081234567890',
        ]);
        $user->assignRole('user');

        $response = $this->postJson('/api/auth/login', [
            'email'    => 'budi@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['user', 'token'],
            ]);
    }
}
