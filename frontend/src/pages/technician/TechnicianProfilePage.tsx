import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LogOut, User as UserIcon, ShieldCheck, Mail, Lock } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../services/api"

export function TechnicianProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null)
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passMsg, setPassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const updateProfile = useMutation({
    mutationFn: async () => {
      const formData = new FormData()
      formData.append("_method", "PUT")
      formData.append("name", name)
      formData.append("email", email)
      if (avatar) {
        formData.append("avatar", avatar)
      }
      const res = await api.post("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return res.data
    },
    onSuccess: () => {
      setProfileMsg({ type: "success", text: "Profil berhasil diperbarui!" })
      queryClient.invalidateQueries({ queryKey: ["me"] })
      setTimeout(() => setProfileMsg(null), 3000)
    },
    onError: (err: any) => {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Gagal memperbarui profil" })
    },
  })

  const changePassword = useMutation({
    mutationFn: async () => {
      const res = await api.put("/profile/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      })
      return res.data
    },
    onSuccess: () => {
      setPassMsg({ type: "success", text: "Password berhasil diubah!" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setPassMsg(null), 3000)
    },
    onError: (err: any) => {
      setPassMsg({ type: "error", text: err.response?.data?.message || "Gagal mengubah password" })
    },
  })

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Matches Other Technician Pages */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profil Teknisi</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola identitas, kata sandi, dan sesi akun Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
             <label className="relative flex w-32 h-32 rounded-full bg-slate-100 items-center justify-center text-slate-400 mx-auto mb-4 border-4 border-white shadow-lg group cursor-pointer overflow-hidden">
               {avatarPreview ? (
                 <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               ) : (
                 <UserIcon className="w-12 h-12" />
               )}
               <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">Ubah Foto</span>
               </div>
               <input 
                 type="file" 
                 accept="image/*" 
                 className="hidden" 
                 onChange={(e) => {
                   if (e.target.files && e.target.files[0]) {
                     setAvatar(e.target.files[0])
                     setAvatarPreview(URL.createObjectURL(e.target.files[0]))
                   }
                 }} 
               />
             </label>
             <h3 className="text-xl font-bold text-slate-900 truncate px-2">{user?.name}</h3>
             <p className="text-sm text-slate-500 mt-1 mb-4 truncate px-2">{user?.email}</p>
             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100">
                <ShieldCheck className="w-4 h-4" />
                Teknisi Lapangan
             </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 bg-red-50/50 border-b border-red-100 flex items-center gap-2">
                <LogOut className="w-4 h-4 text-red-500" />
                <h4 className="font-bold text-red-800 text-sm">Sesi Akun</h4>
             </div>
             <div className="p-5">
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                   Keluar dari perangkat ini jika Anda sedang menggunakan komputer atau perangkat milik orang lain.
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors"
                >
                  Keluar Sekarang
                </button>
             </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Edit Profil */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-slate-400" />
                <h3 className="font-bold text-slate-800">Informasi Pribadi</h3>
             </div>
             <div className="p-6">
                {profileMsg && (
                  <div className={`mb-5 p-3 rounded-lg text-xs font-bold flex items-center gap-2 ${
                    profileMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-red-50 text-red-600 border border-red-100"
                  }`}>
                    {profileMsg.text}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Lengkap</label>
                    <div className="relative">
                       <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input
                         type="text"
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                       />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Alamat Email</label>
                    <div className="relative">
                       <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input
                         type="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                       />
                    </div>
                  </div>
                  
                  <div className="pt-3">
                     <button
                       onClick={() => updateProfile.mutate()}
                       disabled={updateProfile.isPending}
                       className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
                     >
                       {updateProfile.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                     </button>
                  </div>
                </div>
             </div>
          </div>

          {/* Ganti Password */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                <h3 className="font-bold text-slate-800">Keamanan & Kata Sandi</h3>
             </div>
             <div className="p-6">
                {passMsg && (
                  <div className={`mb-5 p-3 rounded-lg text-xs font-bold flex items-center gap-2 ${
                    passMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-red-50 text-red-600 border border-red-100"
                  }`}>
                    {passMsg.text}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Kata Sandi Saat Ini</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-600 mb-1.5">Kata Sandi Baru</label>
                       <input
                         type="password"
                         value={newPassword}
                         onChange={(e) => setNewPassword(e.target.value)}
                         className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                         placeholder="Min. 8 karakter"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-600 mb-1.5">Ulangi Kata Sandi Baru</label>
                       <input
                         type="password"
                         value={confirmPassword}
                         onChange={(e) => setConfirmPassword(e.target.value)}
                         className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                         placeholder="••••••••"
                       />
                     </div>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100 mt-5">
                     <button
                       onClick={() => changePassword.mutate()}
                       disabled={changePassword.isPending}
                       className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
                     >
                       {changePassword.isPending ? "Memproses..." : "Perbarui Kata Sandi"}
                     </button>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>

    </div>
  )
}
