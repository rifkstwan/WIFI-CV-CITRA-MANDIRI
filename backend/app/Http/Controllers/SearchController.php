<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\Ticket;
use App\Models\Order;
use App\Models\Notification;
use App\Models\Paket;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->query('q', '');
        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $user = $request->user();
        $isAdmin = $user->hasRole('admin');
        $results = [];

        if ($isAdmin) {
            // Admin Search
            // 1. Users
            $users = User::where('name', 'like', "%{$q}%")
                ->orWhere('email', 'like', "%{$q}%")
                ->limit(3)->get();
            foreach ($users as $u) {
                $results[] = [
                    'id' => 'user_' . $u->id,
                    'title' => $u->name,
                    'subtitle' => $u->email,
                    'type' => 'user',
                    'url' => '/dashboard/users',
                    'created_at' => $u->created_at,
                ];
            }

            // 2. Tickets
            $tickets = Ticket::where('judul', 'like', "%{$q}%")
                ->orWhere('deskripsi', 'like', "%{$q}%")
                ->limit(3)->get();
            foreach ($tickets as $t) {
                $results[] = [
                    'id' => 'ticket_' . $t->id,
                    'title' => $t->judul,
                    'subtitle' => 'Status: ' . ucfirst($t->status),
                    'type' => 'ticket',
                    'url' => '/dashboard/tickets',
                    'created_at' => $t->created_at,
                ];
            }

            // 3. Orders
            $orders = Order::where(function($qBuilder) use ($q) {
                if (strtolower($q) === 'paket' || strtolower($q) === 'layanan') {
                    $qBuilder->whereNotNull('id');
                } else {
                    $qBuilder->whereHas('user', function($query) use ($q) {
                        $query->where('name', 'like', "%{$q}%");
                    })->orWhereHas('paket', function($query) use ($q) {
                        $query->where('nama', 'like', "%{$q}%");
                    });
                }
            })->limit(3)->get();
            foreach ($orders as $o) {
                $results[] = [
                    'id' => 'order_' . $o->id,
                    'title' => 'Layanan ' . ($o->paket ? $o->paket->nama : ''),
                    'subtitle' => 'Pelanggan: ' . ($o->user ? $o->user->name : ''),
                    'type' => 'order',
                    'url' => '/dashboard/orders',
                    'created_at' => $o->created_at,
                ];
            }

            // 4. Paket (General Search for packages)
            $pakets = Paket::where('nama', 'like', "%{$q}%")
                ->orWhere(function($query) use ($q) {
                    if (str_contains(strtolower('paket internet langganan'), strtolower($q))) {
                        $query->whereNotNull('id');
                    }
                })->limit(2)->get();
            foreach ($pakets as $p) {
                $results[] = [
                    'id' => 'paket_' . $p->id,
                    'title' => 'Paket ' . $p->nama,
                    'subtitle' => 'Kelola paket internet',
                    'type' => 'order',
                    'url' => '/dashboard/packages',
                    'created_at' => $p->created_at ?? now(),
                ];
            }
        } else {
            // Customer Search

            // 0. Static Menus (Navigation Shortcuts)
            $staticMenus = [
                ['name' => 'Dashboard', 'url' => '/dashboard', 'icon' => 'home'],
                ['name' => 'Layanan Saya', 'url' => '/dashboard/services', 'icon' => 'globe'],
                ['name' => 'Beli Paket / Order', 'url' => '/order', 'icon' => 'globe'],
                ['name' => 'Tagihan & Pembayaran', 'url' => '/dashboard/billing', 'icon' => 'credit-card'],
                ['name' => 'Pengaduan & Tiket', 'url' => '/dashboard/tickets', 'icon' => 'wrench'],
                ['name' => 'Jadwal Teknisi', 'url' => '/dashboard/schedule', 'icon' => 'calendar'],
                ['name' => 'Notifikasi', 'url' => '/dashboard/notifications', 'icon' => 'bell'],
                ['name' => 'Profil Saya', 'url' => '/profile', 'icon' => 'user'],
                ['name' => 'Pengaturan Akun', 'url' => '/dashboard/settings', 'icon' => 'settings'],
            ];

            foreach ($staticMenus as $menu) {
                if (str_contains(strtolower($menu['name']), strtolower($q)) || 
                   (strtolower($q) === 'tagihan' && str_contains($menu['name'], 'Tagihan')) ||
                   (strtolower($q) === 'paket' && str_contains($menu['name'], 'Layanan')) ||
                   (strtolower($q) === 'bayar' && str_contains($menu['name'], 'Tagihan'))) {
                    
                    // Avoid duplicate static menus
                    $exists = collect($results)->contains('title', 'Menu: ' . $menu['name']);
                    if (!$exists) {
                        $results[] = [
                            'id' => 'menu_' . Str::slug($menu['name']),
                            'title' => 'Menu: ' . $menu['name'],
                            'subtitle' => 'Jalan pintas ke halaman ' . $menu['name'],
                            'type' => $menu['icon'] === 'wrench' ? 'ticket' : ($menu['icon'] === 'user' ? 'user' : 'order'),
                            'url' => $menu['url'],
                            'created_at' => now()->toDateTimeString(), // Ensure it shows up
                        ];
                    }
                }
            }

            // 1. Tickets
            $tickets = Ticket::where('user_id', $user->id)
                ->where(function($query) use ($q) {
                    $query->where('judul', 'like', "%{$q}%")
                          ->orWhere('deskripsi', 'like', "%{$q}%");
                    if (in_array(strtolower($q), ['tiket', 'pengaduan', 'komplain', 'rusak', 'mati'])) {
                         $query->orWhereNotNull('id'); // return all user's tickets for generic terms
                    }
                })->limit(3)->get();
            foreach ($tickets as $t) {
                $results[] = [
                    'id' => 'ticket_' . $t->id,
                    'title' => $t->judul,
                    'subtitle' => 'Status: ' . ucfirst($t->status),
                    'type' => 'ticket',
                    'url' => '/dashboard/tickets',
                    'created_at' => $t->created_at,
                ];
            }

            // 2. Orders
            $orders = Order::where('user_id', $user->id)
                ->where(function($qBuilder) use ($q) {
                    if (strtolower($q) === 'paket' || strtolower($q) === 'layanan') {
                        $qBuilder->whereNotNull('id'); // Match all if keyword is generic
                    } else {
                        $qBuilder->whereHas('paket', function($query) use ($q) {
                            $query->where('nama', 'like', "%{$q}%");
                        });
                    }
                })->limit(3)->get();
            foreach ($orders as $o) {
                $results[] = [
                    'id' => 'order_' . $o->id,
                    'title' => 'Layanan ' . ($o->paket ? $o->paket->nama : ''),
                    'subtitle' => 'Status: ' . ucfirst($o->status),
                    'type' => 'order',
                    'url' => '/dashboard/services',
                    'created_at' => $o->created_at,
                ];
            }

            // 2.5 Paket (General Search for packages)
            if (str_contains(strtolower('paket internet langganan'), strtolower($q))) {
                $pakets = Paket::limit(2)->get();
                foreach ($pakets as $p) {
                    $results[] = [
                        'id' => 'paket_' . $p->id,
                        'title' => 'Paket ' . $p->nama,
                        'subtitle' => 'Lihat detail paket internet',
                        'type' => 'order',
                        'url' => '/order', // Route to buy/view packages
                        'created_at' => $p->created_at ?? now(),
                    ];
                }
            }

            // 2.8 Technician Schedule
            $schedules = \App\Models\TechnicianSchedule::whereHas('ticket', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })->where(function($query) use ($q) {
                $query->where('nama_teknisi', 'like', "%{$q}%")
                      ->orWhere('status', 'like', "%{$q}%");
                if (in_array(strtolower($q), ['jadwal', 'teknisi'])) {
                    $query->orWhereNotNull('id');
                }
            })->limit(3)->get();
            foreach ($schedules as $s) {
                $results[] = [
                    'id' => 'schedule_' . $s->id,
                    'title' => 'Teknisi: ' . $s->nama_teknisi,
                    'subtitle' => 'Tanggal: ' . $s->tanggal_kunjungan,
                    'type' => 'ticket',
                    'url' => '/dashboard/schedule',
                    'created_at' => $s->created_at,
                ];
            }

            // 3. Notifications
            $notifs = Notification::where('user_id', $user->id)
                ->where(function($query) use ($q) {
                    $query->where('title', 'like', "%{$q}%")
                          ->orWhere('message', 'like', "%{$q}%");
                })->limit(3)->get();
            foreach ($notifs as $n) {
                $results[] = [
                    'id' => 'notif_' . $n->id,
                    'title' => $n->title,
                    'subtitle' => Str::limit($n->message, 50),
                    'type' => 'notification',
                    'url' => '/dashboard/notifications',
                    'created_at' => $n->created_at,
                ];
            }
        }

        // Sort globally by created_at desc (newest first)
        usort($results, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        return response()->json($results);
    }
}
