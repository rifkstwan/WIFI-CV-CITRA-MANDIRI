import { useQuery } from "@tanstack/react-query"
import api from "../../services/api"

type OwnerUser = {
  id: number
  name: string
  email: string
  roles: string[]
}

export function OwnerUsersPage() {
  const { data: users, isLoading, isError } = useQuery<OwnerUser[]>({
    queryKey: ["owner-users"],
    queryFn: async () => {
      const res = await api.get("/owner/users")
      return res.data
    },
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monitoring User</h1>
          <p className="text-sm text-slate-500 mt-1">
            Owner hanya dapat melihat daftar user dan role untuk monitoring.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-900 mb-4">Daftar User</h2>

          {isLoading && <p className="text-sm text-slate-400">Memuat data...</p>}
          {isError && <p className="text-sm text-red-500">Gagal memuat data user.</p>}

          {!isLoading && !isError && (
            <div className="space-y-3">
              {users?.length ? (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-4 border border-slate-100 rounded-xl p-4"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Role: {user.roles?.length ? user.roles.join(", ") : "-"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">Belum ada data user.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
