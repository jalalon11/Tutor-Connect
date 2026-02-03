<?php

namespace App\Http\Controllers;

use App\Models\TeacherPreRegistration;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Supported OAuth providers.
     */
    protected array $providers = ['google', 'facebook'];

    /**
     * Redirect to the OAuth provider.
     */
    public function redirect(Request $request, string $provider)
    {
        if (!in_array($provider, $this->providers)) {
            abort(404, 'Provider not supported');
        }

        // Store the registration type in session
        $request->session()->put('oauth_type', $request->get('type', 'teacher'));

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle the callback from the OAuth provider.
     */
    public function callback(Request $request, string $provider)
    {
        if (!in_array($provider, $this->providers)) {
            abort(404, 'Provider not supported');
        }

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect()->route('home')->with('error', 'Unable to authenticate with ' . ucfirst($provider) . '. Please try again.');
        }

        $type = $request->session()->pull('oauth_type', 'teacher');

        if ($type === 'teacher') {
            return $this->handleTeacherRegistration($socialUser, $provider);
        }

        // Default redirect for other types (future: parent registration)
        return redirect()->route('home');
    }

    /**
     * Handle teacher pre-registration via OAuth.
     */
    protected function handleTeacherRegistration($socialUser, string $provider)
    {
        // Check if already registered
        $existing = TeacherPreRegistration::where('email', $socialUser->getEmail())->first();

        if ($existing) {
            return redirect()->route('home')->with('info', 'You have already pre-registered with this email. We\'ll be in touch soon!');
        }

        // Parse name into first and last
        $nameParts = explode(' ', $socialUser->getName(), 2);
        $firstName = $nameParts[0] ?? '';
        $lastName = $nameParts[1] ?? '';

        TeacherPreRegistration::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $socialUser->getEmail(),
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'avatar_url' => $socialUser->getAvatar(),
            'status' => TeacherPreRegistration::STATUS_DRAFT,
        ]);

        return redirect()->route('home')->with('success', 'Thank you for pre-registering with ' . ucfirst($provider) . '! We\'ll be in touch soon.');
    }
}
