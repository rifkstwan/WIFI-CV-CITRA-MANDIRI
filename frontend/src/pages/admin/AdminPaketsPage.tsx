import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../services/api"
import type { Paket } from "../../hooks/usePakets"

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka)
}

const emptyForm = { nama: "", deskripsi: "", kecepatan: "", harga: "", durasi: "30" }

export function AdminPaketsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data: pakets, isLoading } = useQuery<Paket[]>({
    queryKey: ["pakets"],
    queryFn: async () => {
      const res = await api.get("/pakets")
      return res.data
    },
  })

  const savePaket = useMutation({
    mutationFn: async (data: typeof emptyForm) => {
      if (editId) {
        return api.put(`/pakets/${editId}`, data)
      }
      return api.post("/pakets", data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pakets"] })
      setShowForm(false)
      setEditId(null)
      setForm(emptyForm)
    },
  })

  const deletePaket = useMutation({
    mutationFn: (id: number) => api.delete(`/pakets/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pakets"] }),
  })

  const handleEdit = (paket: Paket) => {
    setEditId(paket.id)
    setForm({
      nama: paket.nama,
      deskripsi: paket.deskripsi || "",
      kecepatan: String(paket.kecepatan),
      harga: String(paket.harga),
      durasi: String(paket.durasi),
    })
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Kelola Paket</h1>
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm) }}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
          >
            + Tambah Paket
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h2 className="font-semibold text-slate-900 mb-4">
              {editId ? "Edit Paket" : "Tambah Paket Baru"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Paket</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="Paket Basic"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                <input
                  type="text"
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="Cocok untuk browsing sehari-hari"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kecepatan (Mbps)</label>
                <input
                  type="number"
                  value={form.kecepatan}
                  onChange={(e) => setForm({ ...form, kecepatan: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={form.harga}
                  onChange={(e) => setForm({ ...form, harga: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="150000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Durasi (hari)</label>
                <input
                  type="number"
                  value={form.durasi}
                  onChange={(e) => setForm({ ...form, durasi: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="30"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowForm(false); setEditId(null) }}
                className="flex-1 border border-slate-300 text-slate-600 font-semibold py-2 rounded-xl text-sm hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                onClick={() => savePaket.mutate(form)}
                disabled={savePaket.isPending}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-xl text-sm transition disabled:opacity-50"
              >
                {savePaket.isPending ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah Paket"}
              </button>
            </div>
          </div>
        )}

        {/* Tabel Paket */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {pakets?.map((paket) => (
            <div key={paket.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-slate-900">{paket.nama}</h3>
                  <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                    {paket.kecepatan} Mbps
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{paket.deskripsi}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-slate-900">{formatRupiah(paket.harga)}</p>
                <p className="text-xs text-slate-400">{paket.durasi} hari</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(paket)}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium px-3 py-1.5 rounded-xl hover:bg-teal-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus paket ${paket.nama}?`)) deletePaket.mutate(paket.id)
                  }}
                  className="text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-xl hover:bg-red-50 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
