import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../services/api"
import { 
  User, 
  Mail, 
  Lock, 
  LogOut, 
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Camera
} from "lucide-react"

export function AdminProfilePage() {
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
      setPassMsg({ type: "success", text: "Kata sandi berhasil diubah!" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setPassMsg(null), 3000)
    },
    onError: (err: any) => {
      setPassMsg({ type: "error", text: err.response?.data?.message || "Gagal mengubah kata sandi" })
    },
  })

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Header Minimalist */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengaturan Akun</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola profil pribadi dan keamanan akun Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Kiri: Avatar & Info Akun */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
               <label className="relative w-32 h-32 rounded-full flex items-center justify-center shrink-0 border-4 border-slate-50 shadow-sm cursor-pointer overflow-hidden group mb-4">
                  {avatarPreview ? (
                     <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400">
                        {user?.name?.charAt(0).toUpperCase() || "A"}
                     </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Camera className="w-6 h-6 text-white mb-1" />
                     <span className="text-xs font-semibold text-white">Ubah Foto</span>
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
               
               <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
               <p className="text-sm text-slate-500 mb-4">{user?.email}</p>
               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  {user?.role === 'admin' ? 'Administrator' : user?.role}
               </span>
            </div>

            {/* Logout Card */}
            <div className="bg-white rounded-xl border border-rose-200 shadow-sm overflow-hidden">
               <div className="p-6 flex flex-col gap-5">
                  <div className="flex items-start gap-3">
                     <div className="p-2 bg-rose-50 rounded-lg shrink-0">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-slate-900">Keluar dari Akun</h3>
                        <p className="text-xs text-slate-500 mt-1">Akhiri sesi aktif Anda pada perangkat ini.</p>
                     </div>
                  </div>
                  <button
                     onClick={handleLogout}
                     className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 shadow-sm font-bold px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                     <LogOut className="w-4 h-4" /> Log Out
                  </button>
               </div>
            </div>
         </div>

         {/* Kanan: Form Data */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Form Profil */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Informasi Pribadi</h2>
                  <p className="text-sm text-slate-500 mt-1">Perbarui nama dan alamat email yang Anda gunakan.</p>
               </div>
               
               <div className="p-6 space-y-5">
                  {profileMsg && (
                     <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${
                        profileMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                     }`}>
                        {profileMsg.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                        {profileMsg.text}
                     </div>
                  )}

                  <div className="space-y-4 max-w-xl">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-4 w-4 text-slate-400" />
                           </div>
                           <input 
                              type="text" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Alamat Email</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-4 w-4 text-slate-400" />
                           </div>
                           <input 
                              type="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="pt-2">
                     <button
                        onClick={() => updateProfile.mutate()}
                        disabled={updateProfile.isPending}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                     >
                        {updateProfile.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        Simpan Profil
                     </button>
                  </div>
               </div>
            </div>

            {/* Form Keamanan */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Keamanan Kata Sandi</h2>
                  <p className="text-sm text-slate-500 mt-1">Ganti kata sandi secara berkala untuk menjaga keamanan akun Anda.</p>
               </div>
               
               <div className="p-6 space-y-5">
                  {passMsg && (
                     <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${
                        passMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                     }`}>
                        {passMsg.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                        {passMsg.text}
                     </div>
                  )}

                  <div className="space-y-4 max-w-xl">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Kata Sandi Saat Ini</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-slate-400" />
                           </div>
                           <input 
                              type="password" 
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="••••••••"
                              className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-slate-700">Kata Sandi Baru</label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <Lock className="h-4 w-4 text-slate-400" />
                              </div>
                              <input 
                                 type="password" 
                                 value={newPassword}
                                 onChange={(e) => setNewPassword(e.target.value)}
                                 placeholder="Min. 8 karakter"
                                 className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-slate-700">Ulangi Kata Sandi</label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <Lock className="h-4 w-4 text-slate-400" />
                              </div>
                              <input 
                                 type="password" 
                                 value={confirmPassword}
                                 onChange={(e) => setConfirmPassword(e.target.value)}
                                 placeholder="••••••••"
                                 className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-2">
                     <button
                        onClick={() => changePassword.mutate()}
                        disabled={changePassword.isPending}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                     >
                        {changePassword.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        Perbarui Kata Sandi
                     </button>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  )
}
