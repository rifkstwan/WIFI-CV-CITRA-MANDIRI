import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../services/api"

export type Order = {
  id: number
  paket_id: number
  status: "pending" | "aktif" | "ditolak" | "selesai"
  alamat: string
  catatan: string
  total_harga: number
  tanggal_mulai: string | null
  tanggal_selesai: string | null
  created_at: string
  paket: {
    id: number
    nama: string
    kecepatan: number
    harga: number
  }
}

export function useMyOrders() {
  return useQuery<Order[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await api.get("/orders/my")
      return res.data
    },
    refetchInterval: 5000,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      paket_id: number
      alamat: string
      catatan?: string
    }) => {
      const res = await api.post("/orders", data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] })
    },
  })
}
