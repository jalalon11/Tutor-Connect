<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class AppearanceController extends Controller
{
    /**
     * Update the user's appearance preference.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'appearance' => 'required|in:light,dark,system',
        ]);

        // Log the appearance change for admin users
        if ($request->user()->hasRole('admin')) {
            ActivityLog::log(
                'appearance_changed',
                "Changed appearance theme to {$validated['appearance']}",
                ['theme' => $validated['appearance']]
            );
        }

        return response()->json(['success' => true]);
    }
}
