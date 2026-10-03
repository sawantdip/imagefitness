import Inquiry from '../models/Inquiry.js';
export async function createInquiry(req, res) {
  await Inquiry.create(req.body);
  res.status(201).json({ ok: true });
}
export async function getInquiries(req, res) {
  const page = Math.max(1, Math.min(100000, Number.parseInt(req.query.page, 10) || 1));
  const pageSize = 20;
  const [items, total] = await Promise.all([
    Inquiry.find()
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Inquiry.countDocuments(),
  ]);
  res.set('Cache-Control', 'no-store');
  res.json({ items, total, page, pageSize });
}
