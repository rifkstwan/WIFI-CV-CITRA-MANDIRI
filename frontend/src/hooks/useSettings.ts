import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../services/api"

export type SettingsMap = {
  company_name?: string
  company_address?: string
  company_email?: string
  company_phone?: string
  tax_percentage?: string
  maintenance_mode?: string
  [key: string]: string | undefined
}

export function useSettings() {
  return useQuery<SettingsMap>({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await api.get("/settings")
      return res.data.data
    },
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (settings: SettingsMap) => {
      const res = await api.post("/settings", { settings })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },
  })
}
