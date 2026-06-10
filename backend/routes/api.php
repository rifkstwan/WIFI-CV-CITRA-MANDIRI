<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OwnerUserController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaketController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\BillingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TechnicianScheduleController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\NetworkDeviceController;
use App\Http\Controllers\TechnicianAccountController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register',   [AuthController::class, 'register']);
Route::post('/login',      [AuthController::class, 'login']);
Route::get('/pakets',      [PaketController::class, 'index']);
Route::get('/pakets/{id}', [PaketController::class, 'show']);
Route::post('/midtrans/webhook', [PaymentController::class, 'webhook']);
Route::get('/testimonials/public', [App\Http\Controllers\Api\TestimonialController::class, 'publicIndex']);
Route::get('/settings/public', [App\Http\Controllers\Api\SettingController::class, 'publicIndex']);

// Network Devices Routes
Route::get('/network-devices/status', [NetworkDeviceController::class, 'status']);
Route::apiResource('network-devices', NetworkDeviceController::class);

Route::apiResource('technician-accounts', TechnicianAccountController::class);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me',      [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile
    Route::get('/profile',          [ProfileController::class, 'show']);
    Route::put('/profile',          [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    Route::get('/search', [SearchController::class, 'index']);

    // Order — customer
    // Order — customer
    // Pemesanan & Pembayaran Midtrans (Pemasangan Baru)
    Route::get('/orders/my',         [OrderController::class, 'myOrders']);
    Route::get('/orders/{id}',       [OrderController::class, 'show']);
    Route::post('/orders',           [OrderController::class, 'store']);
    Route::post('/orders/{id}/pay',  [PaymentController::class, 'getSnapToken']);

    // Tagihan Bulanan (Customer)
    Route::get('/my-billings',       [BillingController::class, 'myBillings']);
    Route::post('/billings/{id}/pay',[PaymentController::class, 'getBillingSnapToken']);
    Route::get('/traffic/my',  [OrderController::class, 'myTraffic']);

    // Tickets - customer
    Route::get('/tickets',     [TicketController::class, 'myTickets']);
    Route::post('/tickets',    [TicketController::class, 'store']);

    // Schedules
    Route::get('/schedules/my', [TechnicianScheduleController::class, 'mySchedules']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // Testimonials
    Route::get('/testimonials/my', [App\Http\Controllers\Api\TestimonialController::class, 'myTestimonial']);
    Route::post('/testimonials', [App\Http\Controllers\Api\TestimonialController::class, 'store']);

    // Admin + Owner
    Route::middleware('role:admin|owner')->group(function () {
        // Tiket Gangguan
        Route::get('/admin/tickets', [TicketController::class, 'indexAdmin']);
        Route::patch('/admin/tickets/{id}/status', [TicketController::class, 'updateStatus']);

        // Jadwal Teknisi
        Route::get('/admin/technician-schedules', [TechnicianScheduleController::class, 'indexAdmin']);
        Route::post('/admin/technician-schedules', [TechnicianScheduleController::class, 'storeAdmin']);
        Route::patch('/admin/technician-schedules/{id}/status', [TechnicianScheduleController::class, 'updateStatus']);
        Route::delete('/admin/technician-schedules/{id}', [TechnicianScheduleController::class, 'destroy']);


        // Pembayaran & Tagihan
        Route::get('/admin/payments', [PaymentController::class, 'indexAdmin']);
        Route::get('/admin/billings', [BillingController::class, 'indexAdmin']);
        Route::post('/admin/billings', [BillingController::class, 'storeAdmin']);
        Route::patch('/admin/billings/{id}/pay', [BillingController::class, 'markAsPaid']);
        Route::get('/admin/pakets',   [PaketController::class, 'indexAdmin']);
        Route::post('/pakets',        [PaketController::class, 'store']);
        Route::put('/pakets/{id}',    [PaketController::class, 'update']);
        Route::delete('/pakets/{id}', [PaketController::class, 'destroy']);

        Route::get('/orders',               [OrderController::class, 'index']);
        Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        Route::get('/reports/summary', [ReportController::class, 'summary']);

        Route::get('/customers', [CustomerController::class, 'index']);
        Route::post('/customers', [CustomerController::class, 'store']);
        Route::put('/customers/{id}', [CustomerController::class, 'update']);
        Route::delete('/customers/{id}', [CustomerController::class, 'destroy']);
        Route::patch('/customers/{id}/status', [CustomerController::class, 'updateStatus']);

        // Testimonials
        Route::get('/admin/testimonials', [App\Http\Controllers\Api\TestimonialController::class, 'indexAdmin']);
        Route::patch('/admin/testimonials/{id}/status', [App\Http\Controllers\Api\TestimonialController::class, 'updateStatus']);
        Route::delete('/admin/testimonials/{id}', [App\Http\Controllers\Api\TestimonialController::class, 'destroy']);

        // Settings
        Route::get('/settings', [App\Http\Controllers\Api\SettingController::class, 'index']);
        Route::post('/settings', [App\Http\Controllers\Api\SettingController::class, 'update']);
    });

    // Owner only - monitoring only
    Route::middleware('role:owner')->group(function () {
        Route::get('/owner/users', [OwnerUserController::class, 'index']);
        Route::get('/owner/reports/summary', [ReportController::class, 'summary']);
    });

    // Technician
    Route::middleware('role:teknisi|admin')->group(function () {
        Route::get('/technician/dashboard', [\App\Http\Controllers\Api\TechnicianController::class, 'dashboard']);
        
        // Tiket Gangguan (Teknisi)
        Route::get('/technician/tickets', [TicketController::class, 'indexAdmin']); // Reusing admin method for now
        Route::patch('/technician/tickets/{id}/status', [TicketController::class, 'updateStatus']);
        Route::post('/technician/tickets/{id}/upload', [TicketController::class, 'uploadFoto']);

        // Instalasi Baru (Teknisi)
        Route::get('/technician/installations', [OrderController::class, 'index']); // Reusing admin method
        Route::patch('/technician/installations/{id}/status', [OrderController::class, 'updateStatus']);
    });
});
