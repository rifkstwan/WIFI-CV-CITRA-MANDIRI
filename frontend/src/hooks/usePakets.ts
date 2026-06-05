import { useQuery } from "@tanstack/react-query"
import api from "../services/api"

export type Paket = {
  id: number
  nama: string
  deskripsi: string
  kecepatan: number
  harga: number
  durasi: number
  is_aktif: boolean
}

export function usePakets() {
  return useQuery<Paket[]>({
    queryKey: ["pakets"],
    queryFn: async () => {
      const res = await api.get("/pakets")
      return res.data
    },
  })
}
