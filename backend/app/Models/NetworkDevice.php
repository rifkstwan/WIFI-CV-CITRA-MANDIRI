<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NetworkDevice extends Model
{
    protected $fillable = [
        'name',
        'type',
        'ip_address',
        'username',
        'password',
        'api_port',
        'is_active',
        'status',
        'last_seen_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_seen_at' => 'datetime',
    ];

    protected $hidden = [
        'password',
    ];
}
