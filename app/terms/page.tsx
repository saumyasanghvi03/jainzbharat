import { LegalPage } from '@/components/legal-page';

export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" subtitle="The rules and guidelines for using JainZBharat." lastUpdated="July 5, 2026" version="1.0">
      <h2 id="acceptance">Acceptance of Terms</h2>
      <p>By accessing or using JainZBharat, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.</p>

      <h2 id="eligibility">Eligibility</h2>
      <p>You must be at least 13 years old to use JainZBharat. Users under 18 must have parental or guardian consent. By creating an account, you represent that you meet these requirements.</p>

      <h2 id="accounts">Accounts</h2>
      <p>You are responsible for maintaining the confidentiality of your authentication credentials. Authentication is provided by Clerk — we do not store passwords. You are responsible for all activity under your account.</p>

      <h2 id="community-contributions">Community Contributions</h2>
      <p>JainZBharat allows you to submit content including discussions, events, projects, organizations, clubs, and other contributions. You retain ownership of your content. By submitting content, you grant JainZBharat a worldwide, non-exclusive, royalty-free license to display and distribute your content on the platform.</p>
      <p>All contributions are subject to moderation before becoming public. We reserve the right to reject, remove, or archive any content that violates our policies.</p>

      <h2 id="acceptable-use">Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Violate any applicable law or regulation</li>
        <li>Impersonate any person or entity</li>
        <li>Submit false, misleading, or deceptive content</li>
        <li>Harass, abuse, or harm other users</li>
        <li>Upload malware, viruses, or harmful code</li>
        <li>Attempt to circumvent moderation or access controls</li>
        <li>Use the platform for unauthorized commercial purposes</li>
        <li>Collect user data without consent</li>
        <li>Engage in spam or unsolicited messaging</li>
      </ul>

      <h2 id="intellectual-property">Intellectual Property</h2>
      <p>The JainZBharat name, logo, and platform design are our intellectual property. The platform may incorporate open-source components under their respective licenses. You may not use our trademarks without prior written permission.</p>

      <h2 id="moderation">Moderation</h2>
      <p>JainZBharat maintains a moderation system to enforce community standards. Moderators and administrators may:</p>
      <ul>
        <li>Review, approve, reject, or remove content</li>
        <li>Issue warnings to users</li>
        <li>Temporarily or permanently suspend accounts</li>
        <li>Restrict access to specific features</li>
      </ul>
      <p>Moderation decisions may be appealed by contacting us.</p>

      <h2 id="termination">Termination</h2>
      <p>We may suspend or terminate your account for violation of these terms, at our discretion. You may delete your account at any time. Upon termination, your access ceases, and your personal data will be deleted per our Privacy Policy.</p>

      <h2 id="disclaimer">Disclaimer</h2>
      <p>JainZBharat is provided &quot;as is&quot; without warranties of any kind, express or implied. We do not guarantee uninterrupted or error-free operation. We are not responsible for the accuracy of user-generated content.</p>

      <h2 id="limitation">Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, JainZBharat shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.</p>

      <h2 id="indemnification">Indemnification</h2>
      <p>You agree to indemnify and hold JainZBharat harmless from claims arising from your use of the platform, your content, or your violation of these terms.</p>

      <h2 id="dispute-resolution">Dispute Resolution</h2>
      <p>Disputes shall be resolved through good-faith negotiations. If unresolved, disputes shall be settled in the courts of Mumbai, India. We may update this provision as the platform scales globally.</p>

      <h2 id="changes">Changes to Terms</h2>
      <p>We may revise these terms at any time. Material changes will be announced. Continued use after changes constitutes acceptance.</p>

      <h2 id="contact">Contact</h2>
      <p>For questions about these terms: <a href="mailto:legal@jainzbharat.org" className="text-primary hover:underline">legal@jainzbharat.org</a></p>
    </LegalPage>
  );
}
