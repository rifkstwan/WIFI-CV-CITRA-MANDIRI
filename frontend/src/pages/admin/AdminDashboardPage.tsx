import { Link, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../services/api"
import type { Order } from "../../hooks/useOrders"

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka)
}

type ReportSummary = {
  total_pendapatan: number
  pendapatan_bulan_ini: number
  pelanggan_aktif: number
  total_order: number
  order_pending: number
  paket_terlaris: { nama: string; total: number }[]
  pendapatan_per_bulan: { bulan: string; total: number }[]
  status_breakdown: Record<string, number>
}

export function AdminDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const { data: orders } = useQuery<(Order & { user: { name: string } })[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await api.get("/orders")
      return res.data
    },
  })

  const { data: report, isLoading: reportLoading } = useQuery<ReportSummary>({
    queryKey: ["report-summary"],
    queryFn: async () => {
      const res = await api.get("/reports/summary")
      return res.data
    },
  })

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const pendingCount = orders?.filter((o) => o.status === "pending").length || 0
  const aktifCount = orders?.filter((o) => o.status === "aktif").length || 0
  const totalCount = orders?.length || 0

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">
              Selamat datang, <span className="font-semibold text-teal-600">{user?.name}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-600 font-medium px-4 py-2 rounded-xl hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">Total Order</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-3xl font-bold text-yellow-500 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">Aktif</p>
            <p className="text-3xl font-bold text-teal-600 mt-1">{aktifCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">Pendapatan Bulan Ini</p>
            <p className="text-lg font-bold text-slate-900 mt-2">
              {formatRupiah(report?.pendapatan_bulan_ini || 0)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">Total Pendapatan</p>
            <p className="text-lg font-bold text-slate-900 mt-2">
              {formatRupiah(report?.total_pendapatan || 0)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Link to="/admin/orders" className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl p-6 shadow-sm transition">
            <div className="text-lg font-semibold">📋 Kelola Order</div>
            <p className="text-sm text-teal-100 mt-1">
              {pendingCount > 0 ? `${pendingCount} order menunggu konfirmasi` : "Lihat semua order masuk"}
            </p>
          </Link>

          <Link to="/admin/pakets" className="bg-white hover:bg-slate-50 text-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 transition">
            <div className="text-lg font-semibold">📦 Kelola Paket</div>
            <p className="text-sm text-slate-500 mt-1">Tambah, edit, atau hapus paket internet</p>
          </Link>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="text-lg font-semibold text-slate-900">👥 Pelanggan Aktif</div>
            <p className="text-sm text-slate-500 mt-1">
              {report?.pelanggan_aktif || 0} pelanggan aktif, {report?.order_pending || 0} pending
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Pendapatan per Bulan</h2>
              <span className="text-xs text-slate-400">6 bulan terakhir</span>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report?.pendapatan_per_bulan || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="bulan" stroke="#64748b" fontSize={12} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `Rp${Number(value) / 1000}k`}
                  />
                  <Tooltip formatter={(value: number) => formatRupiah(value)} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#0f766e"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-900 mb-4">Status Order</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Pending</span>
                <span className="font-semibold text-yellow-600">{report?.status_breakdown?.pending || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Aktif</span>
                <span className="font-semibold text-green-600">{report?.status_breakdown?.aktif || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Ditolak</span>
                <span className="font-semibold text-red-600">{report?.status_breakdown?.ditolak || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Selesai</span>
                <span className="font-semibold text-slate-700">{report?.status_breakdown?.selesai || 0}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-3">Paket Terlaris</h3>
              <div className="space-y-3">
                {(report?.paket_terlaris || []).slice(0, 5).map((paket, index) => (
                  <div key={paket.nama} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{index + 1}. {paket.nama}</span>
                    <span className="font-semibold text-teal-700">{paket.total} order</span>
                  </div>
                ))}
                {!reportLoading && (!report?.paket_terlaris || report.paket_terlaris.length === 0) && (
                  <p className="text-sm text-slate-400">Belum ada data paket terlaris</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Paket Terlaris</h2>
            <span className="text-xs text-slate-400">Berdasarkan order aktif & selesai</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report?.paket_terlaris || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="nama" stroke="#64748b" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="total" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {orders && orders.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-900 mb-4">Order Terbaru</h2>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{order.user.name} — {order.paket.nama}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    order.status === "aktif" ? "bg-green-100 text-green-700" :
                    order.status === "ditolak" ? "bg-red-100 text-red-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/admin/orders" className="mt-4 block text-center text-sm text-teal-600 hover:underline font-medium">
              Lihat semua →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
