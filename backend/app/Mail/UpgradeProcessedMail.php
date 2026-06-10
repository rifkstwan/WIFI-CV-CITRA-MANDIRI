<?php

namespace App\Mail;

use App\Models\UpgradeRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UpgradeProcessedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public UpgradeRequest $upgradeRequest) {}

    public function envelope(): Envelope
    {
        $subject = $this->upgradeRequest->status === 'approved' 
            ? '✅ Permintaan Upgrade Paket Disetujui' 
            : '❌ Permintaan Upgrade Paket Ditolak';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.upgrade-processed');
    }
}
