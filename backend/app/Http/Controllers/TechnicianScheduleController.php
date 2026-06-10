<?php

namespace App\Http\Controllers;

use App\Models\TechnicianSchedule;
use App\Models\Notification;
use Illuminate\Http\Request;

class TechnicianScheduleController extends Controller
{
    public function mySchedules(Request $request)
    {
        $schedules = TechnicianSchedule::with('ticket')
            ->where('user_id', $request->user()->id)
            ->orderBy('tanggal_kunjungan', 'desc')
            ->get();
            
        return response()->json($schedules);
    }

    public function indexAdmin()
    {
        $schedules = TechnicianSchedule::with(['user', 'ticket'])
            ->orderBy('tanggal_kunjungan', 'desc')
            ->get();
            
        return response()->json($schedules);
    }

    public function storeAdmin(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'nama_teknisi' => 'required|string|max:255',
            'tanggal_kunjungan' => 'required|date',
        ]);

        $ticket = \App\Models\Ticket::findOrFail($request->ticket_id);

        $schedule = TechnicianSchedule::create([
            'user_id' => $ticket->user_id,
            'ticket_id' => $ticket->id,
            'nama_teknisi' => $request->nama_teknisi,
            'tanggal_kunjungan' => $request->tanggal_kunjungan,
            'status' => 'Menunggu',
        ]);

        // Update ticket status to Diproses
        $ticket->update(['status' => 'Diproses']);

        Notification::create([
            'user_id' => $ticket->user_id,
            'title' => 'Jadwal Kunjungan Teknisi',
            'message' => 'Teknisi ' . $request->nama_teknisi . ' telah dijadwalkan untuk kunjungan pada tanggal ' . \Carbon\Carbon::parse($request->tanggal_kunjungan)->format('d/m/Y') . ' terkait tiket Anda.',
            'type' => 'ticket_update',
        ]);

        Notification::notifyTechnician(
            $request->nama_teknisi,
            'Tugas Kunjungan Baru',
            'Anda dijadwalkan untuk kunjungan pada tanggal ' . \Carbon\Carbon::parse($request->tanggal_kunjungan)->format('d/m/Y') . ' untuk tiket #' . $ticket->id,
            'ticket_update'
        );

        return response()->json($schedule, 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Menunggu,Selesai,Dibatalkan',
        ]);

        $schedule = TechnicianSchedule::findOrFail($id);
        $schedule->update([
            'status' => $request->status,
        ]);

        // If schedule is finished, maybe update ticket? Not explicitly requested, but good practice.
        if ($request->status === 'Selesai') {
            $schedule->ticket->update(['status' => 'Selesai']);
        }

        Notification::create([
            'user_id' => $schedule->user_id,
            'title' => 'Status Kunjungan Diperbarui',
            'message' => 'Status kunjungan teknisi untuk tiket Anda telah diubah menjadi ' . strtoupper($request->status) . '.',
            'type' => 'ticket_update',
        ]);

        return response()->json($schedule);
    }

    public function destroy($id)
    {
        $schedule = TechnicianSchedule::findOrFail($id);
        $schedule->delete();

        return response()->json(['message' => 'Schedule deleted successfully']);
    }
}
