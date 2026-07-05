import { LegalPage } from '@/components/legal-page';

export const metadata = { title: 'Content Policy' };

export default function ContentPolicyPage() {
  return (
    <LegalPage title="Content Policy" subtitle="How content is moderated, reported, and managed on JainZBharat." lastUpdated="July 5, 2026" version="1.0">
      <h2 id="overview">Overview</h2>
      <p>JainZBharat is an open community platform where users can contribute content across discussions, events, organizations, clubs, projects, and more. This policy explains how content is managed to maintain quality, safety, and fairness.</p>

      <h2 id="submission-workflow">Submission Workflow</h2>
      <p>Most user contributions follow this workflow:</p>
      <ul>
        <li><strong>Draft:</strong> Creator works on content privately</li>
        <li><strong>Submitted:</strong> Content is sent for review</li>
        <li><strong>Pending Review:</strong> Moderators evaluate the content</li>
        <li><strong>Approved:</strong> Content passes review and becomes visible</li>
        <li><strong>Published:</strong> Content is live and accessible</li>
        <li><strong>Rejected:</strong> Content does not meet standards</li>
      </ul>
      <p>Nothing becomes public without moderation approval, except discussions and chat messages which are governed by real-time moderation.</p>

      <h2 id="moderation-principles">Moderation Principles</h2>
      <ul>
        <li><strong>Transparency:</strong> Moderators explain decisions when appropriate</li>
        <li><strong>Consistency:</strong> Similar violations receive similar responses</li>
        <li><strong>Proportionality:</strong> Responses match the severity of violations</li>
        <li><strong>Appealability:</strong> All decisions can be appealed</li>
        <li><strong>Privacy:</strong> Moderation actions are not publicly discussed</li>
      </ul>

      <h2 id="what-is-not-allowed">What Is Not Allowed</h2>
      <p>The following content is prohibited:</p>
      <ul>
        <li>Illegal content or activity</li>
        <li>Hate speech, harassment, or threats</li>
        <li>Explicit or violent content</li>
        <li>Misinformation or deliberately false content</li>
        <li>Spam, scams, or fraudulent content</li>
        <li>Impersonation or identity deception</li>
        <li>Copyright-infringing material</li>
        <li>Content promoting self-harm or violence</li>
      </ul>

      <h2 id="reporting">Reporting Content</h2>
      <p>Users can report content that violates this policy using the report feature available on posts, comments, profiles, and community pages. Reports enter a moderation queue for review.</p>

      <h2 id="ai-generated-content">AI-Generated Content</h2>
      <p>AI-generated content is permitted but must be clearly labeled. We may implement AI-assisted moderation to detect spam, duplicates, and policy violations. AI flags are always reviewed by human moderators before action is taken.</p>

      <h2 id="appeals">Appeals</h2>
      <p>Content creators can appeal moderation decisions by contacting <a href="mailto:appeals@jainzbharat.org" className="text-primary hover:underline">appeals@jainzbharat.org</a>. Appeals should include the content details and reason for the appeal.</p>

      <h2 id="contact">Contact</h2>
      <p>For content policy questions: <a href="mailto:moderation@jainzbharat.org" className="text-primary hover:underline">moderation@jainzbharat.org</a></p>
    </LegalPage>
  );
}
