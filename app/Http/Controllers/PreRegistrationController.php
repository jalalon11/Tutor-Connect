<?php

namespace App\Http\Controllers;

use App\Mail\PreRegistrationVerificationMail;
use App\Models\PreRegistration;
use Illuminate\Http\Request;
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

        // Send verification email
        Mail::to($preRegistration->email)->send(
            new PreRegistrationVerificationMail($preRegistration)
        );

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

        if ($preRegistration->isVerified()) {
            return Inertia::render('pre-register-success', [
                'message' => 'Your email has already been verified!',
                'name' => $preRegistration->first_name,
            ]);
        }

        $preRegistration->markAsVerified();

        return Inertia::render('pre-register-success', [
            'message' => 'Your email has been verified successfully!',
            'name' => $preRegistration->first_name,
        ]);
    }
}
