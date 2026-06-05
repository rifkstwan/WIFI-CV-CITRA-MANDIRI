import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { usePakets } from "../../hooks/usePakets"
import { useCreateOrder } from "../../hooks/useOrders"

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka)
}

export function OrderPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paketIdParam = searchParams.get("paket")

  const { data: pakets } = usePakets()
  const createOrder = useCreateOrder()

  const [paketId, setPaketId] = useState<number>(Number(paketIdParam) || 0)
  const [alamat, setAlamat] = useState("")
  const [catatan, setCatatan] = useState("")
  const [error, setError] = useState("")

  const selectedPaket = pakets?.find((p) => p.id === paketId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!paketId) return setError("Pilih paket terlebih dahulu")
    if (!alamat) return setError("Alamat instalasi wajib diisi")
    try {
      await createOrder.mutateAsync({ paket_id: paketId, alamat, catatan })
      navigate("/dashboard/orders")
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal membuat order")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Pesan Paket Internet</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-900 mb-4">Pilih Paket</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pakets?.map((paket) => (
                <button
                  key={paket.id}
                  type="button"
                  onClick={() => setPaketId(paket.id)}
                  className={`text-left p-4 rounded-xl border-2 transition ${
                    paketId === paket.id
                      ? "border-teal-500 bg-teal-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="font-semibold text-slate-900">{paket.nama}</div>
                  <div className="text-sm text-teal-600 font-medium">{paket.kecepatan} Mbps</div>
                  <div className="text-sm text-slate-500 mt-1">{formatRupiah(paket.harga)}/bulan</div>
                </button>
              ))}
            </div>
          </div>

          {selectedPaket && (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
              <p className="text-sm text-teal-700">
                Paket dipilih: <span className="font-semibold">{selectedPaket.nama}</span> —{" "}
                {formatRupiah(selectedPaket.harga)}/bulan
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-900 mb-4">Detail Instalasi</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Alamat Instalasi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-none"
                  placeholder="Jl. Nama Jalan No. XX, Kelurahan, Kecamatan, Kota"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Catatan (opsional)
                </label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-none"
                  placeholder="Contoh: Pasang di lantai 2, hubungi jam 09.00-17.00"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-slate-300 text-slate-600 font-semibold py-3 rounded-xl text-sm hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={createOrder.isPending}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50"
            >
              {createOrder.isPending ? "Memproses..." : "Buat Pesanan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
