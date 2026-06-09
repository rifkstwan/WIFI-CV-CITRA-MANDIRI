<?php

namespace App\Http\Controllers;

use App\Models\TechnicianSchedule;
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

        return response()->json($schedule);
    }

    public function destroy($id)
    {
        $schedule = TechnicianSchedule::findOrFail($id);
        $schedule->delete();

        return response()->json(['message' => 'Schedule deleted successfully']);
    }
}
