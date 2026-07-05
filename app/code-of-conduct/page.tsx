import { LegalPage } from '@/components/legal-page';

export const metadata = { title: 'Code of Conduct' };

export default function CodeOfConductPage() {
  return (
    <LegalPage title="Code of Conduct" subtitle="Our shared values and ethical commitments as a community." lastUpdated="July 5, 2026" version="1.0">
      <h2 id="preamble">Preamble</h2>
      <p>JainZBharat is inspired by the core values of Jain philosophy: Ahimsa (non-violence), Satya (truth), Aparigraha (non-possession), Anekantavada (multiplicity of perspectives), and Tapasya (discipline). This Code of Conduct translates these values into actionable commitments for our digital community.</p>

      <h2 id="ahimsa">Ahimsa — Non-Violence</h2>
      <p>We commit to non-violence in thought, word, and action. This means:</p>
      <ul>
        <li>Engaging in discussions without personal attacks</li>
        <li>Respecting differing viewpoints and experiences</li>
        <li>Refraining from content that could cause harm</li>
        <li>Promoting peace and understanding</li>
      </ul>

      <h2 id="satya">Satya — Truth</h2>
      <p>We commit to truthfulness and integrity:</p>
      <ul>
        <li>Sharing accurate information and correcting errors</li>
        <li>Not impersonating others or misrepresenting affiliations</li>
        <li>Being transparent about conflicts of interest</li>
        <li>Acknowledging sources and giving credit</li>
      </ul>

      <h2 id="aparigraha">Aparigraha — Non-Possession</h2>
      <p>We commit to non-possessiveness and generosity:</p>
      <ul>
        <li>Sharing knowledge freely for the benefit of all</li>
        <li>Not hoarding credit or resources</li>
        <li>Respecting intellectual property while promoting openness</li>
        <li>Contributing without expectation of return</li>
      </ul>

      <h2 id="anekantavada">Anekantavada — Multiplicity of Perspectives</h2>
      <p>We commit to intellectual humility:</p>
      <ul>
        <li>Acknowledging that truth has many facets</li>
        <li>Listening to understand, not to反驳</li>
        <li>Creating space for diverse viewpoints</li>
        <li>Rejecting dogmatism and absolutism</li>
      </ul>

      <h2 id="tapasya">Tapasya — Discipline</h2>
      <p>We commit to disciplined engagement:</p>
      <ul>
        <li>Following platform guidelines and rules</li>
        <li>Contributing consistently and meaningfully</li>
        <li>Self-regulating and reflecting on our impact</li>
        <li>Supporting moderators and community leaders</li>
      </ul>

      <h2 id="seva">Seva — Service</h2>
      <p>We commit to selfless service:</p>
      <ul>
        <li>Helping others learn and grow</li>
        <li>Contributing to community well-being</li>
        <li>Volunteering skills and time</li>
        <li>Putting community needs above individual gain</li>
      </ul>

      <h2 id="scope">Scope and Enforcement</h2>
      <p>This Code of Conduct applies to all platform interactions, including discussions, messages, events, and community spaces. Violations are addressed through the moderation process outlined in our Community Guidelines.</p>

      <h2 id="commitment">Our Commitment</h2>
      <p>We hold ourselves to these standards and welcome feedback on how we can better embody them. This Code of Conduct is a living document that will evolve as we learn and grow together.</p>
    </LegalPage>
  );
}
