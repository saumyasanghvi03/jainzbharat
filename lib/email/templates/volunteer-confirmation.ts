export interface VolunteerConfirmationProps {
  displayName: string;
  hours: number;
  description: string;
}

export function volunteerConfirmationHtml(props: VolunteerConfirmationProps): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080b12;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#0e121a;border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
      <tr><td style="padding:40px;text-align:center;">
        <div style="font-size:36px;margin-bottom:16px;">🤝</div>
        <h1 style="color:#f2f2f2;font-size:24px;margin:0 0 8px;font-family:'Space Grotesk',system-ui,sans-serif;">Volunteer Hours Confirmed</h1>
        <p style="color:#8c8c8c;font-size:14px;line-height:1.6;margin:0 0 8px;"><strong style="color:#f2f2f2;">${props.hours}</strong> hours logged for <em style="color:#8c8c8c;">"${props.description}"</em></p>
        <p style="color:#555;font-size:13px;line-height:1.5;margin:0;">Thank you for your service. Every hour strengthens the community.</p>
      </td></tr>
      <tr><td style="padding:16px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
        <p style="color:#555;font-size:12px;margin:0;">JainZBharat — A global digital ecosystem bridging ancient wisdom with modern innovation.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}
