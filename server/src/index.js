import mongoose from 'mongoose';
import { getConfig } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { createApp } from './app.js';
const config = getConfig();
await connectDatabase(config.mongoUri);
const server = createApp(config).listen(config.port, () =>
  console.log(`Image Fitness listening on ${config.port}`),
);
async function shutdown() {
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
