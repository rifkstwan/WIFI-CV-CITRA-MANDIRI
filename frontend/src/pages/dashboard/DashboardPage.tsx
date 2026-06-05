import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useMyOrders } from "../../hooks/useOrders"

export function DashboardPage() {
  const { user, roles, logout } = useAuth()
  const { data: orders } = useMyOrders()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const pendingCount = orders?.filter((o) => o.status === "pending").length || 0
  const aktifCount   = orders?.filter((o) => o.status === "aktif").length || 0

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
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

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">Pesanan Pending</p>
            <p className="text-3xl font-bold text-yellow-500 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">Paket Aktif</p>
            <p className="text-3xl font-bold text-teal-600 mt-1">{aktifCount}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/order" className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl p-6 shadow-sm transition">
            <div className="text-lg font-semibold">📦 Pesan Paket</div>
            <p className="text-sm text-teal-100 mt-1">Pilih dan pesan paket internet baru</p>
          </Link>
          <Link to="/dashboard/orders" className="bg-white hover:bg-slate-50 text-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 transition">
            <div className="text-lg font-semibold">📋 Pesanan Saya</div>
            <p className="text-sm text-slate-500 mt-1">Lihat status semua pesanan kamu</p>
          </Link>
          <Link to="/profile" className="bg-white hover:bg-slate-50 text-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 transition sm:col-span-2">
            <div className="text-lg font-semibold">👤 Profil Saya</div>
            <p className="text-sm text-slate-500 mt-1">Edit nama, email, dan ganti password</p>
          </Link>
        </div>

        {/* Info user */}
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Email: <span className="text-slate-900">{user?.email}</span></p>
            <p className="text-sm text-slate-500 mt-1">Role: <span className="text-slate-900 capitalize">{roles.join(", ") || "customer"}</span></p>
          </div>
          <Link
            to="/profile"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium px-4 py-2 rounded-xl hover:bg-teal-50 transition"
          >
            Edit →
          </Link>
        </div>

      </div>
    </div>
  )
}
