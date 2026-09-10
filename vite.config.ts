import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// This portfolio exports static HTML and assets; no Worker or backend is needed.
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/Chirag-s-Portfolio/' : '/',
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [vinext()],
  server: { host: 'localhost', port: 3000 },
});
