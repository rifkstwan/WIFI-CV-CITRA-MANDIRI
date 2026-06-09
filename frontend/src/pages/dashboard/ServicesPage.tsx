import { Link } from "react-router-dom"
import { useMyOrders } from "../../hooks/useOrders"
import { useSchedules } from "../../hooks/useSchedules"
import { Globe, MapPin, CheckCircle2, AlertCircle, Cpu, Zap, Wifi, Activity, ArrowRight, ShieldCheck, Server } from "lucide-react"
import { OrderPage } from "../customer/OrderPage"

export function ServicesPage() {
  const { data: orders } = useMyOrders()
  const { data: schedules } = useSchedules()
  
  // Find the active order
  const activeOrder = orders?.find((o) => o.status === "aktif")
  const pendingOrder = orders?.find((o) => o.status === "pending")
  const currentService = activeOrder || pendingOrder

  // Find latest schedule to determine technician
  const latestSchedule = schedules && schedules.length > 0 
    ? schedules.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
    : null

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
  }

  if (!orders) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!currentService) {
    return <OrderPage />
  }

  const isActive = currentService.status === 'aktif'

  return (
    <div className="max-w-6xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Layanan Saya</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola spesifikasi teknis dan detail pemasangan internet Anda.</p>
        </div>
      </div>

      {/* Hero Service Banner (Modern & Simple) */}
      <div className="bg-gradient-to-br from-slate-100 to-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-slate-200/50 to-transparent rounded-bl-full z-0 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <span className={`px-2.5 py-1 text-[11px] font-extrabold tracking-wider uppercase rounded-md border flex items-center gap-1.5 ${isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                    {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    {isActive ? 'Aktif & Terkoneksi' : 'Menunggu Pemasangan'}
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-extrabold tracking-wider uppercase rounded-md bg-slate-50 border border-slate-200 text-slate-500">
                    ID: #SRV-{String(currentService.id).padStart(4, '0')}
                  </span>
               </div>
               
               <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                 {currentService.paket.kecepatan} <span className="text-2xl text-slate-400">Mbps</span>
               </h2>
               <p className="text-sm font-bold text-slate-500">{currentService.paket.nama} — Akses Internet Tanpa Batas</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 w-full lg:w-72">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tagihan Bulanan</p>
               <p className="text-2xl font-extrabold text-slate-800">{formatRupiah(currentService.paket.harga)}</p>
               <Link to="/dashboard/billing" className="mt-4 w-full py-2.5 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-colors bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-blue-600 shadow-sm">
                 Lihat Tagihan <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Spesifikasi Teknis */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
             <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-sm">
               <Server className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-[15px] font-extrabold text-slate-800">Spesifikasi Teknis</h3>
               <p className="text-[12px] font-medium text-slate-500">Konfigurasi jaringan perangkat Anda</p>
             </div>
          </div>
          <div className="p-6 space-y-5">
             <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-slate-500 flex items-center gap-2"><Cpu className="w-4 h-4 text-slate-400"/> Kecepatan Maksimal</span>
                <span className="text-[14px] font-extrabold text-slate-800">{currentService.paket.kecepatan} Mbps</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-slate-500 flex items-center gap-2"><Globe className="w-4 h-4 text-slate-400"/> IP Address</span>
                <span className="text-[14px] font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">DHCP Dinamis</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-slate-500 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-slate-400"/> FUP (Batas Wajar)</span>
                <span className="text-[14px] font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">Tanpa Batas (Unlimited)</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-slate-500 flex items-center gap-2"><Zap className="w-4 h-4 text-slate-400"/> Tipe Perangkat</span>
                <span className="text-[14px] font-extrabold text-slate-800">Modem ONT Dual-Band</span>
             </div>
          </div>
        </div>

        {/* Detail Pemasangan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
             <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 shadow-sm">
               <MapPin className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-[15px] font-extrabold text-slate-800">Detail Lokasi & Teknisi</h3>
               <p className="text-[12px] font-medium text-slate-500">Informasi alamat dan penanggung jawab</p>
             </div>
          </div>
          <div className="p-6 space-y-5">
             <div className="flex flex-col gap-2 pb-4 border-b border-slate-50">
                <span className="text-[13px] font-bold text-slate-500">Alamat Pemasangan</span>
                <span className="text-[14px] font-extrabold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {currentService.alamat}
                </span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-slate-500">Tanggal Order</span>
                <span className="text-[14px] font-extrabold text-slate-800">
                  {formatDate(currentService.created_at)}
                </span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-slate-500">Teknisi Penanggung Jawab</span>
                <span className="text-[14px] font-extrabold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-100/50">
                  {latestSchedule ? latestSchedule.nama_teknisi : "Menunggu Penugasan"}
                </span>
             </div>
          </div>
        </div>

      </div>

      {/* Quick Actions (Interactive portion) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
         <h3 className="text-[15px] font-extrabold text-slate-800 mb-5">Aksi Layanan</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/dashboard/tickets" className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all group">
               <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-[14px] font-bold text-slate-800">Lapor Gangguan</h4>
                  <p className="text-[12px] font-medium text-slate-500 mt-0.5">Internet lambat atau mati? Buat tiket laporan ke teknisi.</p>
               </div>
            </Link>
            
            <button onClick={() => alert("Fitur Upgrade Paket sedang dalam tahap pengembangan. Hubungi CS untuk upgrade langsung.")} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/50 transition-all group text-left">
               <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-[14px] font-bold text-slate-800">Upgrade Paket</h4>
                  <p className="text-[12px] font-medium text-slate-500 mt-0.5">Butuh kecepatan lebih? Ganti paket internet Anda kapan saja.</p>
               </div>
            </button>
         </div>
      </div>

    </div>
  )
}
