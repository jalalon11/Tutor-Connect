<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PreRegistration;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        // Teacher application statistics
        $totalApplications = User::where('role', User::ROLE_TEACHER)->count();
        $pendingApplications = User::where('role', User::ROLE_TEACHER)
            ->where('teacher_status', User::TEACHER_STATUS_PENDING)
            ->count();
        $approvedTeachers = User::where('role', User::ROLE_TEACHER)
            ->where('teacher_status', User::TEACHER_STATUS_APPROVED)
            ->count();
        $rejectedApplications = User::where('role', User::ROLE_TEACHER)
            ->where('teacher_status', User::TEACHER_STATUS_REJECTED)
            ->count();

        // Pre-registration statistics
        $totalPreRegistrations = PreRegistration::count();
        $verifiedPreRegistrations = PreRegistration::whereNotNull('verified_at')->count();
        $pendingPreRegistrations = PreRegistration::whereNull('verified_at')->count();

        // Recent applications
        $recentApplications = User::where('role', User::ROLE_TEACHER)
            ->latest('applied_at')
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->teacher_status,
                    'applied_at' => $user->applied_at,
                ];
            });

        // Total students
        $totalStudents = User::where('role', User::ROLE_STUDENT)->count();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalApplications' => $totalApplications,
                'pendingApplications' => $pendingApplications,
                'approvedTeachers' => $approvedTeachers,
                'rejectedApplications' => $rejectedApplications,
                'totalStudents' => $totalStudents,
                'totalPreRegistrations' => $totalPreRegistrations,
                'verifiedPreRegistrations' => $verifiedPreRegistrations,
                'pendingPreRegistrations' => $pendingPreRegistrations,
            ],
            'recentApplications' => $recentApplications,
        ]);
    }
}
