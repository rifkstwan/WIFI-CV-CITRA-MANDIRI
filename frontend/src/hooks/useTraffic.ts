import { useQuery } from "@tanstack/react-query"
import api from "../services/api"

export type TrafficData = {
  total: number
  download: number
  upload: number
  unit: string
}

export function useTraffic() {
  return useQuery<TrafficData>({
    queryKey: ["traffic"],
    queryFn: async () => {
      const res = await api.get("/traffic/my")
      return res.data
    },
  })
}
