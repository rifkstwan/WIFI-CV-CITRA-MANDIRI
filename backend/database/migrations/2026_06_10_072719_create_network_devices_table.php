<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('network_devices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['Router', 'Switch', 'OLT', 'Access Point', 'Server', 'Other'])->default('Router');
            $table->string('ip_address');
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->string('api_port')->nullable()->default('8728');
            $table->boolean('is_active')->default(true);
            $table->string('status')->default('offline'); // online, offline, warning
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('network_devices');
    }
};
