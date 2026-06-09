<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use App\Models\Order;
use Illuminate\Http\Request;

class BillingController extends Controller
{
    public function indexAdmin()
    {
        $billings = Billing::with(['user', 'order.paket'])->orderBy('created_at', 'desc')->get();
        return response()->json($billings);
    }

    public function myBillings()
    {
        $billings = Billing::with(['order.paket'])
            ->where('user_id', auth()->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($billings);
    }

    public function storeAdmin(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'jumlah_tagihan' => 'required|integer|min:0',
            'jatuh_tempo' => 'required|date',
            'status' => 'required|in:unpaid,paid,overdue'
        ]);

        $order = Order::findOrFail($request->order_id);

        $billing = Billing::create([
            'user_id' => $order->user_id,
            'order_id' => $order->id,
            'jumlah_tagihan' => $request->jumlah_tagihan,
            'jatuh_tempo' => $request->jatuh_tempo,
            'status' => $request->status,
            'tanggal_bayar' => $request->status === 'paid' ? now() : null,
        ]);

        return response()->json($billing, 201);
    }

    public function markAsPaid($id)
    {
        $billing = Billing::findOrFail($id);
        $billing->update([
            'status' => 'paid',
            'tanggal_bayar' => now(),
        ]);

        return response()->json(['message' => 'Tagihan berhasil ditandai lunas', 'billing' => $billing]);
    }
}
