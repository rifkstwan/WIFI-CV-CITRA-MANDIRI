<?php

namespace App\Mail;

use App\Models\UpgradeRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UpgradeRequestedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public UpgradeRequest $upgradeRequest) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '🚀 Permintaan Upgrade Paket Diterima');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.upgrade-requested');
    }
}
