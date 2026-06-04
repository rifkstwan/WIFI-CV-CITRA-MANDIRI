import { MainLayout } from "../../layouts/MainLayout"

export function LoginPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Masuk ke dashboard pelanggan, admin, teknisi, atau owner.
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500"
              placeholder="********"
            />
          </div>

          <button className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700">
            Login
          </button>
        </form>
      </div>
    </MainLayout>
  )
}