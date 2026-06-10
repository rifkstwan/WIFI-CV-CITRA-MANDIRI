import { Star, CheckCircle2, XCircle, Trash2, ShieldAlert } from "lucide-react"
import { useAdminTestimonials, useUpdateTestimonialStatus, useDeleteTestimonial } from "../../hooks/useTestimonials"

export function AdminTestimonialsPage() {
  const { data: testimonials = [], isLoading } = useAdminTestimonials()
  const updateStatus = useUpdateTestimonialStatus()
  const deleteTestimonial = useDeleteTestimonial()

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus ulasan ini secara permanen?")) {
      deleteTestimonial.mutate(id)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
    ))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Ulasan & Testimoni</h1>
          <p className="text-sm text-slate-500 mt-1">Review dan setujui ulasan dari pelanggan untuk ditampilkan di Landing Page.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Memuat data ulasan...</div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">Belum ada ulasan</h3>
          <p className="text-slate-500 text-sm mt-1">Belum ada pelanggan yang mengirimkan testimoni.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testi) => (
            <div key={testi.id} className={`bg-white rounded-2xl border ${testi.is_published ? 'border-emerald-100' : 'border-slate-100'} shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden flex flex-col`}>
              {/* Header Status */}
              <div className={`px-5 py-3 border-b flex items-center justify-between ${testi.is_published ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  {testi.is_published ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="text-xs font-bold text-emerald-700">DITAYANGKAN</span></>
                  ) : (
                    <><ShieldAlert className="w-4 h-4 text-amber-500" /><span className="text-xs font-bold text-amber-600">MENUNGGU REVIEW</span></>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {new Date(testi.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex gap-1 mb-3">
                  {renderStars(testi.rating)}
                </div>
                <p className="text-slate-700 text-sm flex-1 mb-6 leading-relaxed">
                  "{testi.content}"
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    {testi.user?.name?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{testi.user?.name || 'Pelanggan'}</div>
                    <div className="text-xs text-slate-500">{testi.user?.email}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2 justify-end">
                {testi.is_published ? (
                  <button
                    onClick={() => updateStatus.mutate({ id: testi.id, is_published: false })}
                    disabled={updateStatus.isPending}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Sembunyikan
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus.mutate({ id: testi.id, is_published: true })}
                    disabled={updateStatus.isPending}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Setujui & Tayangkan
                  </button>
                )}
                <button
                  onClick={() => handleDelete(testi.id)}
                  disabled={deleteTestimonial.isPending}
                  className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl transition-colors"
                  title="Hapus Ulasan"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
