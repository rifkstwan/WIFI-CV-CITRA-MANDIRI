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
    public function indexAdmin()
    {
        // Admin bisa melihat semua paket termasuk yang tidak aktif
        $pakets = Paket::orderBy('harga')->get();
        return response()->json($pakets);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama'      => 'required|string|max:255',
            'kecepatan' => 'required|integer|min:1',
            'harga'     => 'required|integer|min:0',
            'durasi'    => 'required|integer|min:1',
            'deskripsi' => 'nullable|string',
            'is_aktif'  => 'boolean',
        ]);

        $paket = Paket::create($request->all());
        return response()->json($paket, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama'      => 'sometimes|string|max:255',
            'kecepatan' => 'sometimes|integer|min:1',
            'harga'     => 'sometimes|integer|min:0',
            'durasi'    => 'sometimes|integer|min:1',
            'deskripsi' => 'nullable|string',
            'is_aktif'  => 'boolean',
        ]);

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
