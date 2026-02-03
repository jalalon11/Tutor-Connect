<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdminSetupController extends Controller
{
    /**
     * Show the admin setup form if no admin exists.
     */
    public function show()
    {
        if (User::where('is_admin', true)->exists()) {
            return redirect()->route('home');
        }

        return Inertia::render('admin/setup', [
            'status' => session('status'),
        ]);
    }

    /**
     * Create the first admin user and default roles.
     */
    public function store(Request $request)
    {
        if (User::where('is_admin', true)->exists()) {
            return redirect()->route('home');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Create default roles
        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrator', 'description' => 'System administrator with full access.']
        );

        Role::firstOrCreate(
            ['slug' => 'teacher'],
            ['name' => 'Teacher', 'description' => 'A teacher user.']
        );

        // Create the admin user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => true,
        ]);

        // Assign admin role
        $user->roles()->attach($adminRole->id);

        Auth::login($user);

        return redirect()->route('dashboard')->with('success', 'Admin account created successfully! Welcome to the dashboard.');
    }
}
