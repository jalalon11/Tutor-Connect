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
        Schema::create('teacher_pre_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->json('subjects')->nullable();
            $table->integer('experience_years')->nullable();
            $table->text('bio')->nullable();
            $table->string('provider')->default('email'); // email, google, facebook
            $table->string('provider_id')->nullable();
            $table->string('avatar_url')->nullable();
            $table->enum('status', ['draft', 'pending', 'approved'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_pre_registrations');
    }
};
