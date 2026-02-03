<?php

namespace App\Traits;

use App\Models\Role;
use App\Models\Permission;

trait HasRoles
{
    /**
     * The roles that belong to the user.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string|array $role): bool
    {
        if (is_array($role)) {
            return $this->roles->whereIn('slug', $role)->count() > 0;
        }
        return $this->roles->where('slug', $role)->count() > 0;
    }

    /**
     * Check if user has a specific permission (via roles).
     */
    public function hasPermissionTo(string $permission): bool
    {
        return $this->roles->flatMap->permissions->where('slug', $permission)->count() > 0;
    }
}
