<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeacherPreRegistration;
use Inertia\Inertia;

class TeacherPreRegistrationController extends Controller
{
    /**
     * Display a listing of teacher pre-registrations.
     */
    public function index()
    {
        $preRegistrations = TeacherPreRegistration::latest()->get();

        return Inertia::render('admin/pre-registrations/index', [
            'preRegistrations' => $preRegistrations,
        ]);
    }
}
