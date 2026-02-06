<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\AccountReadyMail;
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
        // Sort: verified users first (A-Z by name), then pending users last (A-Z by name)
        $query = PreRegistration::query()
            ->orderByRaw('CASE WHEN email_verified_at IS NULL THEN 1 ELSE 0 END')
            ->orderBy('first_name', 'asc')
            ->orderBy('last_name', 'asc');

        $preRegistrations = $query->paginate(20)->through(function ($reg) {
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

        $preRegistration->delete();

        return redirect()->back()->with('success', 'Pre-registration entry deleted successfully.');
    }
}
