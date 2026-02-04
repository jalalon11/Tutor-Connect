<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class TeacherApplicationController extends Controller
{
    /**
     * Display a listing of teacher applications.
     */
    public function index()
    {
        $applications = User::whereNotNull('role')
            ->where('role', User::ROLE_TEACHER)
            ->latest('applied_at')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'subjects' => $user->subjects,
                    'experience_years' => $user->experience_years,
                    'bio' => $user->bio,
                    'status' => $user->teacher_status,
                    'applied_at' => $user->applied_at,
                    'created_at' => $user->created_at,
                ];
            });

        return Inertia::render('admin/teacher-applications/index', [
            'applications' => $applications,
        ]);
    }

    /**
     * Approve a teacher application.
     */
    public function approve(User $user)
    {
        $user->update(['teacher_status' => User::TEACHER_STATUS_APPROVED]);

        return redirect()->back()->with('success', 'Teacher application approved.');
    }

    /**
     * Reject a teacher application.
     */
    public function reject(User $user)
    {
        $user->update(['teacher_status' => User::TEACHER_STATUS_REJECTED]);

        return redirect()->back()->with('success', 'Teacher application rejected.');
    }
}
