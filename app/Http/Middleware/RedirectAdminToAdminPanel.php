<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectAdminToAdminPanel
{
    /**
     * Handle an incoming request.
     * Redirect admin users to admin dashboard if they try to access regular user routes.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->is_admin) {
            return redirect('/admin/dashboard');
        }

        return $next($request);
    }
}
