import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
const snapshot = process.env.STATIC_SNAPSHOT === '1'
  ? readFileSync(new URL('./.site-snapshot.json', import.meta.url), 'utf8')
  : 'null';
export default defineConfig({
  plugins: [react()],
  define: { __SITE_SNAPSHOT__: snapshot },
  server: { proxy: { '/api': 'http://localhost:5000', '/uploads': 'http://localhost:5000' } },
});
