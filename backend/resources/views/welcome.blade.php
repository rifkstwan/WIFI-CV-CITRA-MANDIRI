@php
    $plans = [
        ['name' => 'Basic', 'speed' => '10 Mbps', 'price' => 'Rp 100.000', 'desc' => 'Untuk kebutuhan harian keluarga kecil.', 'popular' => false],
        ['name' => 'Regular', 'speed' => '20 Mbps', 'price' => 'Rp 150.000', 'desc' => 'Pilihan seimbang untuk streaming dan meeting.', 'popular' => true],
        ['name' => 'Business', 'speed' => '40 Mbps', 'price' => 'Rp 200.000', 'desc' => 'Koneksi stabil untuk toko dan kantor kecil.', 'popular' => false],
    ];

    $features = [
        ['title' => 'Koneksi Stabil', 'text' => 'Jaringan dirancang untuk penggunaan rutin dengan performa yang konsisten.'],
        ['title' => 'Instalasi Rapi', 'text' => 'Proses pemasangan dibuat jelas dari order sampai layanan aktif.'],
        ['title' => 'Support Cepat', 'text' => 'Tim siap membantu pelanggan saat membutuhkan pengecekan layanan.'],
    ];

    $comments = [
        ['name' => 'Andi Prasetyo', 'role' => 'Pemilik toko', 'text' => 'Internetnya stabil untuk kasir online dan komunikasi pelanggan. Proses pemasangan juga jelas.'],
        ['name' => 'Rina Wulandari', 'role' => 'Pelanggan rumah', 'text' => 'Streaming dan meeting lebih lancar. Paketnya mudah dipahami, tidak membingungkan.'],
        ['name' => 'Budi Santoso', 'role' => 'UMKM', 'text' => 'Pelayanan responsif dan informasi tagihan lebih transparan. Cocok untuk bisnis kecil.'],
    ];
@endphp

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CV. Citra Mandiri - Internet Rumah dan Bisnis</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1e40af;
            --accent: #14b8a6;
            --ink: #0f172a;
            --muted: #64748b;
            --line: #e2e8f0;
            --soft: #f8fafc;
            --white: #ffffff;
            --dark: #111827;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        * {
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            margin: 0;
            color: var(--ink);
            background: var(--white);
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        .container {
            width: min(1160px, calc(100% - 40px));
            margin: 0 auto;
        }

        .navbar {
            position: sticky;
            top: 0;
            z-index: 20;
            border-bottom: 1px solid rgba(226, 232, 240, 0.85);
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(18px);
        }

        .nav-inner {
            min-height: 84px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
        }

        .brand {
            display: inline-flex;
            align-items: center;
            gap: 13px;
            font-weight: 900;
        }

        .brand-mark {
            width: 46px;
            height: 46px;
            display: grid;
            place-items: center;
            border-radius: 8px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: var(--white);
            font-size: 14px;
            letter-spacing: 0;
            box-shadow: 0 16px 36px rgba(37, 99, 235, 0.2);
        }

        .brand span:last-child {
            display: grid;
            gap: 2px;
        }

        .brand small {
            color: var(--muted);
            font-size: 12px;
            font-weight: 700;
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 26px;
            color: #475569;
            font-size: 15px;
            font-weight: 800;
        }

        .nav-links a:hover {
            color: var(--primary);
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .btn {
            min-height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid transparent;
            border-radius: 8px;
            padding: 12px 18px;
            font-size: 15px;
            font-weight: 900;
            line-height: 1;
            transition: 180ms ease;
        }

        .btn:hover {
            transform: translateY(-1px);
        }

        .btn-primary {
            background: var(--primary);
            color: var(--white);
            box-shadow: 0 16px 34px rgba(37, 99, 235, 0.24);
        }

        .btn-primary:hover {
            background: var(--primary-dark);
        }

        .btn-outline {
            border-color: var(--line);
            background: var(--white);
            color: var(--ink);
        }

        .hero {
            position: relative;
            overflow: hidden;
            background:
                radial-gradient(circle at 84% 20%, rgba(20, 184, 166, 0.18), transparent 30%),
                linear-gradient(135deg, #eff6ff 0%, #ffffff 52%, #ecfeff 100%);
        }

        .hero::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(37, 99, 235, 0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(37, 99, 235, 0.06) 1px, transparent 1px);
            background-size: 42px 42px;
            mask-image: linear-gradient(180deg, #000 0%, transparent 82%);
        }

        .hero-inner {
            position: relative;
            min-height: 680px;
            display: grid;
            grid-template-columns: minmax(0, 1.02fr) minmax(360px, 0.98fr);
            align-items: center;
            gap: 56px;
            padding: 78px 0 92px;
        }

        .badge {
            width: fit-content;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: 1px solid #bfdbfe;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.82);
            color: var(--primary-dark);
            padding: 8px 13px;
            font-size: 13px;
            font-weight: 900;
        }

        .badge-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--accent);
            box-shadow: 0 0 0 5px rgba(20, 184, 166, 0.14);
        }

        h1, h2, h3, p {
            margin: 0;
        }

        .hero h1 {
            margin-top: 20px;
            max-width: 680px;
            color: var(--ink);
            font-size: clamp(42px, 6vw, 76px);
            line-height: 0.98;
            letter-spacing: -0.02em;
        }

        .hero p {
            max-width: 610px;
            margin-top: 22px;
            color: #475569;
            font-size: 18px;
            line-height: 1.7;
        }

        .hero-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 32px;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-top: 36px;
        }

        .stat {
            border: 1px solid rgba(226, 232, 240, 0.9);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.78);
            padding: 17px;
            box-shadow: 0 18px 44px rgba(15, 23, 42, 0.06);
        }

        .stat strong {
            display: block;
            color: var(--primary);
            font-size: 28px;
            line-height: 1;
        }

        .stat span {
            display: block;
            margin-top: 8px;
            color: var(--muted);
            font-size: 13px;
            font-weight: 800;
        }

        .network-card {
            position: relative;
            min-height: 500px;
            display: grid;
            place-items: center;
        }

        .device {
            position: relative;
            width: min(440px, 100%);
            border: 1px solid rgba(148, 163, 184, 0.24);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.76);
            padding: 22px;
            box-shadow: 0 34px 90px rgba(15, 23, 42, 0.14);
            backdrop-filter: blur(18px);
        }

        .device-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 22px;
            color: var(--muted);
            font-size: 13px;
            font-weight: 900;
        }

        .device-status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #059669;
        }

        .signal {
            height: 190px;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            align-items: end;
            gap: 12px;
            border-radius: 8px;
            background: #0f172a;
            padding: 22px;
        }

        .signal i {
            display: block;
            border-radius: 8px 8px 3px 3px;
            background: linear-gradient(180deg, #67e8f9, var(--primary));
            box-shadow: 0 0 28px rgba(37, 99, 235, 0.28);
        }

        .device-list {
            display: grid;
            gap: 10px;
            margin-top: 18px;
        }

        .device-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid var(--line);
            border-radius: 8px;
            padding: 13px;
            color: #334155;
            font-size: 14px;
            font-weight: 800;
        }

        .device-row strong {
            color: var(--ink);
        }

        .floating-note {
            position: absolute;
            right: 0;
            bottom: 42px;
            width: 210px;
            border: 1px solid rgba(37, 99, 235, 0.14);
            border-radius: 8px;
            background: var(--white);
            padding: 16px;
            box-shadow: 0 20px 48px rgba(15, 23, 42, 0.13);
        }

        .floating-note span {
            display: block;
            color: var(--muted);
            font-size: 12px;
            font-weight: 800;
        }

        .floating-note strong {
            display: block;
            margin-top: 6px;
            color: var(--ink);
            font-size: 22px;
        }

        .section {
            padding: 96px 0;
        }

        .section-soft {
            background: var(--soft);
        }

        .section-head {
            max-width: 720px;
            margin: 0 auto 42px;
            text-align: center;
        }

        .section-kicker {
            display: inline-flex;
            border-radius: 999px;
            background: #dbeafe;
            color: var(--primary-dark);
            padding: 8px 14px;
            font-size: 13px;
            font-weight: 900;
        }

        .section-head h2 {
            margin-top: 16px;
            color: var(--ink);
            font-size: clamp(30px, 4vw, 48px);
            line-height: 1.1;
            letter-spacing: -0.02em;
        }

        .section-head p {
            margin-top: 14px;
            color: var(--muted);
            font-size: 17px;
            line-height: 1.65;
        }

        .feature-grid,
        .plan-grid,
        .comment-grid {
            display: grid;
            gap: 18px;
        }

        .feature-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .feature-card,
        .plan-card,
        .comment-card {
            border: 1px solid var(--line);
            border-radius: 8px;
            background: var(--white);
            box-shadow: 0 18px 44px rgba(15, 23, 42, 0.06);
        }

        .feature-card {
            padding: 28px;
        }

        .feature-icon {
            width: 46px;
            height: 46px;
            display: grid;
            place-items: center;
            border-radius: 8px;
            background: #eff6ff;
            color: var(--primary);
            font-size: 20px;
            font-weight: 900;
        }

        .feature-card h3,
        .plan-card h3,
        .comment-card h3 {
            margin-top: 20px;
            color: var(--ink);
            font-size: 22px;
            line-height: 1.2;
        }

        .feature-card p,
        .comment-card p {
            margin-top: 10px;
            color: var(--muted);
            line-height: 1.65;
        }

        .plan-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            align-items: start;
        }

        .plan-card {
            position: relative;
            overflow: hidden;
            padding: 28px;
        }

        .plan-card.popular {
            border-color: rgba(37, 99, 235, 0.36);
            box-shadow: 0 28px 70px rgba(37, 99, 235, 0.14);
            transform: translateY(-10px);
        }

        .plan-badge {
            position: absolute;
            right: 18px;
            top: 18px;
            border-radius: 999px;
            background: #dcfce7;
            color: #166534;
            padding: 7px 10px;
            font-size: 11px;
            font-weight: 900;
        }

        .speed {
            width: fit-content;
            border-radius: 999px;
            background: #eff6ff;
            color: var(--primary);
            padding: 8px 11px;
            font-size: 13px;
            font-weight: 900;
        }

        .plan-card p {
            margin-top: 10px;
            color: var(--muted);
            line-height: 1.6;
        }

        .price {
            margin-top: 26px;
            padding-top: 22px;
            border-top: 1px solid var(--line);
        }

        .price strong {
            display: block;
            color: var(--ink);
            font-size: 32px;
            line-height: 1;
        }

        .price span {
            display: block;
            margin-top: 8px;
            color: var(--muted);
            font-size: 13px;
            font-weight: 800;
        }

        .plan-list {
            display: grid;
            gap: 10px;
            margin: 24px 0;
            color: #334155;
            font-size: 14px;
            font-weight: 800;
        }

        .plan-list li {
            display: flex;
            align-items: center;
            gap: 9px;
        }

        .check {
            width: 18px;
            height: 18px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: #dcfce7;
            color: #15803d;
            font-size: 12px;
            font-weight: 900;
        }

        .comment-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .comment-card {
            padding: 26px;
        }

        .quote-mark {
            color: var(--primary);
            font-size: 38px;
            font-weight: 900;
            line-height: 1;
        }

        .comment-author {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 22px;
        }

        .avatar {
            width: 42px;
            height: 42px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: var(--white);
            font-weight: 900;
        }

        .comment-author strong,
        .comment-author span {
            display: block;
        }

        .comment-author span {
            margin-top: 2px;
            color: var(--muted);
            font-size: 13px;
            font-weight: 700;
        }

        .cta {
            padding: 82px 0;
            background:
                linear-gradient(120deg, rgba(20, 184, 166, 0.16), transparent 42%),
                #0f172a;
            color: var(--white);
        }

        .cta-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
        }

        .cta h2 {
            max-width: 740px;
            font-size: clamp(30px, 4vw, 52px);
            line-height: 1.1;
            letter-spacing: -0.02em;
        }

        .cta p {
            max-width: 640px;
            margin-top: 14px;
            color: #cbd5e1;
            font-size: 17px;
            line-height: 1.65;
        }

        .footer {
            background: #0b1120;
            color: #cbd5e1;
            padding: 60px 0 28px;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr 0.8fr 1fr;
            gap: 34px;
        }

        .footer h3 {
            color: var(--white);
            font-size: 18px;
            margin-bottom: 14px;
        }

        .footer p,
        .footer li {
            color: #94a3b8;
            line-height: 1.7;
            font-size: 15px;
        }

        .footer ul {
            display: grid;
            gap: 10px;
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .footer a:hover {
            color: var(--white);
        }

        .footer-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            margin-top: 42px;
            padding-top: 24px;
            border-top: 1px solid rgba(148, 163, 184, 0.18);
            color: #94a3b8;
            font-size: 14px;
        }

        @media (max-width: 920px) {
            .nav-inner {
                align-items: flex-start;
                flex-direction: column;
                padding: 16px 0;
            }

            .nav-links {
                display: none;
            }

            .hero-inner,
            .feature-grid,
            .plan-grid,
            .comment-grid,
            .footer-grid {
                grid-template-columns: 1fr;
            }

            .hero-inner {
                min-height: auto;
                padding: 56px 0 72px;
            }

            .network-card {
                min-height: 430px;
            }

            .plan-card.popular {
                transform: none;
            }

            .cta-inner,
            .footer-bottom {
                align-items: flex-start;
                flex-direction: column;
            }
        }

        @media (max-width: 620px) {
            .container {
                width: min(100% - 28px, 1160px);
            }

            .brand small {
                display: none;
            }

            .nav-actions {
                width: 100%;
            }

            .nav-actions .btn {
                flex: 1;
            }

            .hero h1 {
                font-size: 40px;
            }

            .stats {
                grid-template-columns: 1fr;
            }

            .floating-note {
                position: static;
                width: 100%;
                margin-top: 14px;
            }

            .network-card {
                min-height: auto;
                display: block;
            }

            .section,
            .cta {
                padding: 68px 0;
            }
        }
    </style>
</head>
<body>
    <header class="navbar">
        <div class="container nav-inner">
            <a class="brand" href="#home" aria-label="CV. Citra Mandiri">
                <span class="brand-mark">CM</span>
                <span>
                    CV. Citra Mandiri
                    <small>Internet rumah dan bisnis</small>
                </span>
            </a>

            <nav class="nav-links" aria-label="Navigasi halaman">
                <a href="#paket">Paket</a>
                <a href="#keunggulan">Keunggulan</a>
                <a href="#komentar">Komentar</a>
                <a href="#kontak">Kontak</a>
            </nav>

            <div class="nav-actions">
                <a class="btn btn-outline" href="/login">Log in</a>
                <a class="btn btn-primary" href="/register">Daftar</a>
            </div>
        </div>
    </header>

    <main id="home">
        <section class="hero">
            <div class="container hero-inner">
                <div>
                    <span class="badge"><span class="badge-dot"></span> Internet stabil untuk Grobogan</span>
                    <h1>WiFi cepat, rapi, dan mudah dipantau.</h1>
                    <p>
                        CV. Citra Mandiri menyediakan layanan internet untuk rumah, kantor kecil,
                        dan bisnis lokal dengan paket yang jelas, proses order yang mudah, serta dukungan teknis responsif.
                    </p>

                    <div class="hero-actions">
                        <a class="btn btn-primary" href="#paket">Lihat Paket</a>
                        <a class="btn btn-outline" href="#kontak">Hubungi Kami</a>
                    </div>

                    <div class="stats" aria-label="Ringkasan layanan">
                        <div class="stat">
                            <strong>1000+</strong>
                            <span>Pelanggan terlayani</span>
                        </div>
                        <div class="stat">
                            <strong>99.9%</strong>
                            <span>Target uptime</span>
                        </div>
                        <div class="stat">
                            <strong>80 Mbps</strong>
                            <span>Paket tersedia</span>
                        </div>
                    </div>
                </div>

                <div class="network-card" aria-label="Preview monitoring jaringan">
                    <div class="device">
                        <div class="device-header">
                            <span>Network Dashboard</span>
                            <span class="device-status"><span class="badge-dot"></span> Online</span>
                        </div>

                        <div class="signal" aria-hidden="true">
                            <i style="height: 42%"></i>
                            <i style="height: 68%"></i>
                            <i style="height: 54%"></i>
                            <i style="height: 88%"></i>
                            <i style="height: 76%"></i>
                        </div>

                        <div class="device-list">
                            <div class="device-row">
                                <span>Order aktif</span>
                                <strong>24</strong>
                            </div>
                            <div class="device-row">
                                <span>Status jaringan</span>
                                <strong>Normal</strong>
                            </div>
                        </div>
                    </div>

                    <div class="floating-note">
                        <span>Average response</span>
                        <strong>&lt; 1 jam</strong>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" id="keunggulan">
            <div class="container">
                <div class="section-head">
                    <span class="section-kicker">Keunggulan</span>
                    <h2>Layanan dibuat sederhana, profesional, dan siap digunakan setiap hari.</h2>
                    <p>
                        Fokus kami adalah koneksi yang stabil, proses layanan yang jelas, dan pengalaman pelanggan yang nyaman.
                    </p>
                </div>

                <div class="feature-grid">
                    @foreach ($features as $index => $feature)
                        <article class="feature-card">
                            <div class="feature-icon">{{ $index + 1 }}</div>
                            <h3>{{ $feature['title'] }}</h3>
                            <p>{{ $feature['text'] }}</p>
                        </article>
                    @endforeach
                </div>
            </div>
        </section>

        <section class="section section-soft" id="paket">
            <div class="container">
                <div class="section-head">
                    <span class="section-kicker">Paket Internet</span>
                    <h2>Pilih paket sesuai kebutuhan koneksi Anda.</h2>
                    <p>
                        Paket dibuat ringkas agar pelanggan mudah membandingkan kecepatan, harga, dan manfaatnya.
                    </p>
                </div>

                <div class="plan-grid">
                    @foreach ($plans as $plan)
                        <article class="plan-card {{ $plan['popular'] ? 'popular' : '' }}">
                            @if ($plan['popular'])
                                <span class="plan-badge">Terpopuler</span>
                            @endif
                            <span class="speed">{{ $plan['speed'] }}</span>
                            <h3>Paket {{ $plan['name'] }}</h3>
                            <p>{{ $plan['desc'] }}</p>
                            <div class="price">
                                <strong>{{ $plan['price'] }}</strong>
                                <span>per bulan</span>
                            </div>
                            <ul class="plan-list">
                                <li><span class="check">✓</span> Kuota unlimited</li>
                                <li><span class="check">✓</span> Gratis konsultasi</li>
                                <li><span class="check">✓</span> Support teknis</li>
                            </ul>
                            <a class="btn btn-primary" href="/register" style="width: 100%;">Berlangganan</a>
                        </article>
                    @endforeach
                </div>
            </div>
        </section>

        <section class="section" id="komentar">
            <div class="container">
                <div class="section-head">
                    <span class="section-kicker">Komentar Pelanggan</span>
                    <h2>Dipercaya untuk kebutuhan rumah dan bisnis lokal.</h2>
                    <p>
                        Beberapa pengalaman pelanggan yang menggunakan layanan CV. Citra Mandiri.
                    </p>
                </div>

                <div class="comment-grid">
                    @foreach ($comments as $comment)
                        <article class="comment-card">
                            <div class="quote-mark">"</div>
                            <p>{{ $comment['text'] }}</p>
                            <div class="comment-author">
                                <div class="avatar">{{ substr($comment['name'], 0, 1) }}</div>
                                <div>
                                    <strong>{{ $comment['name'] }}</strong>
                                    <span>{{ $comment['role'] }}</span>
                                </div>
                            </div>
                        </article>
                    @endforeach
                </div>
            </div>
        </section>

        <section class="cta">
            <div class="container cta-inner">
                <div>
                    <h2>Siap memakai internet yang lebih stabil?</h2>
                    <p>
                        Konsultasikan kebutuhan koneksi Anda, pilih paket terbaik, dan mulai proses pemasangan dengan mudah.
                    </p>
                </div>
                <a class="btn btn-primary" href="/register">Daftar Sekarang</a>
            </div>
        </section>
    </main>

    <footer class="footer" id="kontak">
        <div class="container">
            <div class="footer-grid">
                <div>
                    <h3>CV. Citra Mandiri</h3>
                    <p>
                        Penyedia layanan internet untuk rumah, kantor kecil, dan bisnis lokal dengan proses yang simpel dan profesional.
                    </p>
                </div>
                <div>
                    <h3>Navigasi</h3>
                    <ul>
                        <li><a href="#keunggulan">Keunggulan</a></li>
                        <li><a href="#paket">Paket Internet</a></li>
                        <li><a href="#komentar">Komentar</a></li>
                    </ul>
                </div>
                <div>
                    <h3>Layanan</h3>
                    <ul>
                        <li>WiFi rumah</li>
                        <li>WiFi bisnis</li>
                        <li>Instalasi jaringan</li>
                    </ul>
                </div>
                <div>
                    <h3>Kontak</h3>
                    <ul>
                        <li>+62 812-2577-686</li>
                        <li>citramandiri@gmail.com</li>
                        <li>Tegowanu Wetan, Grobogan</li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <span>© 2026 CV. Citra Mandiri. All Rights Reserved.</span>
                <span>Internet rumah dan bisnis lokal.</span>
            </div>
        </div>
    </footer>
</body>
</html>
