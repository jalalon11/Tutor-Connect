<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AppSettingsController extends Controller
{
    /**
     * Get mail settings from .env file directly (bypassing cache).
     */
    private function getMailSettingsFromEnv(): array
    {
        $envPath = base_path('.env');
        $envContent = file_exists($envPath) ? file_get_contents($envPath) : '';

        $settings = [
            'MAIL_MAILER' => 'smtp',
            'MAIL_HOST' => 'smtp.gmail.com',
            'MAIL_PORT' => '465',
            'MAIL_USERNAME' => '',
            'MAIL_PASSWORD' => '',
            'MAIL_ENCRYPTION' => 'ssl',
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
     * Display the app settings page.
     */
    public function index()
    {
        return Inertia::render('admin/settings/index', [
            'settings' => [
                'app_name' => AppSetting::get('app_name', 'TutorConnect'),
                'app_icon' => AppSetting::get('app_icon'),
            ],
            'mailSettings' => $this->getMailSettingsFromEnv(),
        ]);
    }

    /**
     * Update app settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'app_icon' => 'nullable|image|mimes:png,jpg,jpeg,svg,webp|max:2048',
        ]);

        $oldName = AppSetting::get('app_name', 'TutorConnect');
        $oldIcon = AppSetting::get('app_icon');

        // Update app name
        AppSetting::set('app_name', $validated['app_name']);

        // Handle icon upload
        if ($request->hasFile('app_icon')) {
            // Delete old icon if exists
            if ($oldIcon && Storage::disk('public')->exists($oldIcon)) {
                Storage::disk('public')->delete($oldIcon);
            }

            // Store new icon
            $path = $request->file('app_icon')->store('branding', 'public');
            AppSetting::set('app_icon', $path);
        }

        // Log activity
        ActivityLog::log(
            'app_settings_updated',
            'Updated app settings',
            [
                'old_name' => $oldName,
                'new_name' => $validated['app_name'],
                'icon_changed' => $request->hasFile('app_icon'),
            ]
        );

        return redirect()->back()->with('success', 'App settings updated successfully.');
    }

    /**
     * Remove app icon.
     */
    public function removeIcon()
    {
        $icon = AppSetting::get('app_icon');
        if ($icon && Storage::disk('public')->exists($icon)) {
            Storage::disk('public')->delete($icon);
        }
        AppSetting::set('app_icon', null);

        // Log activity
        ActivityLog::log(
            'app_icon_removed',
            'Removed app icon',
            ['removed_icon' => $icon]
        );

        return redirect()->back()->with('success', 'App icon removed.');
    }

    /**
     * Update mail server settings in .env file.
     */
    public function updateMail(Request $request)
    {
        $validated = $request->validate([
            'MAIL_MAILER' => 'required|string|max:50',
            'MAIL_HOST' => 'required|string|max:255',
            'MAIL_PORT' => 'required|string|max:10',
            'MAIL_USERNAME' => 'nullable|string|max:255',
            'MAIL_PASSWORD' => 'nullable|string|max:255',
            'MAIL_ENCRYPTION' => 'nullable|string|max:10',
            'MAIL_FROM_ADDRESS' => 'nullable|email|max:255',
            'MAIL_FROM_NAME' => 'nullable|string|max:255',
        ]);

        $envPath = base_path('.env');
        $envContent = file_get_contents($envPath);

        foreach ($validated as $key => $value) {
            // Skip if password is masked (unchanged)
            if ($key === 'MAIL_PASSWORD' && $value === '********') {
                continue;
            }

            // Quote value if it contains spaces
            $quotedValue = str_contains($value ?? '', ' ') ? '"' . $value . '"' : ($value ?? '');

            // Check if key exists in .env
            if (preg_match("/^{$key}=.*/m", $envContent)) {
                $envContent = preg_replace("/^{$key}=.*/m", "{$key}={$quotedValue}", $envContent);
            } else {
                // Add key if not exists
                $envContent .= "\n{$key}={$quotedValue}";
            }
        }

        file_put_contents($envPath, $envContent);

        // Log activity
        ActivityLog::log(
            'mail_settings_updated',
            'Updated mail server settings',
            ['changed_fields' => array_keys($validated)]
        );

        // Clear all config cache to apply new settings
        try {
            Artisan::call('config:clear');
        } catch (\Exception $e) {
            // Ignore if command fails
        }

        return redirect()->back()->with('success', 'Mail server settings updated successfully.');
    }

    /**
     * Test mail configuration by validating SMTP connection.
     */
    public function testMail(Request $request)
    {
        $validated = $request->validate([
            'test_email' => 'required|email',
        ]);

        // Read fresh config from .env
        $envPath = base_path('.env');
        $envContent = file_get_contents($envPath);

        $getEnvValue = function ($key, $default = null) use ($envContent) {
            if (preg_match("/^{$key}=(.*)$/m", $envContent, $matches)) {
                $value = trim($matches[1]);
                return preg_replace('/^["\'](.*)["\']$/', '$1', $value);
            }
            return $default;
        };

        $host = $getEnvValue('MAIL_HOST');
        $port = (int) $getEnvValue('MAIL_PORT', 587);
        $username = $getEnvValue('MAIL_USERNAME');
        $password = $getEnvValue('MAIL_PASSWORD');
        $encryption = $getEnvValue('MAIL_ENCRYPTION', 'tls');

        // Validate required fields
        if (empty($host)) {
            return redirect()->back()->with('error', 'SMTP Host is required.');
        }

        if (empty($username) || empty($password)) {
            return redirect()->back()->with('error', 'SMTP Username and Password are required.');
        }

        try {
            $timeout = 10;

            // For SSL encryption, prepend ssl:// to the host
            // For TLS, we connect without prefix and use STARTTLS
            if ($encryption === 'ssl') {
                $connectHost = 'ssl://' . $host;
            } else {
                $connectHost = $host;
            }

            $connection = @fsockopen($connectHost, $port, $errno, $errstr, $timeout);

            if (!$connection) {
                return redirect()->back()->with('error', "Cannot connect to SMTP server: {$errstr} (Error {$errno})");
            }

            // Read the server greeting
            $response = fgets($connection, 512);

            if (strpos($response, '220') === false) {
                fclose($connection);
                return redirect()->back()->with('error', "SMTP server responded with: " . trim($response));
            }

            // Send EHLO command
            fwrite($connection, "EHLO localhost\r\n");
            while ($line = fgets($connection, 512)) {
                if (substr($line, 3, 1) === ' ')
                    break;
            }

            // If TLS (not SSL), start TLS handshake
            if ($encryption === 'tls') {
                fwrite($connection, "STARTTLS\r\n");
                $starttlsResponse = fgets($connection, 512);

                if (strpos($starttlsResponse, '220') === false) {
                    fclose($connection);
                    return redirect()->back()->with('error', "STARTTLS failed: " . trim($starttlsResponse));
                }

                // Enable TLS
                if (!stream_socket_enable_crypto($connection, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                    fclose($connection);
                    return redirect()->back()->with('error', 'Failed to enable TLS encryption.');
                }

                // Re-send EHLO after STARTTLS
                fwrite($connection, "EHLO localhost\r\n");
                while ($line = fgets($connection, 512)) {
                    if (substr($line, 3, 1) === ' ')
                        break;
                }
            }

            // Test AUTH LOGIN
            fwrite($connection, "AUTH LOGIN\r\n");
            $authResponse = fgets($connection, 512);

            if (strpos($authResponse, '334') === false) {
                fclose($connection);
                return redirect()->back()->with('error', "Server does not support AUTH LOGIN: " . trim($authResponse));
            }

            // Send username
            fwrite($connection, base64_encode($username) . "\r\n");
            $userResponse = fgets($connection, 512);

            if (strpos($userResponse, '334') === false) {
                fclose($connection);
                return redirect()->back()->with('error', "Username rejected: " . trim($userResponse));
            }

            // Send password
            fwrite($connection, base64_encode($password) . "\r\n");
            $passResponse = fgets($connection, 512);

            if (strpos($passResponse, '235') === false) {
                fclose($connection);
                return redirect()->back()->with('error', 'Authentication failed. Please check your username and password.');
            }

            // Close connection properly
            fwrite($connection, "QUIT\r\n");
            fclose($connection);

            return redirect()->back()->with('success', 'Mail configuration is valid! SMTP connection and authentication successful.');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Connection test failed: ' . $e->getMessage());
        }
    }
}
