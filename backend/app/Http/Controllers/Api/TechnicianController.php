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
        $technicianName = $request->user()->name;

        // Ambil jadwal sungguhan untuk teknisi yang sedang login
        $realSchedules = \App\Models\TechnicianSchedule::with(['ticket', 'ticket.user', 'order', 'order.user', 'order.paket'])
            ->where('nama_teknisi', $technicianName)
            ->whereIn('status', ['menunggu', 'berangkat', 'pengerjaan'])
            ->orderBy('tanggal_kunjungan', 'asc')
            ->get();

        $activeTicketsCount = 0;
        $newInstallationsCount = 0;
        $schedules = [];

        foreach ($realSchedules as $schedule) {
            $isOrder = !is_null($schedule->order_id);
            if ($isOrder) {
                $newInstallationsCount++;
                $type = 'instalasi';
                $title = 'Instalasi Baru (' . ($schedule->order->paket->nama ?? 'Paket') . ')';
                $subtitle = $schedule->order->user->address ?? $schedule->order->alamat ?? 'Alamat tidak tersedia';
                $color = 'blue';
                $id = 'ord-' . $schedule->order_id;
            } else {
                $activeTicketsCount++;
                $type = 'gangguan';
                $title = 'Perbaikan: ' . ($schedule->ticket->judul ?? 'Gangguan');
                $subtitle = ($schedule->ticket->user->name ?? 'Pelanggan') . ' (TKT-' . $schedule->ticket_id . ')';
                $color = 'amber';
                $id = 'tkt-' . $schedule->ticket_id;
            }

            $schedules[] = [
                'id' => $id,
                'schedule_id' => $schedule->id,
                'type' => $type,
                'time' => \Carbon\Carbon::parse($schedule->tanggal_kunjungan)->format('H:i') . ' - ' . ucfirst($schedule->status),
                'title' => $title,
                'subtitle' => $subtitle,
                'color' => $color,
            ];
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
