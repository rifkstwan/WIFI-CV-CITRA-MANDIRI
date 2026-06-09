import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Search, Clock, Wrench, CheckCircle2, AlertTriangle, AlertCircle, Info, Ticket as TicketIcon } from "lucide-react"
import api from "../../services/api"

type Ticket = {
  id: number
  judul: string
  deskripsi: string
  prioritas: "rendah" | "sedang" | "tinggi"
  status: "menunggu" | "diproses" | "selesai"
  foto: string | null
  created_at: string
  user: {
    name: string
    email: string
  }
}

const statusConfig = {
  menunggu: { label: "Menunggu", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  diproses: { label: "Diproses", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Wrench },
  selesai:  { label: "Selesai",  color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
}

const prioritasConfig = {
  rendah: { label: "Rendah", color: "text-blue-500 bg-blue-50", icon: Info },
  sedang: { label: "Sedang", color: "text-amber-500 bg-amber-50", icon: AlertCircle },
  tinggi: { label: "Tinggi", color: "text-red-500 bg-red-50", icon: AlertTriangle },
}

export function AdminTicketsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("semua")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const { data: tickets = [], isLoading } = useQuery<Ticket[]>({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const res = await api.get("/admin/tickets")
      return res.data
    },
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await api.patch(`/admin/tickets/${id}/status`, { status })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] })
    },
  })

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toString().includes(searchTerm)
      
    const matchesStatus = filterStatus === "semua" || t.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Tiket Gangguan</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau dan tindak lanjuti laporan kendala dari pelanggan.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari keluhan atau nama pelanggan..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="semua">Semua Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="diproses">Sedang Diproses</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* Grid Cards */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Memuat laporan pelanggan...</div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <TicketIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">Tidak ada keluhan</h3>
          <p className="text-slate-500 text-sm mt-1">Bagus! Semua koneksi pelanggan berjalan lancar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => {
            const PrioIcon = prioritasConfig[ticket.prioritas].icon
            const StatIcon = statusConfig[ticket.status].icon

            return (
              <div key={ticket.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
                {/* Card Header */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${prioritasConfig[ticket.prioritas].color}`}>
                      <PrioIcon className="w-3.5 h-3.5" />
                      Prioritas {ticket.prioritas}
                    </span>
                    <span className="text-xs font-bold text-slate-400">#TKT-{ticket.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{ticket.judul}</h3>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Dilaporkan oleh: <span className="text-indigo-600">{ticket.user.name}</span></p>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 mb-4 flex-1 whitespace-pre-wrap border border-slate-100/50 shadow-inner">
                    {ticket.deskripsi}
                  </div>
                  
                  {ticket.foto && (
                    <button 
                      onClick={() => setSelectedImage(`http://localhost:8000/storage/${ticket.foto}`)}
                      className="w-full text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg transition-colors mb-4 flex items-center justify-center gap-2"
                    >
                      📷 Lihat Foto Bukti Keluhan
                    </button>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-4 border-t border-slate-100 pt-4">
                    <span>Waktu Keluhan:</span>
                    <span>{new Date(ticket.created_at).toLocaleString('id-ID')}</span>
                  </div>

                  {/* Actions & Status */}
                  <div className="mt-auto">
                    {ticket.status === 'selesai' ? (
                      <div className="w-full py-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5" /> Keluhan Selesai Diatasi
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {ticket.status === 'menunggu' && (
                          <button
                            onClick={() => updateStatus.mutate({ id: ticket.id, status: 'diproses' })}
                            disabled={updateStatus.isPending}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors disabled:opacity-50"
                          >
                            <Wrench className="w-4 h-4" /> Tandai Diproses
                          </button>
                        )}
                        {ticket.status === 'diproses' && (
                          <button
                            onClick={() => updateStatus.mutate({ id: ticket.id, status: 'selesai' })}
                            disabled={updateStatus.isPending}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Selesaikan Laporan
                          </button>
                        )}
                        <div className={`shrink-0 px-4 py-3 rounded-xl flex items-center justify-center border ${statusConfig[ticket.status].color}`}>
                          <StatIcon className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <img src={selectedImage} alt="Bukti Kendala" className="w-full h-full object-contain" />
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-md cursor-pointer hover:bg-black/70">
              Tutup (Klik Area Gelap)
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
