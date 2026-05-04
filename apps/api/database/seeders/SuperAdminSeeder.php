<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => env('SUPER_ADMIN_EMAIL', 'superadmin@handyman.test')],
            [
                'name'              => 'Super Admin',
                'password'          => Hash::make(env('SUPER_ADMIN_PASSWORD', 'password')),
                'email_verified_at' => now(),
            ]
        );

        $user->assignRole('super_admin');
    }
}
