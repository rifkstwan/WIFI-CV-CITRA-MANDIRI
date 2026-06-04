import { MainLayout } from "../../layouts/MainLayout"

export function HomePage() {
  return (
    <MainLayout>
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-teal-100 px-4 py-1 text-sm font-medium text-teal-700">
            Sistem Informasi Manajemen Layanan WiFi
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Kelola layanan internet dalam satu sistem terintegrasi
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Mendukung pemesanan layanan, pembayaran online, notifikasi otomatis,
            tiket keluhan, dan monitoring pemasangan.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-slate-900">Fitur utama</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>• Pemesanan layanan WiFi</li>
            <li>• Pembayaran Midtrans</li>
            <li>• WhatsApp & email notification</li>
            <li>• Ticketing dan monitoring instalasi</li>
          </ul>
        </div>
      </section>
    </MainLayout>
  )
}