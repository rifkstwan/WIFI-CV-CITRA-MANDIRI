import { Link } from "react-router-dom"
import { useMyOrders } from "../../hooks/useOrders"

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka)
}

const statusConfig = {
  pending:  { label: "Menunggu",  color: "bg-yellow-100 text-yellow-700" },
  aktif:    { label: "Aktif",     color: "bg-green-100 text-green-700" },
  ditolak:  { label: "Ditolak",   color: "bg-red-100 text-red-700" },
  selesai:  { label: "Selesai",   color: "bg-slate-100 text-slate-600" },
}

export function MyOrdersPage() {
  const { data: orders, isLoading } = useMyOrders()

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Pesanan Saya</h1>
          <Link
            to="/order"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
          >
            + Pesan Baru
          </Link>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && orders?.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-medium">Belum ada pesanan</p>
            <p className="text-sm mt-1">Mulai berlangganan dengan memesan paket internet</p>
            <Link to="/order" className="mt-4 inline-block bg-teal-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-teal-700 transition">
              Pesan Sekarang
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {orders?.map((order) => {
            const status = statusConfig[order.status]
            return (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{order.paket.nama}</h3>
                    <p className="text-sm text-slate-500 mt-1">{order.paket.kecepatan} Mbps</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="font-semibold text-slate-900">{formatRupiah(order.total_harga)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Alamat</p>
                    <p className="text-sm text-slate-700 max-w-xs truncate">{order.alamat}</p>
                  </div>
                </div>
                {order.tanggal_mulai && (
                  <p className="mt-2 text-xs text-slate-400">
                    Aktif: {order.tanggal_mulai} — {order.tanggal_selesai}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
