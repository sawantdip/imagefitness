import jwt from 'jsonwebtoken';
export const cookieName = 'imagefitness_session';
export const cookieOptions = (production) => ({
  httpOnly: true,
  secure: production,
  sameSite: 'strict',
  path: '/api',
  maxAge: 8 * 60 * 60 * 1000,
});
export function requireAdmin(config) {
  return (req, res, next) => {
    try {
      const claims = jwt.verify(req.cookies[cookieName], config.secret, {
        algorithms: ['HS256'],
        issuer: 'imagefitness',
        audience: 'imagefitness-admin',
      });
      if (claims.role !== 'admin' || claims.sub !== config.email)
        throw new Error('Invalid session');
      req.admin = claims;
      next();
    } catch {
      res.status(401).json({ error: 'Please sign in again.' });
    }
  };
}
export function protectOrigin(config) {
  return (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    const origin = req.get('origin');
    if (
      (origin && origin !== (config.origin || 'http://localhost:5173')) ||
      req.get('sec-fetch-site') === 'cross-site' ||
      (config.production && !origin)
    )
      return res.status(403).json({ error: 'Request origin is not allowed.' });
    next();
  };
}
