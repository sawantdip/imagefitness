import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
dotenv.config({ path: path.join(root, '.env') });
dotenv.config({ path: path.join(root, 'server/.env') });
export function getConfig() {
  const production = process.env.NODE_ENV === 'production';
  const config = {
    production,
    mongoUri: process.env.MONGODB_URI,
    secret: process.env.JWT_SECRET,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    origin: process.env.APP_ORIGIN,
    port: Number(process.env.PORT || 5000),
  };
  if (
    !config.mongoUri ||
    !config.secret ||
    config.secret.length < 32 ||
    !config.email ||
    !config.password ||
    config.password.length < 12
  )
    throw new Error(
      'Configure MONGODB_URI, JWT_SECRET (32+ characters), ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters).',
    );
  if (production && (!config.origin || !config.origin.startsWith('https://')))
    throw new Error('APP_ORIGIN must be your HTTPS website origin.');
  if (config.origin) config.origin = new URL(config.origin).origin;
  return config;
}
