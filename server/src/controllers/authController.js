import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookieName, cookieOptions } from '../middleware/auth.js';
export function authController(config) {
  let hashPromise;
  return {
    login: async (req, res) => {
      hashPromise ??= bcrypt.hash(config.password, 12);
      const matches = await bcrypt.compare(req.body.password, await hashPromise);
      if (req.body.email !== config.email || !matches)
        return res.status(401).json({ error: 'Email or password is incorrect.' });
      const token = jwt.sign({ role: 'admin' }, config.secret, {
        algorithm: 'HS256',
        subject: config.email,
        issuer: 'imagefitness',
        audience: 'imagefitness-admin',
        expiresIn: '8h',
      });
      res.cookie(cookieName, token, cookieOptions(config.production));
      res.set('Cache-Control', 'no-store');
      res.json({ ok: true });
    },
    logout: (req, res) => {
      const { maxAge, ...options } = cookieOptions(config.production);
      res.clearCookie(cookieName, options);
      res.json({ ok: true });
    },
    session: (req, res) => {
      res.set('Cache-Control', 'no-store');
      res.json({ email: req.admin.sub });
    },
  };
}
