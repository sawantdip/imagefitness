import fs from 'node:fs/promises';
import path from 'node:path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { root, getConfig } from '../server/src/config/env.js';
import { createApp } from '../server/src/app.js';
import { connectDatabase } from '../server/src/config/database.js';
import mongoose from 'mongoose';

const dbPath = path.join(root, '.npm-cache', 'local-development-db');
await fs.mkdir(dbPath, { recursive: true });
const database = await MongoMemoryServer.create({
  binary: { downloadDir: path.join(root, '.npm-cache', 'mongodb'), version: '8.0.17' },
  instance: { dbPath, storageEngine: 'wiredTiger' },
});
process.env.MONGODB_URI = database.getUri('imagefitness_local');
process.env.NODE_ENV = 'development';
const config = getConfig();
await connectDatabase(config.mongoUri);
const server = createApp(config).listen(config.port, () => {
  console.log(`Local development API ready on http://localhost:${config.port}`);
  console.log('Storage: local MongoDB. Atlas is NOT connected. Admin credentials: root .env file.');
});
let stopping = false;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  await database.stop();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
