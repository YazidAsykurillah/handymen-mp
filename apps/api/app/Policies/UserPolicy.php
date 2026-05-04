<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function delete(User $currentUser, User $targetUser): bool
    {
        // Only super_admin can delete another super_admin
        if ($targetUser->hasRole('super_admin')) {
            return $currentUser->hasRole('super_admin');
        }

        return $currentUser->hasPermissionTo('user.delete');
    }

    public function assignRole(User $currentUser, User $targetUser): bool
    {
        // Admin cannot assign or remove super_admin role
        if ($targetUser->hasRole('super_admin') || $currentUser->hasRole('admin')) {
            return $currentUser->hasRole('super_admin');
        }

        return $currentUser->hasPermissionTo('admin.assignRole');
    }
}
