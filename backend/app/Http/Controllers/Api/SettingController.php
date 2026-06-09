<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        // Return settings as a key-value pair object
        $settings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'status' => 'success',
            'data' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array'
        ]);

        foreach ($request->settings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        // Return updated settings
        $settings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'status' => 'success',
            'message' => 'Pengaturan berhasil diperbarui',
            'data' => $settings
        ]);
    }
}
