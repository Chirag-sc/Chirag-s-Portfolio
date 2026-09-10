import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('dist/client');
// Always fail if Vinext silently skips the homepage during static export.
await access(path.join(output, 'index.html'));
if (process.env.GITHUB_PAGES === 'true') {
  const base = '/Chirag-s-Portfolio';
  // Vinext beta.5's prerenderer requests / even when basePath is set, which
  // skips the homepage. Keep routing at /, use Vite base for compiled assets,
  // and prefix the remaining framework-generated root asset URLs here.
  // This does not rewrite application content or move the asset directory.
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (/\.(html|rsc|json|js|css)$/.test(entry.name)) {
        const original = await readFile(file, 'utf8');
        const updated = original.replace(/(?<![\w/.-])\/_next\//g, `${base}/_next/`);
        if (updated !== original) await writeFile(file, updated);
      }
    }
  }
  await visit(output);
  await writeFile(path.join(output, '.nojekyll'), '');
  console.log(`Prepared GitHub Pages artifact: ${output} at ${base}/`);
}
