<?php

namespace App\Mail;

use App\Models\PreRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountReadyMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public PreRegistration $preRegistration
    ) {
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your TutorConnect Account is Ready!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.account-ready',
        );
    }

    /**
     * Get the setup URL.
     */
    public function setupUrl(): string
    {
        return route('pre-register.setup', ['token' => $this->preRegistration->setup_token]);
    }
}
