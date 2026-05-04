<?php

namespace Tests\Feature\Api;

use App\Models\Handyman;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class HandymanPublicTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => 'handyman']);
    }

    public function test_can_list_handymen()
    {
        Handyman::factory()->count(5)->create(['is_active' => true]);

        $response = $this->getJson('/api/handymen');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'is_verified', 'is_premium']
                ],
                'meta' => ['current_page', 'last_page', 'per_page', 'total']
            ]);
    }

    public function test_can_show_handyman_by_slug()
    {
        $handyman = Handyman::factory()->create(['slug' => 'test-slug', 'is_active' => true]);

        $response = $this->getJson('/api/handymen/test-slug');

        $response->assertStatus(200)
            ->assertJsonPath('data.slug', 'test-slug');
    }

    public function test_returns_404_for_non_existent_handyman()
    {
        $response = $this->getJson('/api/handymen/non-existent');
        $response->assertStatus(404);
    }
}
