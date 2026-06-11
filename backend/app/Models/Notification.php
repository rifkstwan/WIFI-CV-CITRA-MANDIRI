<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'is_read',
        'type',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function notifyAdmins($title, $message, $type = 'system')
    {
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            self::create([
                'user_id' => $admin->id,
                'title' => $title,
                'message' => $message,
                'type' => $type,
            ]);
        }
    }

    public static function notifyTechnician($technicianName, $title, $message, $type = 'ticket')
    {
        // Find technician by name using Spatie permission scope
        $technician = User::role('teknisi')->where('name', $technicianName)->first();
        if ($technician) {
            self::create([
                'user_id' => $technician->id,
                'title' => $title,
                'message' => $message,
                'type' => $type,
            ]);
        }
    }
}
