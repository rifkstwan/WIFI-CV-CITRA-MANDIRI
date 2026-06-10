import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/api"
import { usePublicTestimonials } from "../../hooks/useTestimonials"
import { Star, Wifi, Rocket, Zap, Shield, Crown } from "lucide-react"
import "./HomePage.css"

type Package = {
  id: number
  nama: string
  kecepatan: number
  harga: number
  deskripsi: string
}

const dummyTestimonials = [
  {
    quote: "Koneksi internet dari CV. Citra Mandiri sangat stabil. Sangat membantu pekerjaan WFH saya setiap hari tanpa hambatan.",
    name: "Budi Santoso",
    role: "Pelanggan Rumahan",
    avatar: "https://i.pravatar.cc/150?u=budi",
    rating: 5
  },
  {
    quote: "Pelayanan teknisi sangat cepat tanggap. Saat ada gangguan, langsung ditangani dalam hitungan jam. Sangat memuaskan!",
    name: "Siti Aminah",
    role: "Pemilik UMKM",
    avatar: "https://i.pravatar.cc/150?u=siti",
    rating: 5
  },
  {
    quote: "Harga paketnya sangat terjangkau dibanding provider lain dengan kecepatan yang sama. Mantap untuk tugas kuliah.",
    name: "Rudi Hermawan",
    role: "Mahasiswa",
    avatar: "https://i.pravatar.cc/150?u=rudi",
    rating: 4
  },
  {
    quote: "Proses pemasangan sangat rapi dan cepat. Tim marketing juga menjelaskan detail paket dengan sangat jelas dan ramah.",
    name: "Linda Kusuma",
    role: "Ibu Rumah Tangga",
    avatar: "https://i.pravatar.cc/150?u=linda",
    rating: 5
  },
  {
    quote: "Sudah berlangganan lebih dari setahun dan jarang sekali ada masalah jaringan. Sangat direkomendasikan untuk freelance.",
    name: "Ahmad Fauzi",
    role: "Freelancer",
    avatar: "https://i.pravatar.cc/150?u=ahmad",
    rating: 5
  },
  {
    quote: "Ping untuk bermain game online sangat kecil dan stabil. Tidak ada lag sama sekali saat push rank. The best!",
    name: "Diki Pratama",
    role: "Gamer",
    avatar: "https://i.pravatar.cc/150?u=diki",
    rating: 5
  }
];

const faqs = [
  {
    question: "Berapa lama proses pemasangan WiFi baru?",
    answer: "Setelah Anda mendaftar dan melengkapi persyaratan, teknisi kami akan melakukan survei lokasi. Jika jaringan tersedia, instalasi rata-rata selesai dalam 1-3 hari kerja."
  },
  {
    question: "Apakah ada biaya tambahan untuk pemasangan?",
    answer: "Untuk paket tertentu kami memberikan promo bebas biaya instalasi. Namun untuk paket standar, terdapat biaya instalasi awal yang akan diinformasikan oleh tim sales kami sebelum pemasangan."
  },
  {
    question: "Apakah kecepatan internet unlimited tanpa FUP?",
    answer: "Ya, semua paket langganan kami adalah 100% unlimited tanpa adanya batasan kuota (FUP). Anda bisa menggunakan internet sepuasnya kapanpun."
  },
  {
    question: "Bagaimana cara melakukan pembayaran tagihan bulanan?",
    answer: "Pembayaran dapat dilakukan dengan mudah melalui transfer bank (BCA, Mandiri, BRI), e-wallet (OVO, GoPay, Dana), atau melalui minimarket terdekat seperti Indomaret dan Alfamart."
  },
  {
    question: "Apa yang harus dilakukan jika internet mengalami gangguan?",
    answer: "Anda dapat menghubungi layanan pelanggan kami yang beroperasi 24/7 melalui WhatsApp, telepon, atau sistem tiket di portal pelanggan. Tim teknis kami akan segera menangani keluhan Anda."
  }
];

export function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["public-packages"],
    queryFn: async () => {
      const res = await api.get("/pakets")
      return res.data
    },
  })

  const { data: publicTestimonials = [], isLoading: isLoadingTestimonials } = usePublicTestimonials()

  // Gabungkan dummy dengan testimoni asli dari database
  const allTestimonials = [
    ...dummyTestimonials,
    ...publicTestimonials.map(t => ({
      quote: t.quote,
      name: t.name,
      role: t.role || "Pelanggan Setia",
      avatar: t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=eff6ff&color=2563eb`,
      rating: t.rating
    }))
  ]


  return (
    <div className="lp">

      {/* ── NAVBAR (sticky, seluruh halaman) ── */}
      <div className={`lp-nav-wrap${scrolled ? " lp-nav-wrap--scrolled" : ""}`}>
        <nav className="lp-nav">
          <Link to="/" className="lp-brand">
            <img
              src="/src/assets/profile.jpg"
              alt="CV. Citra Mandiri"
              className="lp-brand-img"
            />
            <span className="lp-brand-name">CV. Citra Mandiri</span>
          </Link>

          <ul className="lp-nav-links">
            {[
              { label: "Home", href: "#home" },
              { label: "Layanan", href: "#layanan" },
              { label: "Paket", href: "#paket" },
              { label: "Coverage", href: "#coverage" },
              { label: "Kontak", href: "#footer" },
            ].map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>

          <div className="lp-nav-cta">
            <Link to="/login" className="btn btn-ghost btn-sm">Masuk</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Daftar Sekarang</Link>
          </div>
        </nav>
      </div>

      <section className="hero" id="home">

        {/* ── HERO CONTENT ── */}
        <div className="hero-content">

          {/* 3 concentric elliptical orbit rings — SVG gradient strokes */}
          <div className="hero-orbit" aria-hidden="true">
            <svg className="hero-orbit-svg" viewBox="0 0 960 500" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Horizontal gradient: transparent → blue → transparent (left to right) */}
                <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
                  <stop offset="20%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#2563eb" stopOpacity="0.04" />
                  <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="20%" stopColor="#3b82f6" stopOpacity="0.30" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.05" />
                  <stop offset="80%" stopColor="#2563eb" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="ringGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
                  <stop offset="20%" stopColor="#2563eb" stopOpacity="0.38" />
                  <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.06" />
                  <stop offset="80%" stopColor="#2563eb" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Outer ring: rx=479 ry=249 (full ellipse) */}
              <ellipse cx="480" cy="250" rx="479" ry="249" fill="none" stroke="url(#ringGrad1)" strokeWidth="1.5" />
              {/* Middle ring: inset 50/70 → cx=480,cy=250, rx=409 ry=199 */}
              <ellipse cx="480" cy="250" rx="409" ry="199" fill="none" stroke="url(#ringGrad2)" strokeWidth="1.5" />
              {/* Inner ring: inset 100/140 → rx=339 ry=149 */}
              <ellipse cx="480" cy="250" rx="339" ry="149" fill="none" stroke="url(#ringGrad3)" strokeWidth="1.5" />
            </svg>

            {/* ── OUTER ring icons (6) — left & right arcs ── */}
            {/* Outer Right upper */}
            <div className="hero-float hero-float--or-top">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" /></svg>
            </div>
            {/* Outer Right center */}
            <div className="hero-float hero-float--or-mid">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            </div>
            {/* Outer Right lower */}
            <div className="hero-float hero-float--or-bot">
              <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            {/* Outer Left upper */}
            <div className="hero-float hero-float--ol-top">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><circle cx="6" cy="6" r="1" /><circle cx="6" cy="18" r="1" /></svg>
            </div>
            {/* Outer Left center */}
            <div className="hero-float hero-float--ol-mid">
              <svg viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            {/* Outer Left lower */}
            <div className="hero-float hero-float--ol-bot">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            </div>

            {/* ── MIDDLE ring icons (4) ── */}
            {/* Middle Right upper */}
            <div className="hero-float hero-float--mr-top">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
            </div>
            {/* Middle Right lower */}
            <div className="hero-float hero-float--mr-bot">
              <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            {/* Middle Left upper */}
            <div className="hero-float hero-float--ml-top">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>
            </div>
            {/* Middle Left lower */}
            <div className="hero-float hero-float--ml-bot">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            </div>

            {/* ── INNER ring icons (2) ── */}
            {/* Inner Right */}
            <div className="hero-float hero-float--ir">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" /></svg>
            </div>
            {/* Inner Left */}
            <div className="hero-float hero-float--il">
              <svg viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            </div>

            {/* ── OUTER ring DIAGONAL icons (4 more) — filling the gaps ── */}
            {/* Outer NE (upper-right diagonal ~325°) */}
            <div className="hero-float hero-float--o-ne">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" /><line x1="2" y1="20" x2="2.01" y2="20" /></svg>
            </div>
            {/* Outer NW (upper-left diagonal ~215°) */}
            <div className="hero-float hero-float--o-nw">
              <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
            </div>
            {/* Outer SE (lower-right diagonal ~35°) */}
            <div className="hero-float hero-float--o-se">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
            </div>
            {/* Outer SW (lower-left diagonal ~145°) */}
            <div className="hero-float hero-float--o-sw">
              <svg viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22 6 12 13 2 6" /></svg>
            </div>

            {/* ── MIDDLE ring DIAGONAL icons (2 more) ── */}
            {/* Middle NE */}
            <div className="hero-float hero-float--m-ne">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            {/* Middle SW */}
            <div className="hero-float hero-float--m-sw">
              <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
          </div>

          {/* Badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>4.9 Rating</span>
            <span className="hero-badge-sep">·</span>
            <span>Dipercaya 500+ Pelanggan</span>
          </div>

          <h1 className="hero-title">
            Internet Cepat &amp;<br />
            <span className="hero-title-gradient">Stabil untuk Rumah</span>
          </h1>

          <p className="hero-subtitle">
            Nikmati koneksi internet fiber optic berkecepatan tinggi dengan harga terjangkau.
            Streaming, gaming, dan bekerja dari rumah tanpa hambatan.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Daftar Sekarang
            </Link>
            <a href="#paket" className="btn btn-ghost btn-lg">
              Lihat Paket
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
          </div>
        </div>

        {/* Proof cards */}
        <div className="hero-proofs">
          <div className="hero-proof-card">
            <div className="hero-proof-icon hero-proof-icon--speed">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <div>
              <div className="hero-proof-title">Up to 100 Mbps</div>
              <div className="hero-proof-desc">Kecepatan stabil 24/7</div>
            </div>
          </div>
          <div className="hero-proof-card">
            <div className="hero-proof-icon hero-proof-icon--support">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </div>
            <div>
              <div className="hero-proof-title">Support 24 Jam</div>
              <div className="hero-proof-desc">Tim siap membantu Anda</div>
            </div>
          </div>
          <div className="hero-proof-card">
            <div className="hero-proof-icon hero-proof-icon--coverage">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            </div>
            <div>
              <div className="hero-proof-title">Coverage Luas</div>
              <div className="hero-proof-desc">Jangkauan seluruh kota</div>
            </div>
          </div>
        </div>

        {/* Trusted strip */}
        <div className="hero-trusted">
          <p className="hero-trusted-label">Dipercaya oleh berbagai kalangan di seluruh Grobogan</p>
          <div className="hero-trusted-logos">
            <span className="hero-trusted-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              Rumah Tangga
            </span>
            <span className="hero-trusted-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="9" y1="6" x2="15" y2="6" /><line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="15" y2="14" /><line x1="9" y1="18" x2="15" y2="18" /></svg>
              Kantor
            </span>
            <span className="hero-trusted-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
              UMKM
            </span>
            <span className="hero-trusted-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
              Sekolah
            </span>
            <span className="hero-trusted-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>
              Kafe &amp; Resto
            </span>
            <span className="hero-trusted-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              Klinik
            </span>
          </div>
        </div>
      </section>

      {/* ══ SECTION: KEUNGGULAN ══ */}
      <section className="features" id="layanan">
        <div className="features-inner">

          {/* Two-tone heading */}
          <div className="features-header">
            <h2 className="features-title">
              <span className="features-title--dark">Kami memberikan koneksi terbaik,</span>{" "}
              <span className="features-title--muted">dengan layanan yang dapat diandalkan</span>
            </h2>
          </div>

          {/* Single big card containing 3×2 grid */}
          <div className="features-board">

            {/* 1 — Kecepatan Tinggi */}
            <div className="feat-item">
              <div className="feat-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <circle cx="12" cy="20" r="1" fill="#2563eb" stroke="none" />
                </svg>
              </div>
              <p className="feat-item-name">Kecepatan tinggi dan stabil</p>
              <p className="feat-item-desc">Koneksi fiber optik memberikan kecepatan unduh hingga 100 Mbps dengan latensi rendah sepanjang hari.</p>
            </div>

            {/* 2 — Instalasi Profesional */}
            <div className="feat-item">
              <div className="feat-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <p className="feat-item-name">Instalasi oleh teknisi berpengalaman</p>
              <p className="feat-item-desc">Pemasangan jaringan dilakukan oleh teknisi terlatih tanpa biaya tambahan di seluruh wilayah layanan kami.</p>
            </div>

            {/* 3 — Dukungan Pelanggan */}
            <div className="feat-item">
              <div className="feat-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="feat-item-name">Layanan pelanggan siap sedia</p>
              <p className="feat-item-desc">Tim dukungan kami tersedia setiap hari, termasuk hari libur, untuk menangani setiap pertanyaan dan gangguan jaringan.</p>
            </div>

            {/* 4 — Harga Transparan */}
            <div className="feat-item">
              <div className="feat-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <p className="feat-item-name">Harga transparan tanpa biaya tersembunyi</p>
              <p className="feat-item-desc">Setiap paket memiliki harga yang jelas, termasuk pajak dan biaya instalasi, tanpa syarat dan ketentuan yang membingungkan.</p>
            </div>

            {/* 5 — Jangkauan Luas */}
            <div className="feat-item">
              <div className="feat-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <p className="feat-item-name">Jangkauan jaringan yang luas</p>
              <p className="feat-item-desc">Infrastruktur kami mencakup seluruh wilayah Kabupaten Grobogan dengan terus memperluas area layanan secara berkala.</p>
            </div>

            {/* 6 — Teknologi Fiber Optik */}
            <div className="feat-item">
              <div className="feat-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <path d="M15 2v2" /><path d="M15 20v2" />
                  <path d="M2 15h2" /><path d="M20 15h2" />
                  <path d="M2 9h2" /><path d="M20 9h2" />
                  <path d="M9 2v2" /><path d="M9 20v2" />
                </svg>
              </div>
              <p className="feat-item-name">Infrastruktur berbasis teknologi terkini</p>
              <p className="feat-item-desc">Jaringan kami dibangun dengan teknologi fiber optik generasi terbaru yang mampu merespons kebutuhan bandwidth masa depan.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ══ SECTION: PAKET & HARGA ══ */}
      <section className="pricing" id="paket">
        <div className="pricing-inner">

          {/* Header */}
          <div className="pricing-header">
            <h2 className="pricing-title">Paket Harga untuk Semua Kebutuhan</h2>
            <p className="pricing-subtitle">
              Pilih paket internet yang sesuai dengan kebutuhan Anda.
              Semua paket sudah termasuk instalasi gratis dan dukungan teknis.
            </p>

          </div>

          {/* Cards */}
          <div className="pricing-cards">

            {isLoading ? (
              <div className="text-center py-12 text-slate-500 w-full">Memuat paket WiFi...</div>
            ) : packages.length === 0 ? (
              <div className="text-center py-12 text-slate-500 w-full">Belum ada paket yang tersedia.</div>
            ) : (
              packages.map((pkg, idx) => {
                const getIcon = (i: number) => {
                   const icons = [
                     <Wifi strokeWidth={2.5} className="w-5 h-5" />,
                     <Rocket strokeWidth={2.5} className="w-5 h-5" />,
                     <Zap strokeWidth={2.5} className="w-5 h-5" />,
                     <Crown strokeWidth={2.5} className="w-5 h-5" />,
                     <Shield strokeWidth={2.5} className="w-5 h-5" />
                   ];
                   return icons[i % icons.length];
                };
                
                const getColors = (i: number) => {
                   const colors = [
                     'text-blue-600 bg-blue-50 border border-blue-100',
                     'text-emerald-600 bg-emerald-50 border border-emerald-100',
                     'text-orange-600 bg-orange-50 border border-orange-100',
                     'text-purple-600 bg-purple-50 border border-purple-100',
                     'text-rose-600 bg-rose-50 border border-rose-100'
                   ];
                   return colors[i % colors.length];
                };

                return (
                <div key={pkg.id} className="price-card">
                  <div className={`price-card-icon ${getColors(idx)}`} style={{ marginBottom: '36px' }}>
                    {getIcon(idx)}
                  </div>
                  <h3 className="price-card-name">{pkg.nama}</h3>
                  <p className="price-card-desc">{pkg.deskripsi}</p>
                  <div className="price-card-price">
                    <span className="price-amount">{pkg.harga.toLocaleString('id-ID')}</span>
                    <span className="price-unit">/ bulan</span>
                  </div>
                  <Link to="/register" className="price-card-btn price-card-btn--outline">Pilih Paket</Link>
                  <div className="price-features">
                    <p className="price-features-label">Keunggulan:</p>
                    <div className="price-feature-row">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      <span>Kecepatan stabil {pkg.kecepatan} Mbps</span>
                    </div>
                    <div className="price-feature-row">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      <span>Unlimited Tanpa FUP</span>
                    </div>
                    <div className="price-feature-row">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      <span>Support Teknisi</span>
                    </div>
                  </div>
                </div>
              )})
            )}

          </div>
        </div>
      </section>

      {/* ══ SECTION: CARA BERLANGGANAN ══ */}
      <section className="how-it-works" id="cara-berlangganan">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="hiw-tag">Cara Berlangganan</span>
        </div>
        <div className="hiw-inner">

          {/* ── Kolom Kiri ── */}
          <div className="hiw-left">
            <h2 className="hiw-title">
              Mulai menikmati internet cepat<br />
              <span className="hiw-title-accent">dalam empat langkah mudah</span>
            </h2>
            <p className="hiw-desc">
              Proses pendaftaran dirancang sederhana dan transparan.
              Dari pemilihan paket hingga jaringan aktif, tim kami
              memastikan setiap tahap berjalan lancar tanpa kerumitan.
            </p>
          </div>

          {/* ── Kolom Kanan: Timeline ── */}
          <div className="hiw-right">

            {/* Step 1 */}
            <div className="hiw-step">
              <div className="hiw-step-left">
                <div className="hiw-step-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                </div>
                <div className="hiw-step-line" />
              </div>
              <div className="hiw-step-body">
                <h3 className="hiw-step-title">Pilih Paket yang Sesuai</h3>
                <p className="hiw-step-desc">Bandingkan paket Dasar, Standar, dan Unggulan. Pilih yang paling sesuai dengan kebutuhan dan anggaran Anda.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="hiw-step">
              <div className="hiw-step-left">
                <div className="hiw-step-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="hiw-step-line" />
              </div>
              <div className="hiw-step-body">
                <h3 className="hiw-step-title">Isi Formulir Pendaftaran</h3>
                <p className="hiw-step-desc">Lengkapi data diri dan alamat instalasi melalui formulir online atau hubungi tim kami secara langsung untuk bantuan.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="hiw-step">
              <div className="hiw-step-left">
                <div className="hiw-step-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <div className="hiw-step-line" />
              </div>
              <div className="hiw-step-body">
                <h3 className="hiw-step-title">Jadwalkan Instalasi</h3>
                <p className="hiw-step-desc">Teknisi berpengalaman kami akan datang ke lokasi sesuai jadwal yang disepakati. Instalasi selesai rata-rata dalam satu hari kerja.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="hiw-step hiw-step--last">
              <div className="hiw-step-left">
                <div className="hiw-step-icon hiw-step-icon--active">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <circle cx="12" cy="20" r="1" fill="#fff" stroke="none" />
                  </svg>
                </div>
              </div>
              <div className="hiw-step-body">
                <h3 className="hiw-step-title">Nikmati Internet Tanpa Batas</h3>
                <p className="hiw-step-desc">Jaringan Anda aktif dan siap digunakan. Pantau penggunaan dan kelola tagihan kapan saja melalui portal pelanggan kami.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ SECTION: JANGKAUAN / CEK AREA ══ */}
      <section className="coverage" id="coverage">
        {/* ── Header Tengah ── */}
        <div className="coverage-header">
          <span className="coverage-label">Jangkauan Layanan</span>
          <h2 className="coverage-title">
            Koneksi internet cepat tersedia<br />
            <span className="coverage-title-accent">di seluruh Kabupaten Grobogan</span>
          </h2>
          <p className="coverage-desc">
            Jaringan fiber optik kami menjangkau berbagai kecamatan
            di Kabupaten Grobogan, Jawa Tengah. Periksa ketersediaan
            layanan di area Anda melalui formulir di bawah ini.
          </p>

          {/* ── Input Cek Area ── */}
          <div className="coverage-check">
            <div className="coverage-input-wrap">
              <svg className="coverage-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                type="text"
                className="coverage-input"
                placeholder="Masukkan alamat atau kode pos..."
              />
            </div>
            <button className="btn btn-primary coverage-btn">
              Cek Ketersediaan
            </button>
          </div>
        </div>

        <div className="coverage-inner">

          {/* ── Kolom Kiri ── */}
          <div className="coverage-left">

            {/* ── Divider ── */}
            <div className="coverage-divider" />

            {/* ── Info Kontak ── */}
            <p className="coverage-contact-label">Hubungi kami untuk informasi lebih lanjut</p>
            <p className="coverage-phone">0812-3456-7890</p>
            {/* ── Area terjangkau ── */}
            <div className="coverage-areas">
              {["Brati", "Gabus", "Geyer", "Godong", "Grobogan", "Gubug", "Karangrayung", "Kedungjati", "Klambu", "Kradenan", "Ngaringan", "Penawangan", "Pulokulon", "Purwodadi", "Tanggungharjo", "Tawangharjo", "Tegowanu", "Toroh", "Wirosari"].map(area => (
                <span key={area} className="coverage-area-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* ── Kolom Kanan: Peta Grobogan ── */}
          <div className="coverage-right">
            <div className="coverage-map-frame" style={{ alignItems: 'flex-start' }}>
              <div className="coverage-map-inner" style={{ position: 'relative', width: '100%', height: 'max-content' }}>
                <img
                  src="/grobogan-mask.png?v=3"
                  alt="Peta Kabupaten Grobogan"
                  className="coverage-wikimedia-map"
                  style={{ position: 'relative', width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                />

                {/* Glowing Network Pins dengan Label Kecamatan */}
                <div className="coverage-pin-wrapper" style={{ top: '26%', left: '13%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Tegowanu</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '44%', left: '10%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Tanggungharjo</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '59%', left: '14%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Kedungjati</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '33%', left: '19%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Gubug</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '33%', left: '28%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Godong</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '50%', left: '24%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Karangrayung</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '46%', left: '37%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Penawangan</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '18%', left: '34%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Klambu</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '27%', left: '44%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Brati</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '26%', left: '54%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Grobogan</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '43%', left: '49%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Purwodadi</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '59%', left: '49%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Toroh</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '73%', left: '51%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Geyer</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '33%', left: '62%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Tawangharjo</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '30%', left: '71%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Wirosari</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '31%', left: '81%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Ngaringan</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '59%', left: '66%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Pulokulon</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '59%', left: '76%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Kradenan</div>
                </div>
                <div className="coverage-pin-wrapper" style={{ top: '59%', left: '86%' }}>
                  <div className="coverage-pin"></div>
                  <div className="coverage-pin-label">Gabus</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══ SECTION: TESTIMONIALS ══ */}
      <section className="testimonials" id="testimonials">
        <div className="testimonials-header">
          <span className="testimonials-tag">Testimonials</span>
          <h2 className="testimonials-title">Apa Kata Pelanggan Kami</h2>
          <p className="testimonials-desc">
            Kami bangga dapat memberikan layanan internet terbaik untuk warga Grobogan.
            Tapi jangan hanya percaya kata-kata kami, dengarkan pengalaman mereka.
          </p>
        </div>

        <div className="testimonials-marquee-wrapper">
          <div className="testimonials-track track-1">
            {[...allTestimonials, ...allTestimonials].map((t, i) => (
              <div key={`t1-${i}`} className="testimonial-card">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                  ))}
                </div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-author-info">
                    <h4 className="testimonial-name">{t.name}</h4>
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                </div>
              </div>
            ))}
          </div>

          <div className="testimonials-track track-2">
            {[...allTestimonials.slice(3), ...allTestimonials.slice(0, 3), ...allTestimonials.slice(3), ...allTestimonials.slice(0, 3)].map((t, i) => (
              <div key={`t2-${i}`} className="testimonial-card">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                  ))}
                </div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-author-info">
                    <h4 className="testimonial-name">{t.name}</h4>
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonials-actions">
          <button className="btn btn-ghost" style={{ border: '1px solid #e5e7eb', background: '#fff', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Lihat Semua Ulasan
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </section>

      {/* ══ SECTION: FAQ ══ */}
      <section className="faq-section" id="faq">
        <div className="faq-inner">

          {/* Kolom Kiri */}
          <div className="faq-left">
            <div className="faq-tag-wrapper">
              <span className="faq-tag-text">FAQS</span>
            </div>
            <h2 className="faq-title">Pertanyaan yang Sering Diajukan</h2>

            <div className="faq-contact-card">
              <h3 className="faq-card-title">Masih punya pertanyaan?</h3>
              <p className="faq-card-desc">
                Tim support kami siap membantu Anda menjawab segala pertanyaan terkait layanan internet CV. Citra Mandiri.
              </p>
              <a href="#footer" className="btn btn-primary faq-card-btn" style={{ textAlign: 'center', display: 'block' }}>
                Hubungi Kami
              </a>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="faq-right">
            {faqs.map((faq, index) => {
              const isActive = activeFaq === index;
              return (
                <div
                  key={index}
                  className={`faq-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveFaq(isActive ? null : index)}
                >
                  <div className="faq-question">
                    <h4>{faq.question}</h4>
                    <span className="faq-icon">{isActive ? '×' : '+'}</span>
                  </div>
                  {isActive && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══ SECTION: FOOTER & CTA ══ */}
      <div className="footer-container">

        {/* CTA Box (Overlapping) */}
        <div className="footer-cta-wrapper">
          <div className="footer-cta">
            <h2 className="footer-cta-title">Siap Menikmati Internet Cepat dan Stabil?</h2>
            <p className="footer-cta-desc">
              Bergabunglah dengan ribuan pelanggan CV. Citra Mandiri lainnya dan rasakan pengalaman internet tanpa batas untuk rumah maupun bisnis Anda.
            </p>
            <a href="#register" className="footer-cta-btn">
              Daftar Sekarang
            </a>
          </div>
        </div>

        {/* Main Footer */}
        <footer className="footer-main" id="footer">
          <div className="footer-grid">

            {/* Column 1: Brand */}
            <div className="footer-brand">
              <div className="footer-logo-wrapper">
                <img src="/src/assets/profile.jpg" alt="Logo CV. Citra Mandiri" className="footer-logo" />
                <span className="footer-brand-name">CV. Citra Mandiri</span>
              </div>
              <p className="footer-desc">
                Penyedia layanan internet (ISP) terpercaya yang menggabungkan koneksi stabil, kecepatan tinggi, dan dukungan layanan pelanggan 24/7 untuk mendukung aktivitas digital Anda.
              </p>
              <div className="footer-socials">
                <a href="#" className="footer-social-link" aria-label="Twitter">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                </a>
                <a href="#" className="footer-social-link" aria-label="Instagram">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href="#" className="footer-social-link" aria-label="LinkedIn">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="footer-title">Layanan</h4>
              <ul className="footer-links">
                <li><a href="#paket-dasar">Paket Dasar</a></li>
                <li><a href="#paket-standar">Paket Standar</a></li>
                <li><a href="#paket-unggulan">Paket Unggulan</a></li>
                <li><a href="#coverage">Cek Jangkauan</a></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="footer-title">Perusahaan</h4>
              <ul className="footer-links">
                <li><a href="#about">Tentang Kami</a></li>
                <li><a href="#testimonials">Testimonial</a></li>
                <li><a href="#blog">Berita & Promo</a></li>
                <li><a href="#contact">Kontak Sales</a></li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h4 className="footer-title">Legal</h4>
              <ul className="footer-links">
                <li><a href="#tos">Syarat & Ketentuan</a></li>
                <li><a href="#privacy">Kebijakan Privasi</a></li>
                <li><a href="#fup">Kebijakan FUP</a></li>
                <li><a href="#faq">Pusat Bantuan</a></li>
              </ul>
            </div>

          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} CV. Citra Mandiri. All rights reserved.</span>
            <span>Berkomitmen memajukan konektivitas internet di Grobogan.</span>
          </div>
        </footer>

      </div>

    </div>
  )
}