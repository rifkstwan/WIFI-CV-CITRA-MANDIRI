<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class WhatsAppService
{
    /**
     * Send a WhatsApp message using the configured API settings.
     */
    public static function sendMessage(string $phone, string $message): bool
    {
        Log::channel('single')->info('=== WHATSAPP MESSAGE TRIGGERED ===');
        Log::channel('single')->info('To: ' . $phone);
        Log::channel('single')->info('Message: ' . $message);
        
        $apiUrl = Setting::where('key', 'wa_api_url')->value('value');
        $apiKey = Setting::where('key', 'wa_api_key')->value('value');

        if (empty($apiUrl) || empty($apiKey)) {
            Log::channel('single')->warning('WhatsApp API URL or Key is not configured. Simulated logging only.');
            return false;
        }

        try {
            // Simulated API Call
            Log::channel('single')->info('Simulated sending via API ' . $apiUrl . ' with Token ' . substr($apiKey, 0, 5) . '***');
            return true;
        } catch (\Exception $e) {
            Log::channel('single')->error('Exception during WhatsApp sending: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send a welcome message to newly registered users.
     */
    public static function sendWelcomeMessage($user)
    {
        if (empty($user->phone)) return;

        $message = "Halo {$user->name}, selamat datang di layanan CV. Citra Mandiri!\n\n"
                 . "Akun Anda telah berhasil dibuat. Kami siap memberikan layanan WiFi terbaik untuk Anda.\n"
                 . "Silakan cek halaman dashboard untuk memilih paket langganan Anda.";

        self::sendMessage($user->phone, $message);
    }

    /**
     * Send an order confirmation to the user.
     */
    public static function sendOrderNotification($user, $order, $paket)
    {
        if (empty($user->phone)) return;

        $formattedPrice = "Rp " . number_format($paket->harga, 0, ',', '.');
        $message = "Halo {$user->name}, terima kasih telah melakukan pemesanan paket WiFi!\n\n"
                 . "Detail Pesanan:\n"
                 . "- Paket: {$paket->nama_paket}\n"
                 . "- Harga: {$formattedPrice}/bulan\n"
                 . "- Status: {$order->status}\n\n"
                 . "Pesanan Anda sedang kami proses. Teknisi kami akan segera menghubungi Anda untuk jadwal pemasangan.";

        self::sendMessage($user->phone, $message);
    }

    /**
     * Send a billing notification or receipt to the user.
     */
    public static function sendBillingNotification($user, $billing)
    {
        if (empty($user->phone)) return;

        $formattedTotal = "Rp " . number_format($billing->jumlah_tagihan, 0, ',', '.');
        
        if ($billing->status === 'paid') {
            $message = "Terima kasih {$user->name}!\n\n"
                     . "Pembayaran tagihan Anda sebesar {$formattedTotal} untuk periode " 
                     . \Carbon\Carbon::parse($billing->jatuh_tempo)->format('F Y') 
                     . " telah BERHASIL kami terima. Layanan WiFi Anda aktif seperti biasa.";
        } else {
            $message = "Halo {$user->name}, ini adalah pengingat tagihan WiFi Anda.\n\n"
                     . "Total Tagihan: {$formattedTotal}\n"
                     . "Jatuh Tempo: " . \Carbon\Carbon::parse($billing->jatuh_tempo)->format('d M Y') . "\n\n"
                     . "Mohon segera lakukan pembayaran sebelum tanggal jatuh tempo agar layanan tidak terputus. Abaikan pesan ini jika Anda sudah membayar.";
        }

        self::sendMessage($user->phone, $message);
    }

    /**
     * Send a ticket status update to the user.
     */
    public static function sendTicketUpdateNotification($user, $ticket)
    {
        if (empty($user->phone)) return;

        $statusIndo = match($ticket->status) {
            'menunggu' => 'Sedang Menunggu Teknisi',
            'diproses' => 'Sedang Dikerjakan Teknisi',
            'selesai' => 'Selesai Diperbaiki',
            default => ucfirst($ticket->status)
        };

        $message = "Halo {$user->name},\n\n"
                 . "Terdapat pembaruan pada tiket pengaduan Anda (Tiket ID: #{$ticket->id}):\n"
                 . "Status Saat Ini: *{$statusIndo}*\n\n";
                 
        if ($ticket->status === 'selesai') {
            $message .= "Gangguan jaringan Anda telah berhasil kami perbaiki. Terima kasih atas kesabarannya!";
        } else {
            $message .= "Tim kami sedang berusaha menangani kendala Anda secepat mungkin.";
        }

        self::sendMessage($user->phone, $message);
    }
}
