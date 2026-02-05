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
        'setup_token',
        'setup_email_sent_at',
        'role',
        'setup_completed_at',
        'user_id',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'setup_email_sent_at' => 'datetime',
        'setup_completed_at' => 'datetime',
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
     * Check if setup email has been sent.
     */
    public function hasSetupEmailSent(): bool
    {
        return $this->setup_email_sent_at !== null;
    }

    /**
     * Check if ready for account setup (verified, has setup token, not completed).
     */
    public function isReadyForSetup(): bool
    {
        return $this->isVerified()
            && $this->setup_token !== null
            && $this->setup_completed_at === null;
    }

    /**
     * Check if setup is complete.
     */
    public function isSetupComplete(): bool
    {
        return $this->setup_completed_at !== null;
    }

    /**
     * Generate setup token and mark email as sent.
     */
    public function generateSetupToken(): void
    {
        $this->update([
            'setup_token' => self::generateToken(),
            'setup_email_sent_at' => now(),
        ]);
    }

    /**
     * Mark setup as complete with user reference.
     */
    public function markSetupComplete(int $userId): void
    {
        $this->update([
            'setup_completed_at' => now(),
            'user_id' => $userId,
        ]);
    }

    /**
     * Get the associated user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get full name.
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}
