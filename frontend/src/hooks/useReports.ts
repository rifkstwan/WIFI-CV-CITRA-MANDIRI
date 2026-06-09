import { useQuery } from "@tanstack/react-query"
import api from "../services/api"

export type ReportSummary = {
  total_pendapatan: number
  pendapatan_bulan_ini: number
  pelanggan_aktif: number
  pelanggan_suspend: number
  total_order: number
  order_pending: number
  tiket_aktif: number
  teknisi_bertugas: number
  paket_terlaris: Array<{ nama: string; total: number }>
  pendapatan_per_bulan: Array<{ bulan: string; total: number }>
  status_breakdown: Record<string, number>
}

export function useReportSummary(period: string = '6m') {
  return useQuery<ReportSummary>({
    queryKey: ["report-summary", period],
    queryFn: async () => {
      const res = await api.get(`/reports/summary?period=${period}`)
      return res.data
    },
    refetchInterval: 30000, // Auto-refresh data every 30 seconds
  })
}
