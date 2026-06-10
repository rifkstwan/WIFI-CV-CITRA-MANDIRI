<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paket extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'deskripsi',
        'kecepatan',
        'fup',
        'harga',
        'durasi',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
    ];

    public function upgradeRequestsAsOld()
    {
        return $this->hasMany(UpgradeRequest::class, 'old_paket_id');
    }

    public function upgradeRequestsAsNew()
    {
        return $this->hasMany(UpgradeRequest::class, 'new_paket_id');
    }
}
