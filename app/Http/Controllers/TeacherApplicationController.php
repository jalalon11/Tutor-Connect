<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherApplicationController extends Controller
{
    /**
     * Store a new teacher application.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'subjects' => 'nullable|array',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'bio' => 'nullable|string|max:1000',
        ]);

        // Create user with teacher application
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => bcrypt(str()->random(16)), // Temporary password
            'role' => User::ROLE_TEACHER,
            'teacher_status' => User::TEACHER_STATUS_PENDING,
            'phone' => $validated['phone'] ?? null,
            'subjects' => $validated['subjects'] ?? null,
            'experience_years' => $validated['experience_years'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'applied_at' => now(),
        ]);

        return redirect()->route('home')->with('success', 'Thank you for applying! We\'ll review your application and get in touch soon.');
    }
}
