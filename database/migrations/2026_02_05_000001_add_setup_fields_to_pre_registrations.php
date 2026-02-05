<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pre_registrations', function (Blueprint $table) {
            $table->string('setup_token')->nullable()->unique()->after('email_verified_at');
            $table->timestamp('setup_email_sent_at')->nullable()->after('setup_token');
            $table->string('role')->nullable()->after('setup_email_sent_at');
            $table->timestamp('setup_completed_at')->nullable()->after('role');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete()->after('setup_completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pre_registrations', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['setup_token', 'setup_email_sent_at', 'role', 'setup_completed_at', 'user_id']);
        });
    }
};
