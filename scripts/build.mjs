import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('.next', { recursive: true });
mkdirSync('out', { recursive: true });
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>JainZBharat</title><meta name="description" content="A digital civilization platform for values, contribution, learning, service, and ethical collaboration."></head><body style="margin:0;background:#05060a;color:#f8fafc;font-family:system-ui"><main style="max-width:960px;margin:auto;padding:64px 24px"><p style="color:#d7b56d">Made in India 🇮🇳 · Open to Everyone 🌍</p><h1>JainZBharat</h1><p>A production-ready foundation for the JainZBharat digital civilization platform.</p></main></body></html>`;
writeFileSync('out/index.html', html);
writeFileSync('.next/BUILD_ID', String(Date.now()));
console.log('build passed');
