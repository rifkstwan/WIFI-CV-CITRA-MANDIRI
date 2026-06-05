<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class OwnerUserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames()->values(),
                ];
            });

        return response()->json($users);
    }
}
