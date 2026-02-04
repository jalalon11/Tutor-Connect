<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify Your Email</title>
</head>

<body
    style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
        style="max-width: 600px; margin: 0 auto;">
        <tr>
            <td style="padding: 40px 20px;">
                <!-- Header -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <div
                                style="width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 16px; display: inline-block; text-align: center; line-height: 60px;">
                                <span style="font-size: 30px;">🎓</span>
                            </div>
                            <h1 style="margin: 20px 0 0 0; font-size: 24px; color: #1e293b;">TutorConnect</h1>
                        </td>
                    </tr>
                </table>

                <!-- Content Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                    style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #1e293b;">Hi {{ $name }}! 👋</h2>

                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                                Thank you for pre-registering with TutorConnect! Please verify your email address by
                                clicking the button below.
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="{{ $verificationUrl }}"
                                            style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; text-decoration: none; font-weight: 600; border-radius: 10px; font-size: 16px;">
                                            Verify My Email
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 20px 0 0 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 8px 0 0 0; font-size: 12px; color: #3b82f6; word-break: break-all;">
                                {{ $verificationUrl }}
                            </p>

                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

                            <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                                If you didn't request this, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td align="center" style="padding: 30px 20px;">
                            <p style="margin: 0; font-size: 14px; color: #94a3b8;">
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