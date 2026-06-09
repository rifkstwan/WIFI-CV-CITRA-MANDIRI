import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../services/api"
import { Settings, Phone, MapPin, Loader2, Bell, CheckCircle2, AlertCircle, Save, ShieldCheck } from "lucide-react"

export function SettingsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [phone, setPhone] = useState(user?.phone || "")
  const [address, setAddress] = useState(user?.address || "")
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [activeTab, setActiveTab] = useState<"contact" | "notif">("contact")

  const [emailNotif, setEmailNotif] = useState(user?.email_notif ?? true)
  const [waNotif, setWaNotif] = useState(user?.wa_notif ?? true)

  const updateSettings = useMutation({
    mutationFn: async () => {
      const res = await api.put("/profile", { 
         phone, 
         address,
         email_notif: emailNotif,
         wa_notif: waNotif
      })
      return res.data
    },
    onSuccess: () => {
      setMsg({ type: "success", text: "Pengaturan berhasil diperbarui!" })
      queryClient.invalidateQueries({ queryKey: ["me"] })
      setTimeout(() => setMsg(null), 3000)
    },
    onError: (err: any) => {
      setMsg({ type: "error", text: err.response?.data?.message || "Gagal menyimpan pengaturan" })
    },
  })

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
           <h1 className="text-2xl font-bold text-slate-900">Pengaturan Sistem</h1>
           <p className="text-sm text-slate-500 mt-1">Konfigurasi alamat penagihan dan metode pemberitahuan Anda.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Sidebar Tabs (3 columns wide) */}
         <div className="lg:col-span-3 space-y-2">
            <h3 className="text-[12px] font-extrabold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu Pengaturan</h3>
            
            <button 
               onClick={() => setActiveTab("contact")}
               className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-[13px] ${
                  activeTab === "contact" 
                     ? "bg-blue-600 text-white shadow-[0_4px_15px_-3px_rgba(37,99,235,0.4)]" 
                     : "bg-transparent text-slate-500 hover:bg-slate-200/50 hover:text-slate-800"
               }`}
            >
               <Settings className={`w-4 h-4 ${activeTab === "contact" ? "text-blue-200" : "text-slate-400"}`} /> 
               Detail Penagihan
            </button>
            
            <button 
               onClick={() => setActiveTab("notif")}
               className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-[13px] ${
                  activeTab === "notif" 
                     ? "bg-blue-600 text-white shadow-[0_4px_15px_-3px_rgba(37,99,235,0.4)]" 
                     : "bg-transparent text-slate-500 hover:bg-slate-200/50 hover:text-slate-800"
               }`}
            >
               <Bell className={`w-4 h-4 ${activeTab === "notif" ? "text-blue-200" : "text-slate-400"}`} /> 
               Notifikasi Sistem
            </button>

            {/* Info Box */}
            <div className="mt-8 bg-slate-100 rounded-2xl p-5 border border-slate-200 hidden lg:block">
               <ShieldCheck className="w-6 h-6 text-slate-400 mb-3" />
               <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                  Data yang Anda masukkan di sini dienkripsi dengan standar keamanan tinggi dan hanya digunakan untuk keperluan layanan kami.
               </p>
            </div>
         </div>

         {/* Content Area (9 columns wide) */}
         <div className="lg:col-span-9 space-y-6">
            
            {msg && (
              <div className={`p-4 rounded-xl text-[13px] font-bold flex items-center gap-2 ${
                msg.type === "success"
                  ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
                  : "bg-red-50 border border-red-100 text-red-600"
              }`}>
                {msg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {msg.text}
              </div>
            )}

            {/* Detail Kontak & Penagihan */}
            {activeTab === "contact" && (
               <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full z-0 opacity-50 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                     <h2 className="text-[16px] font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-slate-400" /> Detail Kontak & Penagihan
                     </h2>

                     <div className="space-y-6">
                        <div>
                           <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                              Nomor Telepon / WhatsApp Penagihan
                           </label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                 <Phone className="w-4 h-4" />
                              </div>
                              <input 
                                 type="tel" 
                                 value={phone}
                                 onChange={(e) => setPhone(e.target.value)}
                                 placeholder="Misal: 081234567890"
                                 className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white max-w-md"
                              />
                           </div>
                           <p className="text-[11px] font-medium text-slate-400 mt-2">Nomor ini akan dihubungi oleh teknisi saat jadwal kunjungan tiba.</p>
                        </div>

                        <div>
                           <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                              Alamat Lengkap Penagihan
                           </label>
                           <div className="relative">
                              <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                                 <MapPin className="w-4 h-4" />
                              </div>
                              <textarea 
                                 rows={4}
                                 value={address}
                                 onChange={(e) => setAddress(e.target.value)}
                                 placeholder="Masukkan alamat RT/RW, nomor rumah, dan patokan agar teknisi mudah mencari..."
                                 className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white resize-none"
                              ></textarea>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Preferensi Notifikasi */}
            {activeTab === "notif" && (
               <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-full z-0 opacity-50 pointer-events-none"></div>

                  <div className="relative z-10">
                     <h2 className="text-[16px] font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-orange-400" /> Preferensi Notifikasi
                     </h2>
                     
                     <div className="space-y-4">
                        <label className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all group">
                           <div>
                              <p className="text-[14px] font-extrabold text-slate-800">Email Updates</p>
                              <p className="text-[12px] font-medium text-slate-500 mt-0.5 max-w-sm">Menerima pengingat tagihan bulanan dan tanda terima pembayaran (invoice) melalui email resmi.</p>
                           </div>
                           <div className="shrink-0 ml-4">
                              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${emailNotif ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                 <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${emailNotif ? 'translate-x-6' : 'translate-x-0'}`}></div>
                              </div>
                           </div>
                           {/* Hidden actual checkbox to make the label click work perfectly */}
                           <input type="checkbox" className="hidden" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
                        </label>
                        
                        <label className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all group">
                           <div>
                              <p className="text-[14px] font-extrabold text-slate-800">WhatsApp Alerts</p>
                              <p className="text-[12px] font-medium text-slate-500 mt-0.5 max-w-sm">Menerima peringatan otomatis mengenai gangguan jaringan lokal dan konfirmasi jadwal teknisi.</p>
                           </div>
                           <div className="shrink-0 ml-4">
                              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${waNotif ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                 <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${waNotif ? 'translate-x-6' : 'translate-x-0'}`}></div>
                              </div>
                           </div>
                           {/* Hidden actual checkbox to make the label click work perfectly */}
                           <input type="checkbox" className="hidden" checked={waNotif} onChange={() => setWaNotif(!waNotif)} />
                        </label>
                     </div>
                  </div>
               </div>
            )}

            {/* Global Save Button */}
            <div className="pt-2">
               <button 
                  onClick={() => updateSettings.mutate()}
                  disabled={updateSettings.isPending}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-[13px] font-bold rounded-xl shadow-sm transition-all active:scale-95 w-full md:w-auto"
               >
                  {updateSettings.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {updateSettings.isPending ? "Menyimpan Perubahan..." : "Simpan Semua Pengaturan"}
               </button>
            </div>

         </div>
      </div>
    </div>
  )
}
