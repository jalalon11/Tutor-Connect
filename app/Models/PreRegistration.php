<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PreRegistration extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'verification_token',
        'email_verified_at',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Generate a unique verification token.
     */
    public static function generateToken(): string
    {
        return Str::random(64);
    }

    /**
     * Check if email is verified.
     */
    public function isVerified(): bool
    {
        return $this->email_verified_at !== null;
    }

    /**
     * Mark email as verified.
     */
    public function markAsVerified(): void
    {
        $this->update(['email_verified_at' => now()]);
    }

    /**
     * Get full name.
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}
