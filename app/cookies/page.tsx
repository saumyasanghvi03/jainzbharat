import { LegalPage } from '@/components/legal-page';

export const metadata = { title: 'Cookie Policy' };

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" subtitle="How JainZBharat uses cookies and similar technologies." lastUpdated="July 5, 2026" version="1.0">
      <h2 id="what-are-cookies">What Are Cookies</h2>
      <p>Cookies are small text files stored on your device by your web browser. They enable websites to remember your preferences, authenticate your session, and collect usage information.</p>

      <h2 id="cookies-we-use">Cookies We Use</h2>
      <h3 id="essential-cookies">Essential Cookies</h3>
      <p>These cookies are necessary for the platform to function. They enable authentication via Clerk, maintain your session, and remember your login state. Without these cookies, the platform cannot operate properly.</p>
      <ul>
        <li><strong>Clerk Session Cookie:</strong> Maintains your authenticated session</li>
        <li><strong>CSRF Token:</strong> Protects against cross-site request forgery</li>
        <li><strong>Client Preference:</strong> Remembers your theme preference (dark mode)</li>
      </ul>

      <h3 id="analytics-cookies">Analytics Cookies</h3>
      <p>We use Vercel Analytics and Speed Insights to understand how the platform is used. These tools use anonymized data and do not track individual users across websites.</p>
      <ul>
        <li><strong>Page view data:</strong> Pages visited, time on page, referrer</li>
        <li><strong>Performance data:</strong> Page load time, Core Web Vitals</li>
      </ul>

      <h3 id="third-party-cookies">Third-Party Services</h3>
      <p>We integrate with:</p>
      <ul>
        <li><strong>Clerk</strong> — Authentication cookies for session management</li>
        <li><strong>Vercel</strong> — Analytics and speed insights</li>
        <li><strong>Cloudflare</strong> — Turnstile CAPTCHA (may set cookies for bot detection)</li>
      </ul>

      <h2 id="cookie-management">Managing Cookies</h2>
      <p>You can control cookies through your browser settings. Disabling essential cookies may prevent the platform from functioning properly.</p>
      <p>To manage cookies in your browser:</p>
      <ul>
        <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
        <li><strong>Firefox:</strong> Options → Privacy &amp; Security → Cookies</li>
        <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
        <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
      </ul>

      <h2 id="updates">Updates to This Policy</h2>
      <p>We may update this Cookie Policy as our use of cookies evolves. Material changes will be communicated to users.</p>

      <h2 id="contact">Contact</h2>
      <p>For questions about cookies: <a href="mailto:privacy@jainzbharat.org" className="text-primary hover:underline">privacy@jainzbharat.org</a></p>
    </LegalPage>
  );
}
