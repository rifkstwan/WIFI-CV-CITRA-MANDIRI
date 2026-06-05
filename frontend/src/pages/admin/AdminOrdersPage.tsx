import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../services/api"
import type { Order } from "../../hooks/useOrders"

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

type AdminOrder = Order & {
  user: { id: number; name: string; email: string }
}

export function AdminOrdersPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<string>("all")

  const { data: orders, isLoading } = useQuery<AdminOrder[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await api.get("/orders")
      return res.data
    },
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, tanggal_mulai, tanggal_selesai }: {
      id: number
      status: string
      tanggal_mulai?: string
      tanggal_selesai?: string
    }) => {
      const res = await api.patch(`/orders/${id}/status`, {
        status,
        tanggal_mulai,
        tanggal_selesai,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
    },
  })

  const handleAktif = (order: AdminOrder) => {
    const today = new Date().toISOString().split("T")[0]
    const selesai = new Date(Date.now() + order.paket.harga * 0)
    const selesaiDate = new Date()
    selesaiDate.setDate(selesaiDate.getDate() + 30)
    updateStatus.mutate({
      id: order.id,
      status: "aktif",
      tanggal_mulai: today,
      tanggal_selesai: selesaiDate.toISOString().split("T")[0],
    })
  }

  const filtered = filter === "all"
    ? orders
    : orders?.filter((o) => o.status === filter)

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Kelola Order</h1>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "pending", "aktif", "ditolak", "selesai"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === s
                  ? "bg-teal-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {s === "all" ? "Semua" : statusConfig[s as keyof typeof statusConfig]?.label}
            </button>
          ))}
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

        {filtered?.length === 0 && !isLoading && (
          <div className="text-center py-20 text-slate-400">
            Tidak ada order untuk filter ini
          </div>
        )}

        <div className="space-y-4">
          {filtered?.map((order) => {
            const status = statusConfig[order.status]
            return (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-900">#{order.id} — {order.paket.nama}</h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      👤 {order.user.name} ({order.user.email})
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      📍 {order.alamat}
                    </p>
                    {order.catatan && (
                      <p className="text-sm text-slate-400 mt-1">💬 {order.catatan}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{formatRupiah(order.total_harga)}</p>
                    <p className="text-xs text-slate-400">{order.paket.kecepatan} Mbps</p>
                  </div>
                </div>

                {/* Actions */}
                {order.status === "pending" && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => handleAktif(order)}
                      disabled={updateStatus.isPending}
                      className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
                    >
                      ✓ Aktifkan
                    </button>
                    <button
                      onClick={() => updateStatus.mutate({ id: order.id, status: "ditolak" })}
                      disabled={updateStatus.isPending}
                      className="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
                    >
                      ✕ Tolak
                    </button>
                  </div>
                )}

                {order.status === "aktif" && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Aktif: {order.tanggal_mulai} — {order.tanggal_selesai}
                    </p>
                    <button
                      onClick={() => updateStatus.mutate({ id: order.id, status: "selesai" })}
                      disabled={updateStatus.isPending}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
                    >
                      Tandai Selesai
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
