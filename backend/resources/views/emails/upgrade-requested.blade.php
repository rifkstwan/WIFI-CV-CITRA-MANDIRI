<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #3b82f6; padding: 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; }
    .body { padding: 32px; }
    .body p { color: #444; line-height: 1.6; margin: 0 0 16px; }
    .card { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0; }
    .card p { margin: 4px 0; color: #1e3a8a; font-size: 14px; }
    .card strong { color: #1d4ed8; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Permintaan Upgrade Diterima!</h1>
    </div>
    <div class="body">
      <p>Halo, <strong>{{ $upgradeRequest->user->name }}</strong>!</p>
      <p>Permintaan Anda untuk melakukan Upgrade/Mutasi Paket Internet telah kami terima dan sedang dalam proses peninjauan oleh tim kami.</p>
      <div class="card">
        <p><strong>Detail Upgrade:</strong></p>
        <p>Paket Lama: <strong>{{ $upgradeRequest->oldPaket->nama }} ({{ $upgradeRequest->oldPaket->kecepatan }} Mbps)</strong></p>
        <p>Paket Baru: <strong>{{ $upgradeRequest->newPaket->nama }} ({{ $upgradeRequest->newPaket->kecepatan }} Mbps)</strong></p>
        <p>Harga Paket Baru: <strong>Rp {{ number_format($upgradeRequest->newPaket->harga, 0, ',', '.') }}</strong></p>
        <p>Status: <strong>Menunggu Konfirmasi Admin</strong></p>
      </div>
      <p>Kami akan segera memberitahu Anda kembali melalui email jika permintaan upgrade ini telah disetujui. 🙏</p>
    </div>
    <div class="footer">
      <p>© {{ date('Y') }} CV Citra Mandiri — Layanan Internet Terpercaya</p>
    </div>
  </div>
</body>
</html>
