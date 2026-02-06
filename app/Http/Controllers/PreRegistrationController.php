<?php

namespace App\Http\Controllers;

use App\Mail\PreRegistrationVerificationMail;
use App\Models\PreRegistration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PreRegistrationController extends Controller
{
    /**
     * Show the pre-registration form.
     */
    public function show()
    {
        return Inertia::render('pre-register');
    }

    /**
     * Store a new pre-registration and send verification email.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:pre_registrations,email',
        ]);

        $preRegistration = PreRegistration::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'verification_token' => PreRegistration::generateToken(),
        ]);

        // Queue verification email for async sending
        Mail::to($preRegistration->email)->queue(
            new PreRegistrationVerificationMail($preRegistration)
        );

        // Return JSON for AJAX requests to allow in-page state update
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Verification email sent successfully.',
            ]);
        }

        return redirect()->route('pre-register.sent');
    }

    /**
     * Show the "email sent" confirmation page.
     */
    public function sent()
    {
        return Inertia::render('pre-register-sent');
    }

    /**
     * Verify email via token.
     */
    public function verify(string $token)
    {
        $preRegistration = PreRegistration::where('verification_token', $token)->first();

        if (!$preRegistration) {
            return Inertia::render('pre-register-error', [
                'message' => 'Invalid or expired verification link.',
            ]);
        }

        if (!$preRegistration->isVerified()) {
            $preRegistration->markAsVerified();
        }

        // Show "verified, we'll notify you when we launch" message
        return Inertia::render('pre-register-success', [
            'message' => 'Your email has been verified successfully!',
            'name' => $preRegistration->first_name,
        ]);
    }

    /**
     * Show the account setup page (from launch email).
     */
    public function showSetup(string $token)
    {
        $preRegistration = PreRegistration::where('setup_token', $token)->first();

        if (!$preRegistration) {
            return Inertia::render('pre-register-error', [
                'message' => 'Invalid or expired setup link.',
            ]);
        }

        if ($preRegistration->isSetupComplete()) {
            return redirect()->route('login')->with('status', 'Your account has already been set up. Please log in.');
        }

        return Inertia::render('pre-register-setup', [
            'token' => $token,
            'name' => $preRegistration->first_name,
            'email' => $preRegistration->email,
        ]);
    }

    /**
     * Resend verification email for existing pre-registration.
     */
    public function resend(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:pre_registrations,email',
        ]);

        $preRegistration = PreRegistration::where('email', $validated['email'])->first();

        if (!$preRegistration) {
            return response()->json([
                'success' => false,
                'message' => 'Pre-registration not found.',
            ], 404);
        }

        if ($preRegistration->isVerified()) {
            return response()->json([
                'success' => false,
                'message' => 'This email has already been verified.',
            ], 400);
        }

        // Regenerate token and resend email
        $preRegistration->update([
            'verification_token' => PreRegistration::generateToken(),
        ]);

        Mail::to($preRegistration->email)->queue(
            new PreRegistrationVerificationMail($preRegistration)
        );

        return response()->json([
            'success' => true,
            'message' => 'Verification email has been resent.',
        ]);
    }

    /**
     * Complete account setup - create user and log in.
     */
    public function completeSetup(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:student,teacher',
        ]);

        $preRegistration = PreRegistration::where('setup_token', $validated['token'])->first();

        if (!$preRegistration) {
            return back()->withErrors(['token' => 'Invalid or expired setup link.']);
        }

        if ($preRegistration->isSetupComplete()) {
            return redirect()->route('login')->with('status', 'Your account has already been set up. Please log in.');
        }

        // Check if email already exists in users table
        if (User::where('email', $preRegistration->email)->exists()) {
            return back()->withErrors(['email' => 'An account with this email already exists.']);
        }

        // Create the user
        $user = User::create([
            'name' => $preRegistration->full_name,
            'email' => $preRegistration->email,
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'email_verified_at' => now(),
        ]);

        // Mark pre-registration as complete
        $preRegistration->update(['role' => $validated['role']]);
        $preRegistration->markSetupComplete($user->id);

        // Auto-login the user
        Auth::login($user);

        return redirect()->route('dashboard');
    }
}

