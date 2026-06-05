<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #16a34a; padding: 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; }
    .body { padding: 32px; }
    .body p { color: #444; line-height: 1.6; margin: 0 0 16px; }
    .card { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin: 20px 0; }
    .card p { margin: 4px 0; color: #166534; font-size: 14px; }
    .card strong { color: #15803d; }
    .badge { display: inline-block; background: #16a34a; color: #fff; padding: 6px 16px; border-radius: 99px; font-size: 13px; font-weight: bold; margin: 8px 0; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Paket Kamu Aktif!</h1>
    </div>
    <div class="body">
      <p>Halo, <strong>{{ $order->user->name }}</strong>!</p>
      <p>Selamat! Paket internet kamu sudah resmi <span class="badge">AKTIF</span></p>
      <p>Tim teknisi kami telah menyelesaikan instalasi. Kamu sudah bisa menikmati layanan internet dari CV Citra Mandiri.</p>
      <div class="card">
        <p><strong>Detail Langganan:</strong></p>
        <p>Paket: <strong>{{ $order->paket->nama }}</strong></p>
        <p>Kecepatan: <strong>{{ $order->paket->kecepatan }} Mbps</strong></p>
        <p>Aktif sejak: <strong>{{ $order->tanggal_mulai }}</strong></p>
        <p>Berlaku hingga: <strong>{{ $order->tanggal_selesai }}</strong></p>
      </div>
      <p>Jika ada kendala teknis, silakan hubungi tim support kami. 🚀</p>
    </div>
    <div class="footer">
      <p>© {{ date('Y') }} CV Citra Mandiri — Layanan Internet Terpercaya</p>
    </div>
  </div>
</body>
</html>
