<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { padding: 32px; text-align: center; }
    .header.approved { background: #10b981; }
    .header.rejected { background: #ef4444; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; }
    .body { padding: 32px; }
    .body p { color: #444; line-height: 1.6; margin: 0 0 16px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; }
    .card p { margin: 4px 0; color: #334155; font-size: 14px; }
    .card strong { color: #0f172a; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header {{ $upgradeRequest->status === 'approved' ? 'approved' : 'rejected' }}">
      <h1>
        @if($upgradeRequest->status === 'approved')
          ✅ Upgrade Disetujui
        @else
          ❌ Upgrade Ditolak
        @endif
      </h1>
    </div>
    <div class="body">
      <p>Halo, <strong>{{ $upgradeRequest->user->name }}</strong>!</p>
      
      @if($upgradeRequest->status === 'approved')
        <p>Kabar baik! Permintaan upgrade/mutasi paket internet Anda telah <strong>Disetujui</strong>.</p>
        <p>Mulai sekarang Anda sudah dapat menikmati kecepatan internet baru dari layanan kami.</p>
      @else
        <p>Mohon maaf, permintaan upgrade/mutasi paket internet Anda telah <strong>Ditolak</strong> oleh Admin kami.</p>
      @endif

      <div class="card">
        <p><strong>Detail Permintaan:</strong></p>
        <p>Paket Tujuan: <strong>{{ $upgradeRequest->newPaket->nama }} ({{ $upgradeRequest->newPaket->kecepatan }} Mbps)</strong></p>
        <p>Status: <strong style="color: {{ $upgradeRequest->status === 'approved' ? '#10b981' : '#ef4444' }}">{{ strtoupper($upgradeRequest->status) }}</strong></p>
        @if($upgradeRequest->admin_catatan)
        <p>Catatan Admin: <strong>{{ $upgradeRequest->admin_catatan }}</strong></p>
        @endif
      </div>

      <p>Terima kasih telah mempercayai layanan kami. 🙏</p>
    </div>
    <div class="footer">
      <p>© {{ date('Y') }} CV Citra Mandiri — Layanan Internet Terpercaya</p>
    </div>
  </div>
</body>
</html>
