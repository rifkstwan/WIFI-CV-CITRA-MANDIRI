import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, CheckCircle2, Cable, CalendarDays, Receipt } from "lucide-react"
import api from "../../services/api"

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

type PaymentLog = {
  id: string
  reference_id: number
  type: "Pemasangan Baru" | "Tagihan Bulanan"
  description: string
  user_name: string
  user_email: string
  amount: number
  paid_at: string
  status: string
}

export function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("semua")

  const { data: payments = [], isLoading } = useQuery<PaymentLog[]>({
    queryKey: ["admin-payments-history"],
    queryFn: async () => {
      const res = await api.get("/admin/payments")
      return res.data
    },
  })

  const filteredPayments = payments.filter((p) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch = 
      p.user_name.toLowerCase().includes(term) ||
      p.user_email.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
      
    const matchesType = typeFilter === "semua" || p.type === typeFilter
    
    return matchesSearch && matchesType
  })

  // Calculate quick stats
  const totalIncome = filteredPayments.reduce((acc, curr) => acc + curr.amount, 0)
  const countPemasangan = filteredPayments.filter(p => p.type === "Pemasangan Baru").length
  const countTagihan = filteredPayments.filter(p => p.type === "Tagihan Bulanan").length

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Riwayat Pembayaran</h1>
          <p className="text-sm text-slate-500 mt-1">Buku kas terpusat untuk memantau semua dana yang masuk ke sistem.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm print:hidden"
        >
          Cetak Rekap
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pemasukan (Filter)</p>
            <p className="text-xl font-bold text-slate-800">{formatRupiah(totalIncome)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Cable className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pemasangan Baru</p>
            <p className="text-xl font-bold text-slate-800">{countPemasangan} Transaksi</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Tagihan Bulanan</p>
            <p className="text-xl font-bold text-slate-800">{countTagihan} Transaksi</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 print:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama pelanggan, ID, atau deskripsi..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="semua">Semua Transaksi</option>
            <option value="Pemasangan Baru">Pemasangan Baru</option>
            <option value="Tagihan Bulanan">Tagihan Bulanan</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Tipe & ID</th>
                <th className="px-6 py-4 font-semibold">Pelanggan</th>
                <th className="px-6 py-4 font-semibold">Waktu Pelunasan</th>
                <th className="px-6 py-4 font-semibold text-right">Nominal Masuk</th>
                <th className="px-6 py-4 font-semibold text-right print:hidden">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Menarik catatan buku kas...
                  </td>
                </tr>
              )}
              {!isLoading && filteredPayments.map((payment) => {
                const isPemasangan = payment.type === "Pemasangan Baru"
                
                return (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isPemasangan ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          {isPemasangan ? <Cable className="w-5 h-5" /> : <CalendarDays className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{payment.type}</p>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{payment.id}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{payment.user_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{payment.user_email}</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase truncate max-w-[150px]">{payment.description}</p>
                    </td>

                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {formatDate(payment.paid_at)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="font-extrabold text-slate-900 text-base">{formatRupiah(payment.amount)}</span>
                    </td>

                    <td className="px-6 py-4 text-right print:hidden">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border bg-green-50 text-green-600 border-green-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {payment.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {!isLoading && filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada riwayat pembayaran yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
