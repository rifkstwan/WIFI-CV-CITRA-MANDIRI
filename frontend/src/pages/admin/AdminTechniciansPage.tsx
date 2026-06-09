import { useState } from "react"
import { Search, Calendar, User, Wrench, CheckCircle2, AlertTriangle, Plus, X } from "lucide-react"
import { useAdminSchedules, useCreateAdminSchedule, useUpdateAdminScheduleStatus } from "../../hooks/useSchedules"
import { useAdminTickets } from "../../hooks/useTickets"

const statusConfig = {
  Menunggu: { label: "Menunggu", color: "bg-amber-100 text-amber-700 border-amber-200" },
  Selesai: { label: "Selesai", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  Dibatalkan: { label: "Dibatalkan", color: "bg-red-100 text-red-700 border-red-200" },
}

export function AdminTechniciansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSchedule, setNewSchedule] = useState({ ticket_id: "", nama_teknisi: "", tanggal_kunjungan: "" })

  const { data: schedules = [], isLoading } = useAdminSchedules()
  const { data: tickets = [] } = useAdminTickets()
  const createSchedule = useCreateAdminSchedule()
  const updateStatus = useUpdateAdminScheduleStatus()

  // Ambil tiket yang statusnya masih 'menunggu' (belum ditugaskan)
  const pendingTickets = tickets.filter(t => t.status === "menunggu")

  const filteredSchedules = schedules.filter(s => {
    return s.nama_teknisi.toLowerCase().includes(searchTerm.toLowerCase()) || 
           s.ticket?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.ticket?.judul.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSchedule.ticket_id || !newSchedule.nama_teknisi || !newSchedule.tanggal_kunjungan) return

    createSchedule.mutate({
      ticket_id: parseInt(newSchedule.ticket_id),
      nama_teknisi: newSchedule.nama_teknisi,
      tanggal_kunjungan: newSchedule.tanggal_kunjungan
    }, {
      onSuccess: () => {
        setIsModalOpen(false)
        setNewSchedule({ ticket_id: "", nama_teknisi: "", tanggal_kunjungan: "" })
      }
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jadwal Teknisi</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola penugasan teknisi untuk memperbaiki keluhan pelanggan.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Atur Jadwal Teknisi
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama teknisi atau pelanggan..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Memuat jadwal...</div>
      ) : filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">Belum ada jadwal teknisi</h3>
          <p className="text-slate-500 text-sm mt-1">Buat jadwal baru untuk mulai menugaskan teknisi.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Teknisi</th>
                  <th className="px-6 py-4">Pelanggan & Keluhan</th>
                  <th className="px-6 py-4">Tanggal Kunjungan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          <Wrench className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{schedule.nama_teknisi}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{schedule.ticket?.user?.name || schedule.user?.name || 'Pelanggan'}</div>
                      <div className="text-xs text-slate-500 mt-0.5 max-w-[250px] truncate">{schedule.ticket?.judul}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {new Date(schedule.tanggal_kunjungan).toLocaleString('id-ID', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusConfig[schedule.status as keyof typeof statusConfig]?.color}`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {schedule.status === 'Menunggu' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => updateStatus.mutate({ id: schedule.id, status: 'Selesai' })}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Tandai Selesai"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => updateStatus.mutate({ id: schedule.id, status: 'Dibatalkan' })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Batalkan"
                          >
                            <AlertTriangle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Schedule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Atur Jadwal Teknisi</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Pilih Keluhan Pelanggan (Menunggu)</label>
                <select
                  required
                  value={newSchedule.ticket_id}
                  onChange={e => setNewSchedule({ ...newSchedule, ticket_id: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="">-- Pilih Tiket --</option>
                  {pendingTickets.map(t => (
                    <option key={t.id} value={t.id}>
                      #{t.id} - {t.user?.name} - {t.judul}
                    </option>
                  ))}
                </select>
                {pendingTickets.length === 0 && <p className="text-xs text-amber-600 mt-1">Tidak ada tiket dengan status 'menunggu'.</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Teknisi</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={newSchedule.nama_teknisi}
                  onChange={e => setNewSchedule({ ...newSchedule, nama_teknisi: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tanggal & Jam Kunjungan</label>
                <input
                  required
                  type="datetime-local"
                  value={newSchedule.tanggal_kunjungan}
                  onChange={e => setNewSchedule({ ...newSchedule, tanggal_kunjungan: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={createSchedule.isPending || !newSchedule.ticket_id}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  {createSchedule.isPending ? "Menyimpan..." : "Tugaskan Teknisi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
