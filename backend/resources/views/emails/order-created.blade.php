<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #0d9488; padding: 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; }
    .body { padding: 32px; }
    .body p { color: #444; line-height: 1.6; margin: 0 0 16px; }
    .card { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 16px; margin: 20px 0; }
    .card p { margin: 4px 0; color: #115e59; font-size: 14px; }
    .card strong { color: #0f766e; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Pesanan Diterima!</h1>
    </div>
    <div class="body">
      <p>Halo, <strong>{{ $order->user->name }}</strong>!</p>
      <p>Pesanan kamu telah kami terima dan sedang dalam proses review oleh tim kami. Kami akan segera menghubungi kamu untuk konfirmasi instalasi.</p>
      <div class="card">
        <p><strong>Detail Pesanan:</strong></p>
        <p>Paket: <strong>{{ $order->paket->nama }}</strong></p>
        <p>Kecepatan: <strong>{{ $order->paket->kecepatan }} Mbps</strong></p>
        <p>Total: <strong>Rp {{ number_format($order->total_harga, 0, ',', '.') }}</strong></p>
        <p>Alamat: <strong>{{ $order->alamat }}</strong></p>
        <p>Status: <strong>Menunggu Konfirmasi</strong></p>
      </div>
      <p>Terima kasih telah mempercayai layanan kami. 🙏</p>
    </div>
    <div class="footer">
      <p>© {{ date('Y') }} CV Citra Mandiri — Layanan Internet Terpercaya</p>
    </div>
  </div>
</body>
</html>
