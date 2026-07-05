import { LegalPage } from '@/components/legal-page';

export const metadata = { title: 'Community Guidelines' };

export default function CommunityGuidelinesPage() {
  return (
    <LegalPage title="Community Guidelines" subtitle="Expected behavior and community standards for JainZBharat." lastUpdated="July 5, 2026" version="1.0">
      <h2 id="our-commitment">Our Commitment</h2>
      <p>JainZBharat is built on the principles of Ahimsa (non-violence), Satya (truth), and Seva (service). These guidelines exist to ensure everyone can participate respectfully and safely.</p>

      <h2 id="expected-behavior">Expected Behavior</h2>
      <ul>
        <li><strong>Respect:</strong> Treat all members with dignity regardless of background, beliefs, or experience level</li>
        <li><strong>Kindness:</strong> Assume good faith and respond with compassion</li>
        <li><strong>Constructive Discussions:</strong> Disagree thoughtfully and focus on ideas, not individuals</li>
        <li><strong>Collaboration:</strong> Share knowledge openly and help others grow</li>
        <li><strong>Honesty:</strong> Provide accurate information and correct mistakes</li>
        <li><strong>Privacy:</strong> Respect others&rsquo; privacy and do not share personal information without consent</li>
        <li><strong>Inclusivity:</strong> Welcome diverse perspectives and create space for everyone</li>
      </ul>

      <h2 id="unacceptable-behavior">Unacceptable Behavior</h2>
      <p>The following are not permitted on JainZBharat:</p>
      <ul>
        <li>Hate speech, discrimination, or incitement of violence</li>
        <li>Harassment, bullying, stalking, or intimidation</li>
        <li>Spam, scams, phishing, or misleading content</li>
        <li>Impersonation of individuals or organizations</li>
        <li>Sharing explicit, violent, or illegal content</li>
        <li>Unauthorized commercial solicitation</li>
        <li>Circumventing moderation or platform restrictions</li>
        <li>Gaming the contribution or reputation system</li>
      </ul>

      <h2 id="enforcement">Enforcement</h2>
      <p>Violations of these guidelines may result in:</p>
      <ul>
        <li>Content removal or archiving</li>
        <li>Formal warning</li>
        <li>Temporary suspension</li>
        <li>Permanent account termination</li>
      </ul>
      <p>Enforcement actions are determined based on the severity and frequency of violations. Moderators and administrators apply these guidelines consistently and fairly.</p>

      <h2 id="reporting">Reporting Violations</h2>
      <p>If you encounter content or behavior that violates these guidelines:</p>
      <ul>
        <li>Use the report feature on posts, comments, and profiles</li>
        <li>Contact moderators via the platform</li>
        <li>Email <a href="mailto:moderation@jainzbharat.org" className="text-primary hover:underline">moderation@jainzbharat.org</a></li>
      </ul>
      <p>Reports are reviewed by our moderation team. You will receive confirmation when action is taken.</p>

      <h2 id="appeals">Appeals</h2>
      <p>If you believe a moderation decision was made in error, you may appeal by contacting <a href="mailto:appeals@jainzbharat.org" className="text-primary hover:underline">appeals@jainzbharat.org</a>. Appeals are reviewed by a different moderator to ensure fairness.</p>

      <h2 id="updates">Updates</h2>
      <p>These guidelines may be updated as the community evolves. Changes will be announced on the platform.</p>
    </LegalPage>
  );
}
