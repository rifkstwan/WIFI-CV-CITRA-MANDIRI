<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function summary()
    {
        // Total pendapatan keseluruhan
        $totalPendapatan = Order::where('status', 'aktif')
            ->orWhere('status', 'selesai')
            ->sum('total_harga');

        // Pendapatan bulan ini
        $pendapatanBulanIni = Order::whereIn('status', ['aktif', 'selesai'])
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_harga');

        // Total pelanggan aktif
        $pelangganAktif = Order::where('status', 'aktif')->count();

        // Total semua order
        $totalOrder = Order::count();

        // Order pending
        $orderPending = Order::where('status', 'pending')->count();

        // Paket terlaris
        $paketTerlaris = Order::with('paket')
            ->select('paket_id', DB::raw('count(*) as total'))
            ->whereIn('status', ['aktif', 'selesai'])
            ->groupBy('paket_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(fn($o) => [
                'nama'  => $o->paket->nama,
                'total' => $o->total,
            ]);

        // Pendapatan per bulan (6 bulan terakhir)
        $pendapatanPerBulan = Order::whereIn('status', ['aktif', 'selesai'])
            ->where('created_at', '>=', now()->subMonths(6))
            ->select(
                DB::raw('YEAR(created_at) as tahun'),
                DB::raw('MONTH(created_at) as bulan'),
                DB::raw('SUM(total_harga) as total')
            )
            ->groupBy('tahun', 'bulan')
            ->orderBy('tahun')
            ->orderBy('bulan')
            ->get()
            ->map(fn($row) => [
                'bulan' => \Carbon\Carbon::create($row->tahun, $row->bulan)->translatedFormat('M Y'),
                'total' => (int) $row->total,
            ]);

        // Status order breakdown
        $statusBreakdown = Order::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn($row) => [$row->status => $row->total]);

        return response()->json([
            'total_pendapatan'      => $totalPendapatan,
            'pendapatan_bulan_ini'  => $pendapatanBulanIni,
            'pelanggan_aktif'       => $pelangganAktif,
            'total_order'           => $totalOrder,
            'order_pending'         => $orderPending,
            'paket_terlaris'        => $paketTerlaris,
            'pendapatan_per_bulan'  => $pendapatanPerBulan,
            'status_breakdown'      => $statusBreakdown,
        ]);
    }
}
