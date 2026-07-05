import { LegalPage } from '@/components/legal-page';

export const metadata = { title: 'Security' };

export default function SecurityPage() {
  return (
    <LegalPage title="Security" subtitle="How JainZBharat protects your data and infrastructure." lastUpdated="July 5, 2026" version="1.0">
      <h2 id="overview">Security Overview</h2>
      <p>The security of your data is fundamental to JainZBharat. We employ industry-standard practices to protect information in transit, at rest, and during processing.</p>

      <h2 id="encryption">Encryption</h2>
      <p><strong>In Transit:</strong> All traffic to JainZBharat is encrypted using TLS (HTTPS). We enforce HSTS to prevent downgrade attacks.</p>
      <p><strong>At Rest:</strong> Database storage through Supabase uses encryption at rest. File uploads are encrypted in storage.</p>

      <h2 id="authentication">Authentication</h2>
      <p>Authentication is handled entirely by Clerk, a dedicated authentication provider. Clerk provides:</p>
      <ul>
        <li>Passwordless and password-based authentication</li>
        <li>OAuth integration (Google, GitHub, etc.)</li>
        <li>Session management with secure HTTP-only cookies</li>
        <li>Multi-factor authentication support</li>
        <li>Rate limiting and brute-force protection</li>
      </ul>
      <p>We never store or have access to your password.</p>

      <h2 id="database">Database Security</h2>
      <p>JainZBharat uses Supabase (PostgreSQL) as its primary database. Security measures include:</p>
      <ul>
        <li>Row-Level Security (RLS) policies on every table</li>
        <li>Service role key restricted to server-side usage</li>
        <li>No direct database access from client applications</li>
        <li>Automated backups</li>
      </ul>

      <h2 id="access-control">Access Control</h2>
      <p>Access control is implemented through:</p>
      <ul>
        <li><strong>Role-Based Access Control (RBAC):</strong> Users have roles (member, moderator, admin, super_admin) that determine permissions</li>
        <li><strong>Row-Level Security (RLS):</strong> Database policies restrict data access based on user identity and role</li>
        <li><strong>API Authentication:</strong> All API endpoints require authentication</li>
      </ul>

      <h2 id="infrastructure">Infrastructure</h2>
      <p>JainZBharat is deployed on Vercel (frontend) with Supabase (backend). Both providers maintain SOC 2 compliant infrastructure with robust security programs. We do not manage our own servers.</p>

      <h2 id="data-residency">Data Residency</h2>
      <p>JainZBharat is committed to prioritizing data residency in India. Our application infrastructure, databases, and storage are designed to be hosted and managed within India wherever technically feasible.</p>
      <p>User application data is hosted in India where supported by our infrastructure providers. Some operational metadata or authentication-related processing may occur in other regions through our trusted service providers.</p>

      <h3 id="infrastructure-details">Infrastructure Details</h3>
      <ul>
        <li><strong>Application Hosting:</strong> Vercel</li>
        <li><strong>Authentication:</strong> Clerk</li>
        <li><strong>Database:</strong> Supabase PostgreSQL</li>
        <li><strong>File Storage:</strong> Supabase Storage</li>
        <li><strong>Primary Data Residency:</strong> India (where supported and configured)</li>
        <li><strong>Encryption:</strong> TLS in transit, AES-256 at rest (provider-managed)</li>
        <li><strong>Backups:</strong> Encrypted</li>
        <li><strong>Access Control:</strong> Role-Based Access Control (RBAC)</li>
        <li><strong>Monitoring:</strong> Continuous</li>
      </ul>

      <p>As the platform grows, we will continue to evaluate and adopt infrastructure that best supports Indian data residency, security, reliability, and compliance.</p>

      <h2 id="monitoring">Monitoring and Rate Limiting</h2>
      <p>We implement:</p>
      <ul>
        <li>Rate limiting on API endpoints to prevent abuse</li>
        <li>CAPTCHA (Cloudflare Turnstile) on public forms</li>
        <li>Input validation and sanitization</li>
        <li>Secure file upload validation</li>
      </ul>

      <h2 id="incident-response">Incident Response</h2>
      <p>In the event of a security incident, we will:</p>
      <ul>
        <li>Investigate and contain the incident promptly</li>
        <li>Notify affected users if personal data is involved</li>
        <li>Document and implement preventive measures</li>
        <li>Report to relevant authorities if required</li>
      </ul>

      <h2 id="responsible-disclosure">Responsible Disclosure</h2>
      <p>If you discover a security vulnerability, please report it responsibly to <a href="mailto:security@jainzbharat.org" className="text-primary hover:underline">security@jainzbharat.org</a>. We request:</p>
      <ul>
        <li>Provide sufficient details to reproduce the issue</li>
        <li>Do not exploit the vulnerability beyond necessary testing</li>
        <li>Allow reasonable time for remediation before public disclosure</li>
        <li>Do not access or modify other users&apos; data</li>
      </ul>
      <p>We aim to acknowledge reports within 48 hours and provide regular updates on remediation progress.</p>

      <h2 id="contact">Security Contact</h2>
      <p>Report vulnerabilities: <a href="mailto:security@jainzbharat.org" className="text-primary hover:underline">security@jainzbharat.org</a></p>
      <p>For general security inquiries: <a href="mailto:support@jainzbharat.org" className="text-primary hover:underline">support@jainzbharat.org</a></p>
    </LegalPage>
  );
}
