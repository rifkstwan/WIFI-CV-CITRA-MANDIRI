import { useQuery } from "@tanstack/react-query"
import api from "../../services/api"

type SummaryResponse = {
  total_users?: number
  total_orders?: number
  total_pakets?: number
  total_revenue?: number
  pending_orders?: number
}

export function OwnerReportsPage() {
  const { data, isLoading, isError } = useQuery<SummaryResponse>({
    queryKey: ["owner-report-summary"],
    queryFn: async () => {
      const res = await api.get("/owner/reports/summary")
      return res.data
    },
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan Owner</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ringkasan bisnis untuk monitoring owner.
          </p>
        </div>

        {isLoading && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-sm text-slate-400">
            Memuat laporan...
          </div>
        )}

        {isError && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-sm text-red-500">
            Gagal memuat laporan.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">Total User</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{data?.total_users ?? 0}</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">Total Order</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{data?.total_orders ?? 0}</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">Total Paket</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{data?.total_pakets ?? 0}</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">Pendapatan</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                Rp {Number(data?.total_revenue ?? 0).toLocaleString("id-ID")}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 md:col-span-2 xl:col-span-4">
              <p className="text-sm text-slate-500">Order Menunggu</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{data?.pending_orders ?? 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
