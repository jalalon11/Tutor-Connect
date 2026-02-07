<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherApplicationController extends Controller
{
    /**
     * Display a listing of teacher applications.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $sortField = $request->input('sort_field', 'applied_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = $request->input('search');
        $statusFilter = $request->input('status_filter');
        $experienceFilter = $request->input('experience_filter');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $query = User::whereNotNull('role')
            ->where('role', User::ROLE_TEACHER);

        // Search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($statusFilter && $statusFilter !== 'all') {
            $query->where('teacher_status', $statusFilter);
        }

        // Experience filter
        if ($experienceFilter === '0-2') {
            $query->where('experience_years', '<=', 2);
        } elseif ($experienceFilter === '3-5') {
            $query->whereBetween('experience_years', [3, 5]);
        } elseif ($experienceFilter === '6+') {
            $query->where('experience_years', '>=', 6);
        }

        // Date range filter
        if ($dateFrom) {
            $query->whereDate('applied_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('applied_at', '<=', $dateTo);
        }

        // Sorting
        if ($sortField === 'name') {
            $query->orderBy('first_name', $sortDirection)
                  ->orderBy('last_name', $sortDirection);
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        $applications = $query->paginate($perPage)->through(function ($user) {
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
            'filters' => [
                'search' => $search,
                'status_filter' => $statusFilter,
                'experience_filter' => $experienceFilter,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
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
