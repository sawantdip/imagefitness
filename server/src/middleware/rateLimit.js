import crypto from 'node:crypto';
import RateBucket from '../models/RateBucket.js';
// MongoDB counters persist across serverless instances.
export const limit = (name, max, windowMs) => async (req, res, next) => {
  try {
    const window = Math.floor(Date.now() / windowMs);
    const identity = crypto
      .createHash('sha256')
      .update(req.ip || 'unknown')
      .digest('hex');
    const id = `${name}:${identity}:${window}`;
    let bucket;
    try {
      bucket = await RateBucket.findByIdAndUpdate(
        id,
        { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((window + 2) * windowMs) } },
        { upsert: true, new: true },
      );
    } catch (error) {
      if (error.code !== 11000) throw error;
      bucket = await RateBucket.findByIdAndUpdate(id, { $inc: { count: 1 } }, { new: true });
    }
    if (bucket.count > max) {
      res.set('Retry-After', String(Math.ceil(((window + 1) * windowMs - Date.now()) / 1000)));
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    }
    next();
  } catch (error) {
    next(error);
  }
};
