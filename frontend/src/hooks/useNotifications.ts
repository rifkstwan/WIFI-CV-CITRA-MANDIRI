import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../services/api"

export type Notification = {
  id: number
  user_id: number
  title: string
  message: string
  is_read: boolean
  type: "info" | "success" | "warning" | "error"
  created_at: string
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications")
      return res.data
    },
    refetchInterval: 5000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/notifications/${id}/read`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
