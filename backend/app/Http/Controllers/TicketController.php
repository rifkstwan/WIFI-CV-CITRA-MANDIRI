<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use App\Services\WhatsAppService;

class TicketController extends Controller
{
    public function myTickets(Request $request)
    {
        $tickets = Ticket::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'prioritas' => 'in:rendah,sedang,tinggi',
            'foto' => 'nullable|image|max:5120'
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('tickets', 'public');
        }

        $ticket = Ticket::create([
            'user_id' => $request->user()->id,
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'prioritas' => $request->prioritas ?? 'sedang',
            'status' => 'menunggu',
            'foto' => $fotoPath
        ]);

        return response()->json($ticket, 201);
    }

    public function indexAdmin()
    {
        $tickets = Ticket::with('user')
            ->orderByRaw("CASE 
                WHEN status = 'menunggu' THEN 1
                WHEN status = 'diproses' THEN 2
                WHEN status = 'selesai' THEN 3
                ELSE 4
            END")
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($tickets);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:menunggu,diproses,selesai'
        ]);

        $ticket = Ticket::findOrFail($id);
        $ticket->status = $request->status;
        $ticket->save();

        $ticket->load('user');

        try {
            WhatsAppService::sendTicketUpdateNotification($ticket->user, $ticket);
        } catch (\Exception $e) {
            \Log::error('Gagal kirim WA ticket update: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Status tiket berhasil diubah', 'ticket' => $ticket]);
    }

    public function uploadFoto(Request $request, $id)
    {
        $request->validate([
            'foto' => 'required|image|max:5120',
            'status' => 'required|in:menunggu,diproses,selesai'
        ]);

        $ticket = Ticket::findOrFail($id);

        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('tickets/proof', 'public');
            // If you want to save the proof photo to the same 'foto' column or a new one.
            // For now let's just overwrite 'foto' since it's the technician's proof.
            $ticket->foto = $fotoPath;
        }

        $ticket->status = $request->status;
        $ticket->save();

        $ticket->load('user');

        try {
            WhatsAppService::sendTicketUpdateNotification($ticket->user, $ticket);
        } catch (\Exception $e) {
            \Log::error('Gagal kirim WA ticket photo update: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Bukti foto berhasil diunggah', 'ticket' => $ticket]);
    }
}
