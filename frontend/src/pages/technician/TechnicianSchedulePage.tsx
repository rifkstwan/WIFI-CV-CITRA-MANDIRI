import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../services/api"
import { Calendar, Clock, MapPin, Loader2, Navigation, CheckCircle2, X } from "lucide-react"

export function TechnicianSchedulePage() {
  const queryClient = useQueryClient()
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["technician-schedules"],
    queryFn: async () => {
      const res = await api.get(`/technician/dashboard?t=${new Date().getTime()}`)
      return res.data
    },
    refetchInterval: 5000,
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await api.patch(`/technician/installations/${id}/status`, { status })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-schedules"] })
      queryClient.invalidateQueries({ queryKey: ["technician-dashboard-stats"] })
    },
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Router',
    ip_address: '',
    username: '',
    password: '',
    api_port: '8728'
  })

  const addDeviceMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/network-devices', data)
    },
    onSuccess: () => {
      // Mark as selesai after adding router
      if (selectedSchedule) {
         updateStatus.mutate({ id: selectedSchedule.schedule_id, status: 'selesai' })
      }
      setIsModalOpen(false)
      setSelectedSchedule(null)
      setFormData({ name: '', type: 'Router', ip_address: '', username: '', password: '', api_port: '8728' })
    },
    onError: (err) => {
      console.error("Failed to add device", err)
      alert("Gagal menyimpan konfigurasi router. Pastikan IP valid.")
    }
  })

  const handleFinish = (schedule: any, isInstalasi: boolean) => {
    if (isInstalasi) {
      setSelectedSchedule(schedule)
      setFormData({
        ...formData,
        name: `Router ${schedule.title.replace('Instalasi Baru (', '').replace(')', '')}`,
      })
      setIsModalOpen(true)
    } else {
      if (window.confirm("Tandai tugas ini telah selesai?")) {
        updateStatus.mutate({ id: schedule.schedule_id, status: 'selesai' })
      }
    }
  }

  const handleSubmitRouter = (e: React.FormEvent) => {
    e.preventDefault()
    addDeviceMutation.mutate(formData)
  }

  const schedules = dashboardData?.schedules || []

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Jadwal Harian Saya</h1>
            <p className="text-sm text-slate-500 mt-1">Daftar lengkap tugas lapangan yang harus diselesaikan hari ini.</p>
         </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400">
           <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
           <p className="font-medium">Memuat jadwal...</p>
        </div>
      ) : schedules.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Calendar className="w-8 h-8" />
           </div>
           <h3 className="text-lg font-bold text-slate-700">Hari Ini Bebas Tugas!</h3>
           <p className="text-slate-500 text-sm mt-1">Belum ada instalasi baru atau perbaikan gangguan yang dijadwalkan untuk Anda hari ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {schedules.map((schedule: any) => {
            const isInstalasi = schedule.type === 'instalasi'
            
            return (
              <div key={schedule.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                 
                 {/* Header */}
                 <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-3">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${
                          isInstalasi ? 'text-blue-600 bg-blue-100' : 'text-amber-600 bg-amber-100'
                       }`}>
                          <Clock className="w-3.5 h-3.5" />
                          {schedule.time.split(' - ')[0]} WIB
                       </span>
                       <span className="text-xs font-bold text-slate-400">#{schedule.id.toUpperCase()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">{schedule.title}</h3>
                 </div>

                 {/* Body */}
                 <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                       <div className={`w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-sm
                          ${isInstalasi ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'}
                       `}>
                          <MapPin className="w-5 h-5" />
                       </div>
                       <div className="flex-1 overflow-hidden">
                          <p className="font-bold text-slate-800 text-sm">Lokasi Pelanggan</p>
                          <p className="text-xs text-slate-500 truncate">{schedule.subtitle}</p>
                       </div>
                    </div>

                    <div className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 mb-4 flex-1 border border-slate-100 flex flex-col justify-center">
                       <p className="font-medium text-center">Status: <span className="font-bold">{schedule.time.split(' - ')[1]}</span></p>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                       <button 
                         onClick={() => {
                           const query = encodeURIComponent(schedule.subtitle)
                           window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
                         }}
                         className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors"
                       >
                          <Navigation className="w-3.5 h-3.5 text-blue-500" /> Navigasi
                       </button>
                       <button 
                         onClick={() => handleFinish(schedule, isInstalasi)}
                         disabled={updateStatus.isPending || addDeviceMutation.isPending}
                         className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors border border-emerald-100"
                       >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                       </button>
                    </div>
                 </div>

              </div>
            )
          })}
        </div>
      )}

      {/* Router Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <div>
                 <h2 className="text-lg font-bold text-slate-800">Konfigurasi Router Baru</h2>
                 <p className="text-xs text-slate-500 mt-1">Selesaikan instalasi dengan menghubungkan router ke sistem monitoring.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitRouter} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nama Perangkat</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">IP Address Router</label>
                <input 
                  type="text" 
                  value={formData.ip_address}
                  onChange={(e) => setFormData({...formData, ip_address: e.target.value})}
                  placeholder="Contoh: 192.168.1.1"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Username Mikrotik</label>
                   <input 
                     type="text" 
                     value={formData.username}
                     onChange={(e) => setFormData({...formData, username: e.target.value})}
                     className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Password Mikrotik</label>
                   <input 
                     type="password" 
                     value={formData.password}
                     onChange={(e) => setFormData({...formData, password: e.target.value})}
                     className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                   />
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">API Port</label>
                <input 
                  type="text" 
                  value={formData.api_port}
                  onChange={(e) => setFormData({...formData, api_port: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={addDeviceMutation.isPending}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {addDeviceMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Simpan & Selesaikan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
