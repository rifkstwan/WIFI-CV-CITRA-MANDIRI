import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../services/api"

export type TechnicianAccount = {
  id: number
  name: string
  email: string
  phone: string | null
  created_at: string
}

export function useTechnicianAccounts() {
  return useQuery<TechnicianAccount[]>({
    queryKey: ["technician-accounts"],
    queryFn: async () => {
      const res = await api.get("/technician-accounts")
      return res.data
    },
  })
}

export function useCreateTechnicianAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<TechnicianAccount> & { password?: string }) => {
      const res = await api.post("/technician-accounts", data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-accounts"] })
    },
  })
}

export function useUpdateTechnicianAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<TechnicianAccount> & { id: number, password?: string }) => {
      const res = await api.put(`/technician-accounts/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-accounts"] })
    },
  })
}

export function useDeleteTechnicianAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/technician-accounts/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-accounts"] })
    },
  })
}
