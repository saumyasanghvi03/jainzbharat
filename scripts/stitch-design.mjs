import { stitch } from '@google/stitch-sdk';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.STITCH_API_KEY;
const PROJECT_ID = process.env.STITCH_PROJECT_ID ?? '8547329911524445392';

if (!API_KEY) {
  console.error('Missing STITCH_API_KEY environment variable');
  process.exit(1);
}

const DESIGNS_DIR = join(__dirname, '..', 'designs');
mkdirSync(DESIGNS_DIR, { recursive: true });

async function downloadFile(url, filepath) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Download failed: ${resp.status}`);
  const buffer = await resp.arrayBuffer();
  writeFileSync(filepath, Buffer.from(buffer));
  console.log(`  → Saved ${filepath}`);
}

async function main() {
  console.log('Connecting to Stitch project:', PROJECT_ID);
  const project = stitch.project(PROJECT_ID);

  // Step 1: Read the declaration
  console.log('\nGenerating: Step 1 - Read the Declaration...');
  const readScreen = await project.generate(
    `A dark-themed declaration reading page for JainZBharat. Dark background (#080b12), glass-morphism cards with backdrop-blur, orange accent (#f97316), emerald (#10b981), amber (#f59e0b). Space Grotesk for headings, Inter for body.

     Layout: Two columns. Left column (wider) shows the declaration content. Right column is a sticky sidebar.

     Left column content:
     - "Sign Declaration" badge at top
     - H1: "Add your signature to the JainZBharat Declaration."
     - Subtitle about permanent record with JainZ ID
     - Glass card containing: "v1.0" badge, "Published July 4, 2026" date
     - "Preamble" section heading with paragraph about wisdom, innovation, compassion
     - "Our Principles" heading with 10 principle cards (each has a title like "Ahimsa (Compassion)" and description text) in a 2-column grid
     - "The JainZ Pledge" heading with italic text about choosing character over comfort
     - Large orange "Continue to Sign" button

     Right column (sticky sidebar):
     - Card titled "What happens when you sign?" with checkmark list items
     - Card showing user info (avatar initial, name, email) with glass effect

     Bottom: Progress indicator showing "Read" (active/orange) → "Sign" → "Done"`,
    'DESKTOP'
  );
  await downloadFile(await readScreen.getHtml(), join(DESIGNS_DIR, 'step1-read.html'));
  await downloadFile(await readScreen.getImage(), join(DESIGNS_DIR, 'step1-read.png'));
  console.log('  Done.');

  // Step 2: Sign the declaration
  console.log('\nGenerating: Step 2 - Fill Details & Sign...');
  const signScreen = await project.generate(
    `A dark-themed declaration signing page for JainZBharat. Dark background (#080b12), glass-morphism cards with backdrop-blur, orange accent (#f97316), emerald (#10b981).

     Two column layout. Left column: glass card with form. Right column: sticky sidebar.

     Left column:
     - "Your Details" heading
     - Subtitle about filling in details for public signing wall
     - User info box showing "Signed in as" with name
     - Form fields: Country (required), City (required), Profession (required), Organization (optional)
     - Each field has a label above and an input with dark glass styling
     - Orange "Sign Declaration" button and "Back" ghost button
     - Disclaimer text about agreeing to principles

     Right column (sticky):
     - Same sidebar as before

     Bottom: Progress indicator: "Read" (completed/emerald checkmark) → "Sign" (active/orange) → "Done"`,
    'DESKTOP'
  );
  await downloadFile(await signScreen.getHtml(), join(DESIGNS_DIR, 'step2-sign.html'));
  await downloadFile(await signScreen.getImage(), join(DESIGNS_DIR, 'step2-sign.png'));
  console.log('  Done.');

  console.log('\nAll designs generated in designs/');
}

main().catch(console.error);
