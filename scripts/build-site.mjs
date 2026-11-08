import './build-html.mjs';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const publish = path.join(root, 'site');
await mkdir(publish, { recursive: true });
await copyFile(path.join(root, 'busafe.html'), path.join(publish, 'index.html'));
await writeFile(path.join(publish, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: no-cache
`);
const pages = path.join(root, 'docs');
await mkdir(pages, { recursive: true });
await copyFile(path.join(root, 'busafe.html'), path.join(pages, 'index.html'));
await writeFile(path.join(pages, '.nojekyll'), '');
console.log('Ready to publish: site/ for static hosting, docs/ for GitHub Pages');
