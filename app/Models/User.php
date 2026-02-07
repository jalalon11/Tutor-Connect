<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, \App\Traits\HasRoles;

    public const ROLE_STUDENT = 'student';
    public const ROLE_TEACHER = 'teacher';

    public const TEACHER_STATUS_PENDING = 'pending';
    public const TEACHER_STATUS_APPROVED = 'approved';
    public const TEACHER_STATUS_REJECTED = 'rejected';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'is_admin',
        'role',
        'teacher_status',
        'phone',
        'subjects',
        'experience_years',
        'bio',
        'avatar_url',
        'applied_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'name',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'subjects' => 'array',
            'experience_years' => 'integer',
            'is_admin' => 'boolean',
            'applied_at' => 'datetime',
        ];
    }

    /**
     * Check if user is a student.
     */
    public function isStudent(): bool
    {
        return $this->role === self::ROLE_STUDENT;
    }

    /**
     * Check if user is an approved teacher.
     */
    public function isTeacher(): bool
    {
        return $this->role === self::ROLE_TEACHER && $this->teacher_status === self::TEACHER_STATUS_APPROVED;
    }

    /**
     * Check if user has a pending teacher application.
     */
    public function hasPendingApplication(): bool
    {
        return $this->role === self::ROLE_TEACHER && $this->teacher_status === self::TEACHER_STATUS_PENDING;
    }

    /**
     * Apply as a teacher.
     */
    public function applyAsTeacher(array $data): void
    {
        $this->update([
            'role' => self::ROLE_TEACHER,
            'teacher_status' => self::TEACHER_STATUS_PENDING,
            'phone' => $data['phone'] ?? null,
            'subjects' => $data['subjects'] ?? null,
            'experience_years' => $data['experience_years'] ?? null,
            'bio' => $data['bio'] ?? null,
            'applied_at' => now(),
        ]);
    }

    /**
     * Get the user's name.
     */
    public function getNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get full name (alias for name for compatibility).
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}
