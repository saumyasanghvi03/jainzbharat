export interface CertificateEmailProps {
  displayName: string;
  certificateTitle: string;
  verificationUrl: string;
}

export function certificateEmailHtml(props: CertificateEmailProps): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080b12;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#0e121a;border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
      <tr><td style="padding:40px;text-align:center;">
        <div style="font-size:36px;margin-bottom:16px;">🏅</div>
        <h1 style="color:#f2f2f2;font-size:24px;margin:0 0 8px;font-family:'Space Grotesk',system-ui,sans-serif;">Certificate Issued</h1>
        <p style="color:#8c8c8c;font-size:14px;line-height:1.6;margin:0 0 8px;">Your certificate <strong style="color:#f2f2f2;">"${props.certificateTitle}"</strong> is ready.</p>
        <p style="color:#8c8c8c;font-size:14px;line-height:1.6;margin:0 0 24px;">Verify at any time using the link below.</p>
        <a href="${props.verificationUrl}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 32px;border-radius:9999px;font-size:14px;font-weight:600;">Verify Certificate</a>
      </td></tr>
      <tr><td style="padding:16px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
        <p style="color:#555;font-size:12px;margin:0;">JainZBharat — A global digital ecosystem bridging ancient wisdom with modern innovation.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}
