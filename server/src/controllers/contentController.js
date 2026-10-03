import Content from '../models/Content.js';
import { seed } from '../../seed.js';
import { withBranches } from '../services/siteContent.js';
export async function getContent(req, res) {
  res.set('Cache-Control', 'no-store');
  res.json(withBranches((await Content.findOne({ key: 'site' }).lean())?.value || seed));
}
export async function updateContent(req, res) {
  await Content.findOneAndUpdate(
    { key: 'site' },
    { $set: { value: req.body } },
    { upsert: true, runValidators: true },
  );
  res.json({ ok: true });
}
