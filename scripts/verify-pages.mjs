import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist/client');
const base = '/Chirag-s-Portfolio/';
const checked = new Set();
async function verify(url, source) {
  if (!url || /^(?:https?:|data:|mailto:|tel:|#|\/\/)/.test(url)) return;
  const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
  assert(!pathname.startsWith('/') || pathname.startsWith(base), `Unprefixed URL in ${source}: ${url}`);
  const target = pathname.startsWith(base)
    ? path.join(root, pathname.slice(base.length))
    : path.resolve(path.dirname(source), pathname);
  assert(target.startsWith(root + path.sep) || target === root, `Asset escapes artifact: ${url}`);
  assert((await stat(target)).isFile(), `Missing asset: ${url}`);
  checked.add(target);
}
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await scan(file);
    else if (/\.(html|css)$/.test(entry.name)) {
      const content = await readFile(file, 'utf8');
      const expressions = entry.name.endsWith('.html')
        ? [/(?:src|href)="([^"]+)"/g]
        : [/url\(["']?([^\s)'";]+)["']?\)/g];
      for (const expression of expressions) {
        for (const match of content.matchAll(expression)) await verify(match[1], file);
      }
    }
  }
}
const html = await readFile(path.join(root, 'index.html'), 'utf8');
assert(html.includes('BLACK HOLE AI') && html.includes('CHIRAG'), 'Portfolio homepage missing');
await stat(path.join(root, '.nojekyll'));
await scan(root);
// Check every public asset, including lazy-loaded certificate pages and PDFs.
async function checkPublic(directory, relative = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) await checkPublic(path.join(directory, entry.name), name);
    else {
      const source = await readFile(path.join(directory, entry.name));
      const deployed = await readFile(path.join(root, name));
      assert(source.equals(deployed), `Public asset changed or missing: ${name}`);
    }
  }
}
await checkPublic(path.resolve('public'));
console.log(`Pages artifact verified: homepage, ${checked.size} referenced assets, and all public files.`);
