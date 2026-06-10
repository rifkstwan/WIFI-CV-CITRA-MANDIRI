<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'paket_id',
        'status',
        'alamat',
        'catatan',
        'tanggal_mulai',
        'tanggal_selesai',
        'total_harga',
        'ip_address',
        'tipe_perangkat',
    ];

    protected $casts = [
        'tanggal_mulai'   => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paket()
    {
        return $this->belongsTo(Paket::class);
    }

    public function upgradeRequests()
    {
        return $this->hasMany(UpgradeRequest::class);
    }
}
