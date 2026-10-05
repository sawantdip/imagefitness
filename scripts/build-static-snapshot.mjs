import { mkdir, writeFile } from 'node:fs/promises';

const origin = new URL(process.env.BACKEND_ORIGIN || '').origin;
if (!origin.startsWith('https://')) throw new Error('BACKEND_ORIGIN must use HTTPS.');
async function download(path) {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(180000) });
  if (!response.ok) throw new Error(`Snapshot request failed: ${path} (${response.status})`);
  return response;
}
const content = await (await download('/api/content')).json();
if (!content?.name || !Array.isArray(content.services)) throw new Error('Invalid public content.');
await mkdir('client/public/site-images', { recursive: true });
const images = new Map();
async function snapshot(value) {
  if (typeof value === 'string' && /^\/api\/images\/[a-f0-9]{24}$/.test(value)) {
    if (!images.has(value)) {
      const localPath = `/site-images/${value.split('/').pop()}.webp`;
      const response = await download(value);
      if (!response.headers.get('content-type')?.startsWith('image/')) throw new Error('Invalid image response.');
      await writeFile(`client/public${localPath}`, Buffer.from(await response.arrayBuffer()));
      images.set(value, localPath);
    }
    return images.get(value);
  }
  if (Array.isArray(value)) {
    const result = [];
    for (const item of value) result.push(await snapshot(item));
    return result;
  }
  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, item] of Object.entries(value)) result[key] = await snapshot(item);
    return result;
  }
  return value;
}
await writeFile('client/.site-snapshot.json', JSON.stringify(await snapshot(content)));
console.log(`Public content snapshot ready (${images.size} uploaded photos).`);
