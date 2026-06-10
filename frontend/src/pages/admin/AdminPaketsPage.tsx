import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Edit, Trash2, X, Wifi, ShieldCheck, Zap, ToggleLeft, ToggleRight } from "lucide-react"
import api from "../../services/api"

type Paket = {
  id: number
  nama: string
  deskripsi: string | null
  kecepatan: number
  fup: string | null
  harga: number
  durasi: number
  is_aktif: boolean
}

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka)
}

const emptyForm = { nama: "", deskripsi: "", kecepatan: "", fup: "", harga: "", durasi: "30", is_aktif: true }

export function AdminPaketsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data: pakets, isLoading } = useQuery<Paket[]>({
    queryKey: ["admin-pakets"],
    queryFn: async () => {
      // Menggunakan endpoint admin untuk melihat semua paket (aktif & nonaktif)
      const res = await api.get("/admin/pakets")
      return res.data
    },
  })

  const savePaket = useMutation({
    mutationFn: async (data: typeof emptyForm) => {
      const payload = {
        ...data,
        is_aktif: data.is_aktif
      }
      if (editId) {
        return api.put(`/pakets/${editId}`, payload)
      }
      return api.post("/pakets", payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pakets"] })
      closeModal()
    },
  })

  const deletePaket = useMutation({
    mutationFn: (id: number) => api.delete(`/pakets/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-pakets"] }),
  })

  const handleEdit = (paket: Paket) => {
    setEditId(paket.id)
    setForm({
      nama: paket.nama,
      deskripsi: paket.deskripsi || "",
      kecepatan: String(paket.kecepatan),
      fup: paket.fup || "",
      harga: String(paket.harga),
      durasi: String(paket.durasi),
      is_aktif: paket.is_aktif,
    })
    setIsModalOpen(true)
  }

  const openAddModal = () => {
    setEditId(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditId(null)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    savePaket.mutate(form)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Paket</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola harga, kecepatan, dan status ketersediaan paket internet.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Paket
        </button>
      </div>

      {/* Grid Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-64 shadow-sm animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pakets?.map((paket) => (
            <div 
              key={paket.id} 
              className={`bg-white rounded-2xl shadow-sm border transition-all overflow-hidden relative ${
                paket.is_aktif ? "border-slate-200 hover:border-indigo-300 hover:shadow-md" : "border-slate-200 opacity-60 grayscale-[50%]"
              }`}
            >
              {!paket.is_aktif && (
                <div className="absolute top-4 right-4 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  Tidak Aktif
                </div>
              )}
              {paket.is_aktif && (
                <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-emerald-100">
                  Tersedia
                </div>
              )}
              
              <div className="p-6">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Wifi className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900">{paket.nama}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2 h-10">{paket.deskripsi}</p>
                
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">{formatRupiah(paket.harga)}</span>
                  <span className="text-sm font-medium text-slate-500">/{paket.durasi} Hari</span>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold">Up to {paket.kecepatan} Mbps</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Koneksi Stabil & Aman</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(paket)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Yakin ingin menghapus permanen paket ${paket.nama}? (Ini akan mempengaruhi riwayat order)`)) deletePaket.mutate(paket.id)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
          {pakets?.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
              Belum ada paket internet yang ditambahkan.
            </div>
          )}
        </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">
                {editId ? "Edit Paket Internet" : "Tambah Paket Baru"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Paket</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Contoh: Paket Ultra Ngebut"
                    value={form.nama} onChange={e => setForm({...form, nama: e.target.value})}
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Contoh: Sangat cocok untuk gaming dan streaming 4K"
                    value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">FUP (Batas Wajar)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Contoh: Tanpa Batas (Unlimited) atau 500GB"
                    value={form.fup} onChange={e => setForm({...form, fup: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kecepatan (Mbps)</label>
                  <div className="relative">
                    <input 
                      type="number" required min="1"
                      className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={form.kecepatan} onChange={e => setForm({...form, kecepatan: e.target.value})}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Mbps</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Durasi Langganan</label>
                  <div className="relative">
                    <input 
                      type="number" required min="1"
                      className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={form.durasi} onChange={e => setForm({...form, durasi: e.target.value})}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Hari</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harga Berlangganan</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                    <input 
                      type="number" required min="0"
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={form.harga} onChange={e => setForm({...form, harga: e.target.value})}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Status Ketersediaan</h4>
                    <p className="text-xs text-slate-500">Apakah paket ini bisa dibeli oleh pelanggan?</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({...form, is_aktif: !form.is_aktif})}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                      form.is_aktif ? "text-emerald-600 bg-emerald-50 border border-emerald-200" : "text-slate-500 bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {form.is_aktif ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    {form.is_aktif ? "Aktif" : "Nonaktif"}
                  </button>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={savePaket.isPending}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {savePaket.isPending ? "Menyimpan..." : "Simpan Paket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
