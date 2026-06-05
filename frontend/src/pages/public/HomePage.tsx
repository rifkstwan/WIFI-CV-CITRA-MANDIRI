import { Link } from "react-router-dom"
import { useEffect, useRef } from "react"
import groboganAsset from "../../assets/grobogan_asset.png"
import { usePakets } from "../../hooks/usePakets"
import "./HomePage.css"

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(angka)
}

const fallbackPakets = [
  { id: 1, nama: "Dasar",     kecepatan: 10, harga: 100000, durasi: 30 },
  { id: 2, nama: "Reguler",   kecepatan: 20, harga: 150000, durasi: 30 },
  { id: 3, nama: "Bisnis",    kecepatan: 40, harga: 200000, durasi: 30 },
  { id: 4, nama: "Eksekutif", kecepatan: 80, harga: 250000, durasi: 30 },
]

const features = [
  { icon: "⚡", iconClass: "icon-blue",   title: "Fiber Optik",     desc: "Teknologi kabel optik tercepat untuk koneksi super stabil tanpa gangguan sinyal." },
  { icon: "📡", iconClass: "icon-purple", title: "24/7 Uptime",     desc: "Jaminan koneksi non-stop 99.9% uptime. Tidak ada jeda, tidak ada gangguan." },
  { icon: "🛡️", iconClass: "icon-cyan",   title: "Anti Lag",        desc: "Cocok untuk gaming kompetitif & streaming 4K tanpa buffering sama sekali." },
  { icon: "🚀", iconClass: "icon-green",  title: "Instalasi Cepat", desc: "Tim teknisi kami siap pasang dalam waktu 24 jam setelah pendaftaran." },
]

const steps = [
  { num: "01", title: "Pilih Paket",     desc: "Tentukan bandwidth terbaik yang sesuai kebutuhan rumah atau bisnis Anda." },
  { num: "02", title: "Daftar Sekarang", desc: "Isi data pelanggan dan alamat pemasangan. Prosesnya cepat dan mudah." },
  { num: "03", title: "Internet Aktif",  desc: "Tim kami proses order dan siapkan koneksi dalam waktu maksimal 1×24 jam." },
]

const packageFeatures = ["Unlimited Kuota", "Gratis Router WiFi", "Gratis Instalasi", "Support 24/7"]

export function HomePage() {
  const { data: pakets, isLoading, isError } = usePakets()
  const displayedPakets = pakets?.length ? pakets : fallbackPakets
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("lp-visible")
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll(".lp-animate").forEach((el) => {
      observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="lp">

      {/* ── NAVBAR PILL ── */}
      <div className="lp-nav-wrap">
        <nav className="lp-nav" aria-label="Navigasi utama">
          <Link to="/" className="lp-brand">
            <div className="lp-brand-icon" aria-hidden="true">CM</div>
            <div className="lp-brand-name">CV. Citra Mandiri</div>
          </Link>
          <ul className="lp-nav-links">
            <li><a href="#paket">Paket</a></li>
            <li><a href="#keunggulan">Keunggulan</a></li>
            <li><a href="#alur">Cara Daftar</a></li>
            <li><a href="#footer">Kontak</a></li>
          </ul>
          <div className="lp-nav-cta">
            <Link to="/login" className="btn btn-ghost btn-sm">Masuk</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Daftar Sekarang</Link>
          </div>
        </nav>
      </div>

      {/* ── HERO ── */}
      <section className="lp-hero">

        {/* Badge kiri */}
        <div className="lp-hero-badge lp-badge-left">
          <div className="lp-badge-row">
            <span className="lp-badge-label">Tanpa Fiber</span>
            <span className="lp-badge-val lp-badge-low">8 Mbps</span>
          </div>
          <div className="lp-badge-row">
            <span className="lp-badge-label">Dengan Kami</span>
            <span className="lp-badge-val lp-badge-high">80 Mbps</span>
          </div>
        </div>

        {/* Badge kanan */}
        <div className="lp-hero-badge lp-badge-right">
          <div className="lp-badge-icon">🛰️</div>
          <div className="lp-badge-right-text">
            <strong>99.9% Uptime</strong>
            <span>Koneksi Terjamin</span>
          </div>
        </div>

        <div className="lp-container lp-hero-inner">
          <div className="lp-hero-eyebrow">
            <span className="lp-eyebrow-dot">●</span>
            Internet Fiber Optik Terbaik di Grobogan
          </div>
          <h1 className="lp-hero-title">
            Internet Rumah <span className="lp-hero-accent">Super Cepat</span>
            <br />&amp; Unlimited Tanpa Batas
          </h1>
          <p className="lp-hero-sub">
            CV. Citra Mandiri menghadirkan koneksi fiber optik terstabil untuk rumah
            dan bisnis di Grobogan. Pasang sekarang, aktif dalam 24 jam.
          </p>
          <div className="lp-hero-actions">
            <Link to="/register" className="btn-hero-primary">Daftar Sekarang →</Link>
            <a href="#paket" className="btn-hero-ghost">Lihat Paket</a>
          </div>

          {/* Stats */}
          <div className="lp-hero-stats-row">
            <div className="lp-hstat">
              <strong>100%</strong><span>Fiber Optik</span>
            </div>
            <div className="lp-hstat-sep" />
            <div className="lp-hstat">
              <strong>1:1</strong><span>Download / Upload</span>
            </div>
            <div className="lp-hstat-sep" />
            <div className="lp-hstat">
              <strong>1000+</strong><span>Pelanggan Puas</span>
            </div>
          </div>
        </div>

        {/* Ilustrasi full-width */}
        <div className="lp-hero-img-wrap">
          <img
            src={groboganAsset}
            alt="Ilustrasi kota Grobogan dengan jaringan internet fiber"
            className="lp-hero-img"
          />
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="lp-trust">
        <div className="lp-container lp-trust-inner">
          {[
            { icon: "✓", text: "Instalasi Gratis" },
            { icon: "∞", text: "Unlimited Kuota" },
            { icon: "🔒", text: "Garansi 7 Hari" },
            { icon: "🛠️", text: "Support 24/7" },
            { icon: "📡", text: "Fiber Optik" },
          ].map((item) => (
            <div className="lp-trust-item" key={item.text}>
              <span className="lp-trust-icon">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── KEUNGGULAN ── */}
      <section className="lp-section" id="keunggulan">
        <div className="lp-container">
          <div className="lp-animate">
            <div className="lp-section-label">✦ Keunggulan Kami</div>
            <h2 className="lp-section-title">Mengapa Pilih CV. Citra Mandiri?</h2>
            <p className="lp-section-sub">Teknologi terdepan dan layanan prima untuk pengalaman internet maksimal setiap hari.</p>
          </div>
          <div className="lp-features-grid">
            {features.map((feat, i) => (
              <div className={`lp-feature-card lp-animate lp-delay-${i + 1}`} key={feat.title}>
                <div className={`lp-feature-icon ${feat.iconClass}`}>{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section className="lp-section lp-packages" id="paket">
        <div className="lp-container">
          <div className="lp-packages-header lp-animate">
            <div className="lp-section-label">⚡ Pilihan Paket</div>
            <h2 className="lp-section-title">Paket Internet Terbaik</h2>
            <p className="lp-section-sub">Koneksi tercepat & terstabil di Grobogan. Pilih yang sesuai kebutuhanmu.</p>
          </div>
          {isError && (
            <div className="lp-notice" role="alert">⚠️ Menampilkan paket sementara.</div>
          )}
          <div className="lp-pkg-grid" aria-busy={isLoading}>
            {(isLoading ? fallbackPakets : displayedPakets).map((paket, index) => {
              const isFeatured = index === 1
              return (
                <article
                  className={`lp-pkg-card lp-animate lp-delay-${index + 1}${isFeatured ? " lp-pkg-featured" : ""}`}
                  key={paket.id}
                >
                  {isFeatured && <div className="lp-pkg-popular">⭐ Terpopuler</div>}
                  <div className="lp-pkg-name">{paket.nama}</div>
                  <div className="lp-pkg-speed">
                    <span className="lp-pkg-speed-num">{paket.kecepatan}</span>
                    <span className="lp-pkg-speed-unit"> Mbps</span>
                  </div>
                  <div className="lp-pkg-speed-type">Download &amp; Upload</div>
                  <div className="lp-pkg-price-row">
                    <div className="lp-pkg-price-label">Harga Bulanan</div>
                    <div className="lp-pkg-price">{formatRupiah(paket.harga)}</div>
                    <div className="lp-pkg-price-period">per {paket.durasi} hari</div>
                  </div>
                  <ul className="lp-pkg-features">
                    {packageFeatures.map((f) => (
                      <li key={f}><span className="feat-icon">✓</span>{f}</li>
                    ))}
                    <li><span className="feat-icon">⏰</span>Aktif dalam 24 jam</li>
                  </ul>
                  <Link
                    to={`/order?paket=${paket.id}`}
                    className={`lp-pkg-btn ${isFeatured ? "lp-pkg-btn-filled" : "lp-pkg-btn-outline"}`}
                  >
                    Berlangganan Sekarang
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CARA DAFTAR ── */}
      <section className="lp-section" id="alur">
        <div className="lp-container">
          <div className="lp-animate" style={{ textAlign: "center" }}>
            <div className="lp-section-label">🚀 Cara Daftar</div>
            <h2 className="lp-section-title">Internet Aktif dalam 3 Langkah</h2>
            <p className="lp-section-sub" style={{ margin: "0 auto" }}>Proses mudah, cepat, dan transparan.</p>
          </div>
          <div className="lp-steps-grid">
            {steps.map((step, i) => (
              <div className={`lp-step lp-animate lp-delay-${i + 1}`} key={step.num}>
                <div className="lp-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="lp-cta">
        <div className="lp-container">
          <div className="lp-cta-inner lp-animate">
            <div>
              <h2 className="lp-cta-title">Dipercaya <span style={{ color: "#60a5fa" }}>1000+ Pelanggan</span> di Grobogan</h2>
              <p className="lp-cta-sub">Bergabunglah dan rasakan internet super cepat dari CV. Citra Mandiri.</p>
              <div className="lp-cta-perks">
                <span className="lp-cta-perk">✓ Gratis instalasi</span>
                <span className="lp-cta-perk">✓ Garansi 7 hari</span>
                <span className="lp-cta-perk">✓ Support 24/7</span>
              </div>
            </div>
            <div className="lp-cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">🚀 Daftar Sekarang</Link>
              <a href="https://wa.me/6285156082917" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="lp-footer" id="footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div>
              <Link to="/" className="lp-brand">
                <div className="lp-brand-icon">CM</div>
                <span className="lp-brand-name">CV. Citra Mandiri</span>
              </Link>
              <p className="lp-footer-desc">Penyedia internet fiber optik terbaik di Grobogan sejak 2018.</p>
              <div className="lp-footer-contact">
                <a href="https://wa.me/6285156082917" target="_blank" rel="noopener noreferrer">📱 0851-5608-2917</a>
                <span>📍 Grobogan, Jawa Tengah</span>
              </div>
            </div>
            <div className="lp-footer-col">
              <h4>Layanan</h4>
              <ul>
                <li><a href="#paket">Paket Rumahan</a></li>
                <li><a href="#paket">Paket Bisnis</a></li>
                <li><a href="#alur">Cara Daftar</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Informasi</h4>
              <ul>
                <li><a href="#keunggulan">Tentang Kami</a></li>
                <li><Link to="/login">Area Pelanggan</Link></li>
                <li><a href="#footer">Kontak</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Akun</h4>
              <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Daftar Baru</Link></li>
              </ul>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <p className="lp-footer-copy">© 2024 CV. Citra Mandiri. All rights reserved.</p>
            <p className="lp-footer-copy">Internet Terbaik di Grobogan</p>
          </div>
        </div>
      </footer>

    </div>
  )
}