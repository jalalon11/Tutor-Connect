<?php

namespace App\Http\Controllers;

use App\Models\TeacherPreRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherPreRegistrationController extends Controller
{
    /**
     * Store a new teacher pre-registration via email form.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:teacher_pre_registrations,email',
            'phone' => 'nullable|string|max:20',
            'subjects' => 'nullable|array',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'bio' => 'nullable|string|max:1000',
        ]);

        TeacherPreRegistration::create([
            ...$validated,
            'provider' => TeacherPreRegistration::PROVIDER_EMAIL,
            'status' => TeacherPreRegistration::STATUS_DRAFT,
        ]);

        return redirect()->route('home')->with('success', 'Thank you for pre-registering! We\'ll be in touch soon.');
    }
}
