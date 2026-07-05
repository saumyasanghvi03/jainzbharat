import { LegalPage } from '@/components/legal-page';

export const metadata = { title: 'Refund Policy' };

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" subtitle="Information about refunds for paid services (future-ready)." lastUpdated="July 5, 2026" version="1.0">
      <h2 id="current-status">Current Status</h2>
      <p>JainZBharat is currently a free platform. There are no paid services, subscriptions, or transactions that would require refunds at this time.</p>
      <p>This page serves as a placeholder for future refund policies that will be implemented when paid features (such as premium memberships, event ticketing, or marketplace transactions) are introduced.</p>

      <h2 id="future-policy">Future Policy</h2>
      <p>When paid features are launched, this page will be updated with a comprehensive refund policy covering:</p>
      <ul>
        <li>Eligibility for refunds</li>
        <li>Timeframes for requesting refunds</li>
        <li>Process for submitting refund requests</li>
        <li>Exceptions and non-refundable items</li>
        <li>Processing times</li>
        <li>Dispute resolution</li>
      </ul>

      <h2 id="contact">Contact</h2>
      <p>If you have questions about potential future paid features or want to provide input on refund policy design, please contact us at <a href="mailto:support@jainzbharat.org" className="text-primary hover:underline">support@jainzbharat.org</a>.</p>
    </LegalPage>
  );
}
