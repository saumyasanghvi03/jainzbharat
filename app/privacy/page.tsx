import { LegalPage } from '@/components/legal-page';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" subtitle="How JainZBharat collects, uses, and protects your personal data." lastUpdated="July 5, 2026" version="1.0">
      <h2 id="introduction">Introduction</h2>
      <p>JainZBharat (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
      <p>By using JainZBharat, you consent to the practices described in this policy. If you do not agree, please do not use the platform.</p>

      <h2 id="information-we-collect">Information We Collect</h2>
      <h3 id="account-information">Account Information</h3>
      <p>When you create an account via Clerk authentication, we receive your email address, name, and authentication identifiers. We do not store your password — authentication is handled entirely by Clerk.</p>
      <h3 id="profile-information">Profile Information</h3>
      <p>You may optionally provide your display name, bio, country, city, profession, company, languages, skills, and links. This information is stored in our Supabase database and is visible to other users as you configure.</p>
      <h3 id="community-contributions">Community Contributions</h3>
      <p>Content you create — including declaration signatures, discussion posts, chat messages, club memberships, event registrations, and project contributions — is stored and associated with your profile.</p>
      <h3 id="cookies">Cookies</h3>
      <p>We use essential cookies for authentication (via Clerk) and optional analytics cookies (via Vercel Analytics). See our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a> for details.</p>
      <h3 id="usage-data">Usage Data</h3>
      <p>We collect basic analytics including page views and navigation patterns through Vercel Speed Insights and Analytics. This data is anonymized and cannot be used to identify you personally.</p>

      <h2 id="how-we-use-data">How We Use Your Data</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Provide, maintain, and improve the platform</li>
        <li>Authenticate your identity and authorize your actions</li>
        <li>Display your profile and contributions to the community</li>
        <li>Send notifications about platform activity (with your consent)</li>
        <li>Generate aggregate statistics (e.g., total signatories, countries represented)</li>
        <li>Detect and prevent abuse, spam, or policy violations</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 id="data-storage">Data Storage and Retention</h2>
      <p>Your data is stored on Supabase-managed PostgreSQL servers. We retain your data for as long as your account is active. When you delete your account, your personal data is removed, though anonymized contributions (e.g., aggregate counts) may be retained.</p>

      <h2 id="your-rights">Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul>
        <li><strong>Access</strong> — Request a copy of your personal data</li>
        <li><strong>Rectification</strong> — Correct inaccurate data</li>
        <li><strong>Deletion</strong> — Request deletion of your data</li>
        <li><strong>Portability</strong> — Export your data in a machine-readable format</li>
        <li><strong>Objection</strong> — Object to certain processing activities</li>
      </ul>
      <p>To exercise any of these rights, contact us at <a href="mailto:privacy@jainzbharat.org" className="text-primary hover:underline">privacy@jainzbharat.org</a>.</p>

      <h2 id="gdpr">GDPR Compliance (European Users)</h2>
      <p>For users in the European Economic Area, we process personal data under the lawful bases of consent, contract performance, and legitimate interests. We aim to comply with the General Data Protection Regulation (GDPR) and will update this policy as our compliance program matures.</p>

      <h2 id="ccpa">CCPA (California Residents)</h2>
      <p>California residents may have additional rights under the California Consumer Privacy Act (CCPA). We currently support data access and deletion requests. Full CCPA compliance tooling is planned for future releases.</p>

      <h2 id="children">Children&rsquo;s Privacy</h2>
      <p>JainZBharat is not intended for children under 13. We do not knowingly collect data from children. If you believe a child has provided us with personal data, please contact us immediately.</p>

      <h2 id="international">International Users</h2>
      <p>Your data may be transferred to and processed in countries where our infrastructure providers operate. By using the platform, you consent to such transfers.</p>

      <h2 id="changes">Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. Material changes will be announced via the platform. Continued use after changes constitutes acceptance of the updated policy.</p>

      <h2 id="contact">Contact</h2>
      <p>For privacy-related inquiries: <a href="mailto:privacy@jainzbharat.org" className="text-primary hover:underline">privacy@jainzbharat.org</a></p>
      <p>For general inquiries, visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
    </LegalPage>
  );
}
