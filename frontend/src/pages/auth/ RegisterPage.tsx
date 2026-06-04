import { MainLayout } from "../../layouts/MainLayout"

export function RegisterPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Register</h1>
        <p className="mt-2 text-sm text-slate-600">
          Buat akun pelanggan untuk pemesanan layanan internet.
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nama lengkap
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500"
              placeholder="Nama lengkap"
            />
          </div>

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
            Daftar
          </button>
        </form>
      </div>
    </MainLayout>
  )
}