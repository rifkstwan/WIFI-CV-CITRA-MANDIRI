import { Link } from "react-router-dom"
import { useState } from "react"
import "./HomePage.css"

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="lp">

      {/* ── NAVBAR ── */}
      <div className="lp-nav-wrap">
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
              { label: "Home",     href: "#home"     },
              { label: "Layanan",  href: "#layanan"  },
              { label: "Paket",    href: "#paket"    },
              { label: "Coverage", href: "#coverage" },
              { label: "Kontak",   href: "#footer"   },
            ].map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>

          <div className="lp-nav-cta">
            <Link to="/login"    className="btn btn-ghost btn-sm">Masuk</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Daftar Sekarang</Link>
          </div>
        </nav>
      </div>

      {/* section lain menyusul */}

    </div>
  )
}