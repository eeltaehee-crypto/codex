import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';

const root = fileURLToPath(new URL('../', import.meta.url));
const result = await build({
  stdin: {
    contents: `import { createRoot } from 'react-dom/client';
      import Busafe from './components/busafe';
      createRoot(document.getElementById('root')).render(<Busafe />);`,
    loader: 'tsx',
    resolveDir: root,
    sourcefile: 'standalone-entry.tsx',
  },
  bundle: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
  tsconfig: path.join(root, 'tsconfig.json'),
  plugins: [{ name: 'inline-editorial-photos', setup(build) {
    build.onLoad({ filter: /lib[\\/]visuals\.ts$/ }, async () => {
      const studio = (await readFile(path.join(root, 'public/images/extinguisher-studio.webp'))).toString('base64');
      const bus = (await readFile(path.join(root, 'public/images/extinguisher-bus.webp'))).toString('base64');
      return { contents: `export const studioPhoto = 'data:image/webp;base64,${studio}'; export const busPhoto = 'data:image/webp;base64,${bus}';`, loader: 'js' };
    });
  }}],
});
// The app uses its own CSS classes; only Tailwind's reset is needed here.
const source = (await readFile(path.join(root, 'app/globals.css'), 'utf8'))
  .replace('@import "tailwindcss";', '@import "tailwindcss" source(none);') + '\n' + await readFile(path.join(root, 'app/photo-theme.css'), 'utf8');
const stylesheet = await postcss([tailwind({ base: root, optimize: true })])
  .process(source, { from: path.join(root, 'app/globals.css') });
const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#FFF4F1">
  <meta name="description" content="BUSAFE — 버스 기사님을 위한 간편한 소화기 점검과 안전 기록">
  <title>BUSAFE — 오늘도 안전하게</title>
  <style>${stylesheet.css.replaceAll('</style', '<\\/style')}</style>
</head>
<body>
  <div id="root"></div>
  <noscript>BUSAFE를 이용하려면 브라우저에서 JavaScript를 활성화해 주세요.</noscript>
  <script>${result.outputFiles[0].text.replaceAll('</script', '<\\/script')}</script>
</body>
</html>
`;
await writeFile(path.join(root, 'busafe.html'), html);
console.log(`Created busafe.html (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB). Open directly in a browser; no server required.`);
