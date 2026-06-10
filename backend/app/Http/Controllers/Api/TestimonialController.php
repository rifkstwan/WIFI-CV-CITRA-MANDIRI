<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    // Public API: get approved testimonials for landing page
    public function publicIndex()
    {
        $testimonials = Testimonial::with('user:id,name')
            ->where('is_published', true)
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'quote' => $item->content,
                    'name' => $item->user->name,
                    'rating' => $item->rating,
                    'role' => 'Pelanggan',
                    'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($item->user->name) . '&background=random'
                ];
            });

        return response()->json($testimonials);
    }

    // Customer API: get their own testimonial
    public function myTestimonial(Request $request)
    {
        $testimonial = Testimonial::where('user_id', $request->user()->id)->first();
        return response()->json($testimonial);
    }

    // Customer API: create or update their testimonial
    public function store(Request $request)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000'
        ]);

        $testimonial = Testimonial::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'rating' => $request->rating,
                'content' => $request->content,
                'is_published' => false // require admin approval on update
            ]
        );

        return response()->json([
            'message' => 'Ulasan berhasil disimpan dan menunggu persetujuan admin.',
            'data' => $testimonial
        ]);
    }

    // Admin API: get all testimonials
    public function indexAdmin()
    {
        $testimonials = Testimonial::with('user:id,name,email')->latest()->get();
        return response()->json($testimonials);
    }

    // Admin API: approve or reject
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'is_published' => 'required|boolean'
        ]);

        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update([
            'is_published' => $request->is_published
        ]);

        return response()->json([
            'message' => 'Status ulasan berhasil diperbarui.',
            'data' => $testimonial
        ]);
    }

    // Admin API: delete
    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();

        return response()->json(['message' => 'Ulasan berhasil dihapus.']);
    }
}
