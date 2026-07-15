interface VerificationEmailProps {
  code: string;
  firstName: string;
}

export function getVerificationEmailHtml({ code, firstName }: VerificationEmailProps): string {
  // Split code into individual digits for styled display
  const digits = code.split("").map(
    (d) =>
      `<td style="width:44px;height:52px;background-color:#faf7f5;border:2px solid #d4a574;border-radius:8px;text-align:center;vertical-align:middle;font-family:'Courier New',monospace;font-size:28px;font-weight:700;color:#4a1c0d;letter-spacing:0;">${d}</td>`
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Verify Your Email — Abraham's Table</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0ed;font-family:'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f5f0ed;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(74,28,13,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4a1c0d 0%,#6b2a14 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-family:Georgia,serif;font-size:26px;letter-spacing:4px;font-weight:700;text-transform:uppercase;">Abraham's Table</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Email Verification</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 16px;">
              <h2 style="margin:0 0 12px;color:#4a1c0d;font-size:22px;font-weight:700;">Hi ${firstName},</h2>
              <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.7;">
                Thank you for creating an account! Please use the verification code below to confirm your email address. This code will expire in <strong style="color:#4a1c0d;">10 minutes</strong>.
              </p>

              <!-- OTP Code -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 28px;">
                <tr>
                  ${digits.join('<td style="width:8px;"></td>')}
                </tr>
              </table>

              <p style="margin:0 0 24px;color:#9ca3af;font-size:13px;text-align:center;line-height:1.5;">
                Enter this code on the verification page to complete your registration.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 20px;">

              <p style="margin:0;color:#d1d5db;font-size:12px;line-height:1.5;">
                If you didn't create an account with Abraham's Table, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;background-color:#faf7f5;border-top:1px solid #f3f4f6;">
              <p style="margin:0;color:#b0a090;font-size:11px;text-align:center;letter-spacing:0.5px;">
                &copy; ${new Date().getFullYear()} Abraham's Table. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
