<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Handyman
            'handyman.viewAny',
            'handyman.create',
            'handyman.update.own',
            'handyman.update.any',
            'handyman.delete.any',
            'handyman.verify',
            'handyman.togglePremium',
            // Category
            'category.viewAny',
            'category.create',
            'category.update',
            'category.delete',
            // Portfolio
            'portfolio.create',
            'portfolio.delete.own',
            'portfolio.delete.any',
            // Review
            'review.create',
            'review.approve',
            'review.delete.any',
            // User
            'user.viewAny',
            'user.delete',
            // Admin-only
            'admin.create',
            'admin.delete',
            'admin.assignRole',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // super_admin — no permissions needed, bypassed via Gate::before()
        Role::firstOrCreate(['name' => 'super_admin']);

        // admin — all permissions except admin.*
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions(
            Permission::whereNotIn('name', [
                'admin.create',
                'admin.delete',
                'admin.assignRole',
            ])->get()
        );

        // handyman
        $handyman = Role::firstOrCreate(['name' => 'handyman']);
        $handyman->syncPermissions([
            'handyman.viewAny',
            'handyman.update.own',
            'portfolio.create',
            'portfolio.delete.own',
        ]);

        // user
        $user = Role::firstOrCreate(['name' => 'user']);
        $user->syncPermissions([
            'handyman.viewAny',
            'category.viewAny',
            'review.create',
        ]);
    }
}
