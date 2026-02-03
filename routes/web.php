<?php

use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\TeacherPreRegistrationController;
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
})->middleware(['auth', 'verified'])->name('dashboard');

// Teacher Pre-Registration
Route::post('/teacher/pre-register', [TeacherPreRegistrationController::class, 'store'])
    ->name('teacher.pre-register');

// Admin Setup (Only accessible if no admin exists)
Route::get('/admin/setup', [App\Http\Controllers\Admin\AdminSetupController::class, 'show'])
    ->name('admin.setup');
Route::post('/admin/setup', [App\Http\Controllers\Admin\AdminSetupController::class, 'store']);

// Protected Admin Routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/teacher-pre-registrations', [App\Http\Controllers\Admin\TeacherPreRegistrationController::class, 'index'])
        ->name('admin.teacher-pre-registrations.index');
});

// OAuth Routes
Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirect'])
    ->name('auth.redirect');
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback'])
    ->name('auth.callback');

require __DIR__ . '/settings.php';

