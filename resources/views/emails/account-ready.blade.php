<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your Account is Ready!</title>
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
                            <!-- Launch Banner -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 28px;">
                                        <div
                                            style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 10px 28px; font-weight: 600; font-size: 14px; letter-spacing: 1px;">
                                            🚀 WE'RE LIVE!
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <h2
                                style="margin: 0 0 20px 0; font-size: 24px; color: #1e3a8a; text-align: center; font-weight: 600;">
                                Hi {{ $preRegistration->first_name }}, Your Account is Ready!
                            </h2>

                            <p
                                style="margin: 0 0 28px 0; font-size: 16px; color: #475569; line-height: 1.7; text-align: center;">
                                Great news! <strong style="color: #3b82f6;">TutorConnect</strong> has officially
                                launched,
                                and you're among the first to join! Click the button below to set up your
                                account and start your learning journey.
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 20px 0 32px 0;">
                                        <a href="{{ route('pre-register.setup', ['token' => $preRegistration->setup_token]) }}"
                                            style="display: inline-block; padding: 18px 52px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">
                                            Complete My Account Setup
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Steps Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                                style="background: #eff6ff; border-left: 4px solid #3b82f6;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <h3
                                            style="margin: 0 0 16px 0; font-size: 15px; color: #1e3a8a; font-weight: 600;">
                                            What you'll do next:
                                        </h3>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                                            width="100%">
                                            <tr>
                                                <td style="padding: 8px 0; font-size: 14px; color: #1e40af;">
                                                    <span
                                                        style="color: #3b82f6; font-weight: bold;">✓</span>&nbsp;&nbsp;Set
                                                    your password
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; font-size: 14px; color: #1e40af;">
                                                    <span
                                                        style="color: #3b82f6; font-weight: bold;">✓</span>&nbsp;&nbsp;Choose
                                                    your role (Student or Tutor)
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; font-size: 14px; color: #1e40af;">
                                                    <span
                                                        style="color: #3b82f6; font-weight: bold;">✓</span>&nbsp;&nbsp;Start
                                                    exploring TutorConnect!
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 28px 0 0 0; font-size: 13px; color: #94a3b8; line-height: 1.6;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 8px 0 0 0; font-size: 12px; color: #3b82f6; word-break: break-all;">
                                {{ route('pre-register.setup', ['token' => $preRegistration->setup_token]) }}
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