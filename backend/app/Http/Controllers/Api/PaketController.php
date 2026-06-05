<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paket;
use Illuminate\Http\Request;

class PaketController extends Controller
{
    // Public — semua bisa lihat
    public function index()
    {
        $pakets = Paket::where('is_aktif', true)->orderBy('harga')->get();
        return response()->json($pakets);
    }

    public function show($id)
    {
        $paket = Paket::findOrFail($id);
        return response()->json($paket);
    }

    // Admin only
    public function store(Request $request)
    {
        $request->validate([
            'nama'      => 'required|string|max:255',
            'kecepatan' => 'required|integer|min:1',
            'harga'     => 'required|integer|min:0',
            'durasi'    => 'required|integer|min:1',
            'deskripsi' => 'nullable|string',
        ]);

        $paket = Paket::create($request->all());
        return response()->json($paket, 201);
    }

    public function update(Request $request, $id)
    {
        $paket = Paket::findOrFail($id);
        $paket->update($request->all());
        return response()->json($paket);
    }

    public function destroy($id)
    {
        $paket = Paket::findOrFail($id);
        $paket->delete();
        return response()->json(['message' => 'Paket dihapus']);
    }
}
