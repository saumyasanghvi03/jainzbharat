import { LegalPage } from '@/components/legal-page';

export const metadata = { title: 'Copyright' };

export default function CopyrightPage() {
  return (
    <LegalPage title="Copyright" subtitle="Intellectual property rights, user ownership, and DMCA notice." lastUpdated="July 5, 2026" version="1.0">
      <h2 id="user-ownership">User Ownership</h2>
      <p>Users retain full ownership of the content they create on JainZBharat, including discussions, event listings, organization profiles, club content, project descriptions, and other contributions.</p>
      <p>By submitting content, you grant JainZBharat a non-exclusive, worldwide, royalty-free license to host, display, and distribute your content on the platform for the purpose of operating and promoting JainZBharat.</p>

      <h2 id="platform-ip">Platform Intellectual Property</h2>
      <p>The JainZBharat name, logo, brand assets, platform design, and underlying software are the intellectual property of JainZBharat, unless otherwise noted. You may not use our trademarks without prior written permission.</p>

      <h2 id="open-source">Open Source Components</h2>
      <p>JainZBharat incorporates open-source software components. Each component is used under its respective license (MIT, Apache 2.0, BSD, etc.). Attribution and license information are maintained in our codebase.</p>

      <h2 id="copyright-infringement">Copyright Infringement</h2>
      <p>We respect the intellectual property rights of others. If you believe your copyrighted work has been reproduced on JainZBharat without authorization, please notify us with the following information:</p>
      <ul>
        <li>Identification of the copyrighted work claimed to be infringed</li>
        <li>Identification of the allegedly infringing material and its location on the platform</li>
        <li>Your contact information (name, address, email, phone)</li>
        <li>A statement that you have a good-faith belief that use is not authorized</li>
        <li>A statement, under penalty of perjury, that the information is accurate and you are the rights owner or authorized to act</li>
        <li>Your physical or electronic signature</li>
      </ul>

      <h2 id="dmca-notice">DMCA Notice</h2>
      <p>Our designated agent for copyright infringement notices can be reached at:</p>
      <p>Email: <a href="mailto:copyright@jainzbharat.org" className="text-primary hover:underline">copyright@jainzbharat.org</a></p>
      <p>We will process valid DMCA notices and take appropriate action, including removing infringing content and terminating repeat infringers&apos; accounts.</p>

      <h2 id="counter-notice">Counter-Notice</h2>
      <p>If you believe your content was removed due to a mistaken copyright claim, you may submit a counter-notice. We will review and restore content if the counter-notice is valid.</p>

      <h2 id="attribution">Attribution</h2>
      <p>When using or referencing others&rsquo; work, we expect users to provide proper attribution. Plagiarism is not permitted on the platform.</p>
    </LegalPage>
  );
}
