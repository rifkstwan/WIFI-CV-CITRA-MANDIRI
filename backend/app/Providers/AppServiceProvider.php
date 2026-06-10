<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;
use App\Models\Setting;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        try {
            if (Schema::hasTable('settings')) {
                $settings = Setting::all()->pluck('value', 'key')->toArray();

                if (!empty($settings['smtp_host'])) {
                    Config::set('mail.mailers.smtp.host', $settings['smtp_host']);
                    Config::set('mail.mailers.smtp.port', $settings['smtp_port'] ?? 587);
                    Config::set('mail.mailers.smtp.username', $settings['smtp_username'] ?? '');
                    Config::set('mail.mailers.smtp.password', $settings['smtp_password'] ?? '');
                    
                    if (!empty($settings['smtp_from_name']) || !empty($settings['smtp_username'])) {
                        Config::set('mail.from.address', $settings['smtp_username'] ?? 'admin@example.com');
                        Config::set('mail.from.name', $settings['smtp_from_name'] ?? 'Admin');
                    }
                }
            }
        } catch (\Exception $e) {
            // Silently ignore if database is not available yet
            \Log::warning('Failed to load SMTP settings: ' . $e->getMessage());
        }
    }
}
