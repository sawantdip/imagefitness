import { createApp } from '../server/src/app.js';
import { getConfig } from '../server/src/config/env.js';
let app;
export default function handler(req, res) {
  try {
    app ??= createApp(getConfig());
    return app(req, res);
  } catch {
    res
      .status(503)
      .json({ error: 'Server configuration is incomplete. Contact the administrator.' });
  }
}
