<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #dc2626; padding: 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; }
    .body { padding: 32px; }
    .body p { color: #444; line-height: 1.6; margin: 0 0 16px; }
    .card { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 20px 0; }
    .card p { margin: 4px 0; color: #991b1b; font-size: 14px; }
    .card strong { color: #b91c1c; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>❌ Pesanan Ditolak</h1>
    </div>
    <div class="body">
      <p>Halo, <strong>{{ $order->user->name }}</strong>!</p>
      <p>Mohon maaf, pesanan kamu tidak dapat kami proses saat ini. Hal ini mungkin disebabkan oleh keterbatasan jangkauan jaringan di area kamu atau kendala teknis lainnya.</p>
      <div class="card">
        <p><strong>Detail Pesanan:</strong></p>
        <p>Paket: <strong>{{ $order->paket->nama }}</strong></p>
        <p>Alamat: <strong>{{ $order->alamat }}</strong></p>
        <p>Status: <strong>Ditolak</strong></p>
      </div>
      <p>Silakan hubungi tim kami untuk informasi lebih lanjut atau coba pesan kembali dengan alamat berbeda.</p>
    </div>
    <div class="footer">
      <p>© {{ date('Y') }} CV Citra Mandiri — Layanan Internet Terpercaya</p>
    </div>
  </div>
</body>
</html>
