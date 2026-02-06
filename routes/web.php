<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\PreRegistrationController;
use App\Http\Controllers\TeacherApplicationController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\TeacherApplicationController as AdminTeacherApplicationController;
use App\Http\Controllers\Admin\AppSettingsController;
use App\Http\Controllers\Admin\PreRegistrationAdminController;
use App\Http\Controllers\SocialAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified', 'admin.redirect'])->name('dashboard');

// About page
Route::get('/about', [AboutController::class, 'index'])->name('about');

// Pre-Registration with Email Verification
Route::get('/pre-register', [PreRegistrationController::class, 'show'])->name('pre-register');
Route::post('/pre-register', [PreRegistrationController::class, 'store'])->name('pre-register.store');
Route::post('/pre-register/resend', [PreRegistrationController::class, 'resend'])->name('pre-register.resend');
Route::get('/pre-register/sent', [PreRegistrationController::class, 'sent'])->name('pre-register.sent');
Route::get('/pre-register/verify/{token}', [PreRegistrationController::class, 'verify'])->name('pre-register.verify');
Route::get('/pre-register/setup/{token}', [PreRegistrationController::class, 'showSetup'])->name('pre-register.setup');
Route::post('/pre-register/complete-setup', [PreRegistrationController::class, 'completeSetup'])->name('pre-register.complete-setup');

// Teacher Application
Route::post('/apply-as-teacher', [TeacherApplicationController::class, 'store'])
    ->name('teacher.apply');

// Admin Setup (Only accessible if no admin exists)
Route::get('/admin/setup', [App\Http\Controllers\Admin\AdminSetupController::class, 'show'])
    ->name('admin.setup');
Route::post('/admin/setup', [App\Http\Controllers\Admin\AdminSetupController::class, 'store']);

// Protected Admin Routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])
        ->name('dashboard');

    // Teacher Applications
    Route::get('/teacher-applications', [AdminTeacherApplicationController::class, 'index'])
        ->name('teacher-applications.index');
    Route::post('/teacher-applications/{user}/approve', [AdminTeacherApplicationController::class, 'approve'])
        ->name('teacher-applications.approve');
    Route::post('/teacher-applications/{user}/reject', [AdminTeacherApplicationController::class, 'reject'])
        ->name('teacher-applications.reject');

    // Pre-Registration Management
    Route::get('/pre-registrations', [PreRegistrationAdminController::class, 'index'])
        ->name('pre-registrations.index');
    Route::get('/pre-registrations/stats', [PreRegistrationAdminController::class, 'stats'])
        ->name('pre-registrations.stats');
    Route::post('/pre-registrations/send-emails', [PreRegistrationAdminController::class, 'sendEmailsToSelected'])
        ->name('pre-registrations.send-emails');
    Route::post('/pre-registrations/send-launch-emails', [PreRegistrationAdminController::class, 'sendLaunchEmails'])
        ->name('pre-registrations.send-launch-emails');
    Route::delete('/pre-registrations/{preRegistration}', [PreRegistrationAdminController::class, 'destroy'])
        ->name('pre-registrations.destroy');

    // App Settings
    Route::get('/settings', [AppSettingsController::class, 'index'])
        ->name('settings.index');
    Route::post('/settings', [AppSettingsController::class, 'update'])
        ->name('settings.update');
    Route::delete('/settings/icon', [AppSettingsController::class, 'removeIcon'])
        ->name('settings.remove-icon');
    Route::post('/settings/mail', [AppSettingsController::class, 'updateMail'])
        ->name('settings.update-mail');
    Route::post('/settings/mail/test', [AppSettingsController::class, 'testMail'])
        ->name('settings.test-mail');
});

// OAuth Routes
Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirect'])
    ->name('auth.redirect');
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback'])
    ->name('auth.callback');

require __DIR__ . '/settings.php';

