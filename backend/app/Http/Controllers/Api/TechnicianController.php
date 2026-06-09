<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Order;
use Illuminate\Http\Request;

class TechnicianController extends Controller
{
    public function dashboard(Request $request)
    {
        // For Phase 1, we pull global stats.
        $tickets = Ticket::with('user')->whereIn('status', ['menunggu', 'diproses'])->get();
        $orders = Order::with(['user', 'paket'])->where('status', 'proses')->get();
        
        $activeTicketsCount = $tickets->count();
        $newInstallationsCount = $orders->count();
        
        $schedules = [];
        $hour = 8; // Mulai dari jam 08:00
        
        foreach ($orders as $order) {
            $schedules[] = [
                'id' => 'ord-'.$order->id,
                'type' => 'instalasi',
                'time' => sprintf('%02d:00', $hour) . ' - Menunggu',
                'title' => 'Instalasi Baru (' . ($order->paket->nama ?? 'Paket') . ')',
                'subtitle' => $order->user->address ?? 'Alamat tidak tersedia',
                'color' => 'blue',
            ];
            $hour += 2;
        }
        
        foreach ($tickets as $ticket) {
            $schedules[] = [
                'id' => 'tkt-'.$ticket->id,
                'type' => 'gangguan',
                'time' => sprintf('%02d:00', $hour) . ' - ' . ucfirst($ticket->status),
                'title' => 'Perbaikan: ' . $ticket->judul,
                'subtitle' => ($ticket->user->name ?? 'Pelanggan') . ' (TKT-' . $ticket->id . ')',
                'color' => 'amber',
            ];
            $hour += 2;
        }
        
        return response()->json([
            'tugasHariIni' => $activeTicketsCount + $newInstallationsCount,
            'gangguanAktif' => $activeTicketsCount,
            'instalasiBaru' => $newInstallationsCount,
            'surveyLokasi' => 0, 
            'schedules' => $schedules
        ]);
    }
}
