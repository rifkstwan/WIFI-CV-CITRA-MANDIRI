import { useQuery } from "@tanstack/react-query"
import { Camera, Image as ImageIcon, Calendar, CheckCircle2 } from "lucide-react"
import api from "../../services/api"

export function TechnicianDocumentationPage() {
  // Mengambil data tiket, karena di sistem ini foto bukti kerja tersimpan di tiket gangguan
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["technician-documentation"],
    queryFn: async () => {
      const res = await api.get("/technician/tickets")
      return res.data
    },
    refetchInterval: 5000,
  })

  // Filter hanya tiket yang sudah ada fotonya
  const documentedTickets = tickets.filter((ticket: any) => ticket.foto)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Galeri Dokumentasi</h1>
          <p className="text-sm text-slate-500 mt-1">Arsip foto bukti pengerjaan lapangan (Pemasangan & Perbaikan).</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Menarik data dokumentasi...</div>
      ) : documentedTickets.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">Belum Ada Dokumentasi</h3>
          <p className="text-slate-500 text-sm mt-1">Anda belum mengunggah foto bukti pengerjaan apapun. Selesaikan tiket dan unggah foto untuk melihatnya di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documentedTickets.map((ticket: any) => (
            <div key={ticket.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
              
              {/* Photo Area */}
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                <img 
                  src={`http://localhost:8000/storage/${ticket.foto}`} 
                  alt="Bukti Kerja" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                    const fallback = document.createElement('div');
                    fallback.innerHTML = '<svg class="w-12 h-12 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                    e.currentTarget.parentElement?.appendChild(fallback);
                  }}
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                   <Camera className="w-3 h-3" />
                   TKT-{ticket.id}
                </div>
                {ticket.status === 'selesai' && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                     <CheckCircle2 className="w-3 h-3" />
                     Selesai
                  </div>
                )}
              </div>

              {/* Details Area */}
              <div className="p-4">
                <p className="font-bold text-slate-800 text-sm mb-1 truncate" title={ticket.judul}>{ticket.judul}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                   <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[9px] text-slate-600">
                     {ticket.user.name.charAt(0)}
                   </div>
                   <span className="truncate">{ticket.user.name}</span>
                </div>
                
                <div className="pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-400 font-medium">
                   <Calendar className="w-3 h-3 mr-1.5" />
                   {new Date(ticket.updated_at).toLocaleDateString('id-ID', { 
                     day: 'numeric', month: 'long', year: 'numeric',
                     hour: '2-digit', minute: '2-digit'
                   })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
