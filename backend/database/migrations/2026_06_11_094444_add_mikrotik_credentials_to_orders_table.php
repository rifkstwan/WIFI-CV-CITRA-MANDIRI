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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('mikrotik_username')->nullable()->after('tipe_perangkat');
            $table->string('mikrotik_password')->nullable()->after('mikrotik_username');
            $table->foreignId('network_device_id')->nullable()->constrained('network_devices')->nullOnDelete()->after('mikrotik_password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['network_device_id']);
            $table->dropColumn(['mikrotik_username', 'mikrotik_password', 'network_device_id']);
        });
    }
};
