<?php

namespace App\Http\Middleware;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Get mail settings from .env file directly (bypassing cache).
     */
    private function getMailSettingsFromEnv(): array
    {
        $envPath = base_path('.env');
        $envContent = file_exists($envPath) ? file_get_contents($envPath) : '';

        $settings = [
            'MAIL_MAILER' => 'smtp',
            'MAIL_HOST' => '',
            'MAIL_PORT' => '587',
            'MAIL_USERNAME' => '',
            'MAIL_PASSWORD' => '',
            'MAIL_ENCRYPTION' => 'tls',
            'MAIL_FROM_ADDRESS' => '',
            'MAIL_FROM_NAME' => '',
        ];

        foreach ($settings as $key => $default) {
            if (preg_match("/^{$key}=(.*)$/m", $envContent, $matches)) {
                $value = trim($matches[1]);
                // Remove surrounding quotes if present
                $value = preg_replace('/^["\'](.*)["\']$/', '$1', $value);
                $settings[$key] = $value;
            }
        }

        // Mask password for security
        if (!empty($settings['MAIL_PASSWORD'])) {
            $settings['MAIL_PASSWORD'] = '********';
        }

        return $settings;
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $isAdmin = $request->user() && $request->user()->is_admin;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'appSettings' => [
                'name' => AppSetting::get('app_name', 'TutorConnect'),
                'icon' => AppSetting::get('app_icon'),
            ],
            // Share mail settings only for admin users
            'mailSettings' => $isAdmin ? $this->getMailSettingsFromEnv() : null,
        ];
    }
}
