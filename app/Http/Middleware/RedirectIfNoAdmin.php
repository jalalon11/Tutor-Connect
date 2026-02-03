<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfNoAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If visiting login and no admin exists, redirect to setup
        if ($request->is('login') && !User::where('is_admin', true)->exists()) {
            return redirect()->route('admin.setup');
        }

        return $next($request);
    }
}
