<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OwnerUserController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaketController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register',   [AuthController::class, 'register']);
Route::post('/login',      [AuthController::class, 'login']);
Route::get('/pakets',      [PaketController::class, 'index']);
Route::get('/pakets/{id}', [PaketController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me',      [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile
    Route::get('/profile',          [ProfileController::class, 'show']);
    Route::put('/profile',          [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    // Order — customer
    Route::get('/orders/my',   [OrderController::class, 'myOrders']);
    Route::post('/orders',     [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // Admin + Owner
    Route::middleware('role:admin|owner')->group(function () {
        Route::post('/pakets',        [PaketController::class, 'store']);
        Route::put('/pakets/{id}',    [PaketController::class, 'update']);
        Route::delete('/pakets/{id}', [PaketController::class, 'destroy']);

        Route::get('/orders',               [OrderController::class, 'index']);
        Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        Route::get('/reports/summary', [ReportController::class, 'summary']);
    });

   // Owner only - monitoring only
Route::middleware('role:owner')->group(function () {
    Route::get('/owner/users', [OwnerUserController::class, 'index']);
    Route::get('/owner/reports/summary', [ReportController::class, 'summary']);
});
});
