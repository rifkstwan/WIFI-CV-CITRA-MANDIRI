import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useMyOrders } from "../../hooks/useOrders"
import { useTickets } from "../../hooks/useTickets"
import { useTraffic } from "../../hooks/useTraffic"
import api from "../../services/api"
import {
  Wifi,
  CreditCard,
  Activity,
  Ticket,
  CheckCircle2,
  Clock,
  Zap,
  XCircle
} from "lucide-react"

export function UserDashboardPage() {
  const { user } = useAuth()
  const { data: orders } = useMyOrders()
  const { data: tickets } = useTickets()
  const { data: traffic } = useTraffic()

  // Calculated stats from orders
  const pendingOrders = orders?.filter((o) => o.status === "pending") || []
  const activeOrders = orders?.filter((o) => o.status === "aktif") || []
  const pendingCount = pendingOrders.length

  // Calculated stats from tickets
  const activeTicketsCount = tickets?.filter(t => t.status !== "selesai" && t.status !== "ditolak").length || 0
  const processingTicketsCount = tickets?.filter(t => t.status === "diproses").length || 0
  const completedTicketsCount = tickets?.filter(t => t.status === "selesai").length || 0

  const latestActiveOrder = activeOrders.length > 0 ? activeOrders[0] : null
  const latestPendingOrder = pendingOrders.length > 0 ? pendingOrders[0] : null

  const [isPaying, setIsPaying] = useState(false)

  const handlePayment = async (orderId: number) => {
    try {
      setIsPaying(true)
      const res = await api.post(`/orders/${orderId}/pay`)
      const snapToken = res.data.snap_token

      // @ts-ignore
      window.snap.pay(snapToken, {
        onSuccess: function () {
          alert("Pembayaran berhasil!");
          window.location.reload();
        },
        onPending: function () {
          alert("Menunggu pembayaran Anda!");
        },
        onError: function () {
          alert("Pembayaran gagal!");
        },
        onClose: function () {
          console.log('Popup ditutup');
        }
      })
    } catch (error) {
      console.error(error)
      alert("Gagal memproses pembayaran. Pastikan Midtrans Key sudah diset di .env")
    } finally {
      setIsPaying(false)
    }
  }

  // Helper for currency
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Helper for date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Center / Main Column */}
      <div className="flex-1 space-y-8">

        <div>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Ringkasan Layanan</h2>
            {pendingCount > 0 && (
              <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">
                {pendingCount} tagihan menunggu
              </span>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Paket Internet */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Wifi className="w-4 h-4" />
                </div>
                <h3 className="text-[13px] font-bold text-slate-500">Paket Saat Ini</h3>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {latestActiveOrder ? `${latestActiveOrder.paket.kecepatan} Mbps` : 'Belum Ada'}
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[13px] font-medium text-slate-500">
                  {latestActiveOrder ? latestActiveOrder.paket.nama : 'Status Layanan'}
                </span>
                <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md ${latestActiveOrder ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                  {latestActiveOrder ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
            </div>

            {/* Tagihan */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${latestPendingOrder ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-[13px] font-bold text-slate-500">Tagihan Bulan Ini</h3>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {latestPendingOrder ? formatRupiah(latestPendingOrder.total_harga) : 'Rp0'}
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
                {latestPendingOrder ? (
                  <>
                    <span className="text-[12px] font-bold text-orange-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Belum Dibayar
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[12px] font-bold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Semua Lunas
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">Terima kasih!</span>
                  </>
                )}
              </div>
            </div>

            {/* Penggunaan Data (Connected to mock backend) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="text-[13px] font-bold text-slate-500">Total Traffic</h3>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {traffic?.total || 0} <span className="text-xl font-semibold text-slate-400">GB</span>
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex gap-6">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Download</p>
                  <p className="text-[14px] font-bold text-slate-700 mt-0.5">{traffic?.download || 0} GB</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Upload</p>
                  <p className="text-[14px] font-bold text-slate-700 mt-0.5">{traffic?.upload || 0} GB</p>
                </div>
              </div>
            </div>

            {/* Tiket Aktif (Connected to backend) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                  <Ticket className="w-4 h-4" />
                </div>
                <h3 className="text-[13px] font-bold text-slate-500">Tiket Aktif</h3>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{activeTicketsCount}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex gap-6">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Diproses</p>
                  <p className="text-[14px] font-bold text-yellow-600 mt-0.5">{processingTicketsCount} Tiket</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Selesai</p>
                  <p className="text-[14px] font-bold text-teal-600 mt-0.5">{completedTicketsCount} Tiket</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Pembayaran Table */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-extrabold text-slate-800">Riwayat Pembayaran</h3>
            <Link to="/dashboard/orders" className="text-[12px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">Lihat Semua &rarr;</Link>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Invoice</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${order.status === 'pending' ? 'bg-orange-50 text-orange-500 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                            <CreditCard className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-700">INV-{String(order.id).padStart(3, '0')}</p>
                            <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate max-w-[120px] sm:max-w-none">
                              {order.paket.nama}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 font-semibold">{formatDate(order.created_at)}</td>
                      <td className="p-4">
                        {order.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100/50">
                            <Clock className="w-3.5 h-3.5" />
                            Menunggu
                          </span>
                        )}
                        {(order.status === 'aktif' || order.status === 'selesai') && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-600 border border-green-100/50">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Berhasil
                          </span>
                        )}
                        {order.status === 'ditolak' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-100/50">
                            <XCircle className="w-3.5 h-3.5" />
                            Dibatalkan
                          </span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right font-extrabold text-slate-800">{formatRupiah(order.total_harga)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      Belum ada riwayat pesanan atau pembayaran.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Right Column / Quick Transactions */}
      <div className="w-full xl:w-[320px] shrink-0 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 relative overflow-hidden">

          <div className="mb-6">
            <h3 className="text-[15px] font-extrabold text-slate-800">Pembayaran Cepat</h3>
          </div>

          <div className="space-y-3 mb-7 relative z-10">
            <label className="flex items-start gap-4 p-4 border-2 border-blue-600 rounded-xl cursor-pointer bg-blue-50/20 shadow-sm">
              <div className="pt-1">
                <div className="w-4 h-4 rounded-full border-[5px] border-blue-600 bg-white"></div>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-800">Virtual Account BCA</p>
                <p className="text-[12px] font-medium text-slate-500 mt-1.5 leading-relaxed">Verifikasi otomatis, tanpa konfirmasi manual.</p>
              </div>
            </label>

            <label className="flex items-start gap-4 p-4 border-2 border-slate-100 rounded-xl cursor-pointer hover:border-slate-200 transition-colors">
              <div className="pt-1">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-800">QRIS / GoPay</p>
                <p className="text-[12px] font-medium text-slate-500 mt-1.5 leading-relaxed">Scan QR dengan dompet digital pilihan Anda.</p>
              </div>
            </label>
          </div>

          <div className="pt-5 border-t border-slate-100">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Rincian Langganan</h4>

            {latestPendingOrder || latestActiveOrder ? (
              <>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200/60">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Zap className="w-4 h-4" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-800">
                        {(latestPendingOrder || latestActiveOrder)?.paket.nama}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                        INV-{String((latestPendingOrder || latestActiveOrder)?.id).padStart(3, '0')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium text-slate-600">Kecepatan stabil {(latestPendingOrder || latestActiveOrder)?.paket.kecepatan} Mbps</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium text-slate-600">Akses internet Unlimited tanpa FUP</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-[13px] font-extrabold text-slate-800">Total Tagihan</span>
                  <span className="text-lg font-extrabold text-orange-500">
                    {formatRupiah((latestPendingOrder || latestActiveOrder)?.total_harga || 0)}
                  </span>
                </div>

                {latestPendingOrder ? (
                  <button
                    onClick={() => handlePayment(latestPendingOrder.id)}
                    disabled={isPaying}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] hover:-translate-y-0.5 flex justify-center items-center gap-2 disabled:opacity-50 disabled:active:scale-100 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                    {isPaying ? "Memproses..." : "Lanjutkan Pembayaran"}
                  </button>
                ) : (
                  <button className="w-full bg-slate-100 text-slate-400 font-bold py-3.5 rounded-xl transition-all cursor-not-allowed">
                    Tidak Ada Tagihan Aktif
                  </button>
                )}
              </>
            ) : (
              <div className="py-6 text-center text-slate-500 text-sm">
                Belum ada paket aktif atau tagihan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
