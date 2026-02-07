<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\AccountReadyMail;
use App\Models\ActivityLog;
use App\Models\PreRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PreRegistrationAdminController extends Controller
{
    /**
     * Display paginated list of pre-registrations.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $sortField = $request->input('sort_field', 'email_verified_at');
        $sortDirection = $request->input('sort_direction', 'asc');
        $search = $request->input('search');
        $statusFilter = $request->input('status_filter');
        $roleFilter = $request->input('role_filter');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $query = PreRegistration::query();

        // Search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($statusFilter === 'verified') {
            $query->whereNotNull('email_verified_at');
        } elseif ($statusFilter === 'pending') {
            $query->whereNull('email_verified_at');
        } elseif ($statusFilter === 'setup_sent') {
            $query->whereNotNull('setup_email_sent_at');
        } elseif ($statusFilter === 'completed') {
            $query->whereNotNull('setup_completed_at');
        }

        // Role filter
        if ($roleFilter && $roleFilter !== 'all') {
            $query->where('role', $roleFilter);
        }

        // Date range filter
        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        // Sorting
        if ($sortField === 'name') {
            $query->orderBy('first_name', $sortDirection)
                  ->orderBy('last_name', $sortDirection);
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        $preRegistrations = $query->paginate($perPage)->through(function ($reg) {
            return [
                'id' => $reg->id,
                'first_name' => $reg->first_name,
                'last_name' => $reg->last_name,
                'email' => $reg->email,
                'email_verified_at' => $reg->email_verified_at,
                'setup_email_sent_at' => $reg->setup_email_sent_at,
                'setup_completed_at' => $reg->setup_completed_at,
                'role' => $reg->role,
                'created_at' => $reg->created_at,
            ];
        });

        $stats = [
            'total' => PreRegistration::count(),
            'verified' => PreRegistration::whereNotNull('email_verified_at')->count(),
            'pending_setup' => PreRegistration::whereNotNull('email_verified_at')
                ->whereNull('setup_completed_at')
                ->whereNull('setup_email_sent_at')
                ->count(),
            'emails_sent' => PreRegistration::whereNotNull('setup_email_sent_at')->count(),
            'completed' => PreRegistration::whereNotNull('setup_completed_at')->count(),
        ];

        return Inertia::render('admin/pre-registrations/index', [
            'preRegistrations' => $preRegistrations,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status_filter' => $statusFilter,
                'role_filter' => $roleFilter,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Get pre-registration statistics.
     */
    public function stats()
    {
        return response()->json([
            'total' => PreRegistration::count(),
            'verified' => PreRegistration::whereNotNull('email_verified_at')->count(),
            'pending_setup' => PreRegistration::whereNotNull('email_verified_at')
                ->whereNull('setup_completed_at')
                ->whereNull('setup_email_sent_at')
                ->count(),
            'emails_sent' => PreRegistration::whereNotNull('setup_email_sent_at')->count(),
            'completed' => PreRegistration::whereNotNull('setup_completed_at')->count(),
        ]);
    }

    /**
     * Send account creation emails to selected users.
     */
    public function sendEmailsToSelected(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:pre_registrations,id',
        ]);

        $registrations = PreRegistration::whereIn('id', $validated['ids'])
            ->whereNotNull('email_verified_at')
            ->whereNull('setup_completed_at')
            ->get();

        $count = 0;

        foreach ($registrations as $preRegistration) {
            // Generate setup token if not already set
            if (!$preRegistration->setup_token) {
                $preRegistration->generateSetupToken();
            } else {
                // Just mark as sent if token exists
                $preRegistration->update(['setup_email_sent_at' => now()]);
            }

            // Queue email for async sending
            Mail::to($preRegistration->email)->queue(
                new AccountReadyMail($preRegistration)
            );

            $count++;
        }

        // Log activity
        ActivityLog::log(
            'pre_registration_emails_sent',
            "Sent setup emails to {$count} selected pre-registered users",
            ['recipient_count' => $count, 'ids' => $validated['ids']]
        );

        return redirect()->back()->with('success', "Successfully sent account creation emails to {$count} users.");
    }

    /**
     * Send account creation emails to all verified users who haven't received one yet.
     */
    public function sendLaunchEmails(Request $request)
    {
        $pendingRegistrations = PreRegistration::whereNotNull('email_verified_at')
            ->whereNull('setup_completed_at')
            ->whereNull('setup_email_sent_at')
            ->get();

        $count = 0;

        foreach ($pendingRegistrations as $preRegistration) {
            // Generate setup token
            $preRegistration->generateSetupToken();

            // Queue email for async sending
            Mail::to($preRegistration->email)->queue(
                new AccountReadyMail($preRegistration)
            );

            $count++;
        }

        // Log activity
        ActivityLog::log(
            'pre_registration_launch_emails_sent',
            "Sent launch emails to all {$count} pending pre-registered users",
            ['recipient_count' => $count]
        );

        return redirect()->back()->with('success', "Successfully sent account creation emails to {$count} users.");
    }

    /**
     * Delete a pre-registration entry.
     */
    public function destroy(PreRegistration $preRegistration)
    {
        // Don't allow deleting if user has already completed setup
        if ($preRegistration->setup_completed_at) {
            return redirect()->back()->withErrors(['error' => 'Cannot delete a user who has already completed their account setup.']);
        }

        // Log before deletion
        ActivityLog::log(
            'pre_registration_deleted',
            "Deleted pre-registration for {$preRegistration->email}",
            [
                'email' => $preRegistration->email,
                'first_name' => $preRegistration->first_name,
                'last_name' => $preRegistration->last_name,
                'role' => $preRegistration->role,
            ]
        );

        $preRegistration->delete();

        return redirect()->back()->with('success', 'Pre-registration entry deleted successfully.');
    }
}
