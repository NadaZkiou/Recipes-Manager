<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Skip CSRF for your API auth routes:
        'api/register',
        'api/login',
        // And if you ever POST to other API endpoints:
        'api/*',
    ];
}
