export interface WelcomeEmailProps {
  displayName: string;
  jainzId: string;
}

export function welcomeEmailHtml(props: WelcomeEmailProps): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080b12;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#0e121a;border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
      <tr><td style="padding:40px;text-align:center;">
        <div style="font-size:36px;margin-bottom:16px;">🕊</div>
        <h1 style="color:#f2f2f2;font-size:24px;margin:0 0 8px;font-family:'Space Grotesk',system-ui,sans-serif;">Welcome to JainZBharat</h1>
        <p style="color:#8c8c8c;font-size:14px;line-height:1.6;margin:0 0 24px;">Hello <strong style="color:#f2f2f2;">${props.displayName}</strong>, your permanent digital identity has been created.</p>
        <table style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;width:100%;margin-bottom:24px;">
          <tr><td style="text-align:center;">
            <div style="color:#8c8c8c;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Your JainZ ID</div>
            <div style="color:#f97316;font-size:28px;font-weight:700;font-family:monospace;">${props.jainzId}</div>
          </td></tr>
        </table>
        <p style="color:#8c8c8c;font-size:13px;line-height:1.5;margin:0;">Sign the Founding Declaration to earn your first badge and join the signing wall.</p>
      </td></tr>
      <tr><td style="padding:16px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
        <p style="color:#555;font-size:12px;margin:0;">JainZBharat — A global digital ecosystem bridging ancient wisdom with modern innovation.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}
