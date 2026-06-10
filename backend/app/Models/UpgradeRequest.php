<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UpgradeRequest extends Model
{
    protected $fillable = [
        'user_id',
        'order_id',
        'old_paket_id',
        'new_paket_id',
        'status',
        'admin_catatan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function oldPaket()
    {
        return $this->belongsTo(Paket::class, 'old_paket_id');
    }

    public function newPaket()
    {
        return $this->belongsTo(Paket::class, 'new_paket_id');
    }
}
