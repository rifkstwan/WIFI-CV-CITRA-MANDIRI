import { useQuery } from "@tanstack/react-query"
import api from "../../services/api"
import { Calendar, Clock, MapPin, Loader2, Navigation, CheckCircle2 } from "lucide-react"

export function TechnicianSchedulePage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["technician-schedules"],
    queryFn: async () => {
      const res = await api.get("/technician/dashboard")
      return res.data
    },
    refetchInterval: 5000,
  })

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
                       <button className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                       </button>
                    </div>
                 </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
