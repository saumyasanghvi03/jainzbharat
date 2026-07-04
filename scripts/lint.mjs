import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const roots = ['app', 'components', 'lib', 'scripts', 'tests'];
const errors = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (entry === 'node_modules' || entry === '.next') continue;
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(ts|tsx|js|mjs)$/.test(entry)) {
      const text = readFileSync(path, 'utf8');
      if (text.includes('T' + 'ODO')) errors.push(`${path}: contains blocked marker`);
      if (/try\s*{\s*import/.test(text)) errors.push(`${path}: import inside try block`);
    }
  }
}
for (const root of roots) walk(root);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('lint passed');
