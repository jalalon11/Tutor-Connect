<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify Your Email</title>
</head>

<body
    style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4ff;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
        style="max-width: 600px; margin: 0 auto;">
        <tr>
            <td style="padding: 40px 20px;">
                <!-- Header -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <div
                                style="width: 70px; height: 70px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: inline-block; text-align: center; line-height: 70px;">
                                <span style="font-size: 35px;">🎓</span>
                            </div>
                            <h1 style="margin: 20px 0 0 0; font-size: 28px; color: #1e3a8a; font-weight: 700;">
                                TutorConnect</h1>
                        </td>
                    </tr>
                </table>

                <!-- Content Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                    style="background: white; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15); border-top: 4px solid #3b82f6;">
                    <tr>
                        <td style="padding: 48px 40px;">
                            <h2 style="margin: 0 0 24px 0; font-size: 22px; color: #1e3a8a; font-weight: 600;">
                                Hi {{ $name }}! 👋
                            </h2>

                            <p style="margin: 0 0 24px 0; font-size: 16px; color: #475569; line-height: 1.7;">
                                Thank you for pre-registering with <strong
                                    style="color: #3b82f6;">TutorConnect</strong>!
                                We're excited to have you join our learning community. Please verify your email
                                address by clicking the button below.
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 24px 0 32px 0;">
                                        <a href="{{ $verificationUrl }}"
                                            style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">
                                            Verify My Email
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Info Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                                style="background: #eff6ff; border-left: 4px solid #3b82f6;">
                                <tr>
                                    <td style="padding: 16px 20px;">
                                        <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.6;">
                                            <strong>What happens next?</strong><br>
                                            After verification, you'll be on our early access list. We'll notify you
                                            when TutorConnect launches so you can complete your account setup.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 28px 0 0 0; font-size: 13px; color: #94a3b8; line-height: 1.6;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 8px 0 0 0; font-size: 12px; color: #3b82f6; word-break: break-all;">
                                {{ $verificationUrl }}
                            </p>

                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">

                            <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.6;">
                                If you didn't request this, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td align="center" style="padding: 32px 20px;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; font-weight: 500;">
                                TutorConnect
                            </p>
                            <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                                © {{ date('Y') }} TutorConnect. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>