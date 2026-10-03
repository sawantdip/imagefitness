import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { authController } from '../src/controllers/authController.js';
import { requireAdmin, protectOrigin, cookieName } from '../src/middleware/auth.js';
import { contentSchema, inquirySchema } from '../src/validation/schemas.js';
import { seed } from '../seed.js';
const config = {
  secret: 'test-secret-that-is-longer-than-32-characters',
  email: 'admin@example.com',
  password: 'test-password-12345',
  production: true,
  origin: 'https://gym.example.com',
};
test('Content rejects script URLs, invalid reviews and malformed nested content', () => {
  assert.equal(contentSchema.safeParse(seed).success, true);
  assert.equal(
    contentSchema.safeParse({ ...seed, instagram: 'javascript:alert(1)' }).success,
    false,
  );
  assert.equal(contentSchema.safeParse({ ...seed, trainers: [{ name: 'A' }] }).success, false);
  assert.equal(
    contentSchema.safeParse({ ...seed, reviews: [{ name: 'A', text: 'Review', rating: 9 }] })
      .success,
    false,
  );
});
test('Enquiries validate types, lengths and optional email', () => {
  const good = { name: ' Visitor ', phone: '+91 99999 99999', message: 'Please contact me.' };
  assert.equal(inquirySchema.parse(good).name, 'Visitor');
  assert.equal(inquirySchema.parse(good).email, '');
  for (const input of [
    { ...good, name: 12 },
    { ...good, email: 'invalid' },
    { ...good, message: 'a'.repeat(2001) },
    { ...good, phone: 'hello' },
  ])
    assert.equal(inquirySchema.safeParse(input).success, false);
});
test('Admin cookies, session verification, origin protection and logout', async (t) => {
  const app = express();
  app.use(express.json(), cookieParser(), protectOrigin(config));
  const controller = authController(config);
  app.post('/login', controller.login);
  app.get('/session', requireAdmin(config), controller.session);
  app.post('/logout', controller.logout);
  const server = app.listen(0);
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await new Promise((resolve) => server.once('listening', resolve));
  const url = 'http://127.0.0.1:' + server.address().port;
  assert.equal((await fetch(url + '/session')).status, 401);
  const post = (body, origin = config.origin) =>
    fetch(url + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin },
      body: JSON.stringify(body),
    });
  assert.equal(
    (await post({ email: config.email, password: config.password }, 'https://evil.example.com'))
      .status,
    403,
  );
  assert.equal((await post({ email: config.email, password: 'wrong' })).status, 401);
  const response = await post({ email: config.email, password: config.password });
  assert.equal(response.status, 200);
  const cookie = response.headers.get('set-cookie');
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Strict/);
  assert.equal((await response.json()).token, undefined);
  assert.equal(
    (await fetch(url + '/session', { headers: { Cookie: cookie.split(';')[0] } })).status,
    200,
  );
  const forged = jwt.sign({ role: 'customer' }, config.secret, {
    subject: config.email,
    issuer: 'imagefitness',
    audience: 'imagefitness-admin',
  });
  assert.equal(
    (await fetch(url + '/session', { headers: { Cookie: cookieName + '=' + forged } })).status,
    401,
  );
  const expired = jwt.sign({ role: 'admin' }, config.secret, {
    subject: config.email,
    issuer: 'imagefitness',
    audience: 'imagefitness-admin',
    expiresIn: -1,
  });
  assert.equal(
    (await fetch(url + '/session', { headers: { Cookie: cookieName + '=' + expired } })).status,
    401,
  );
  const logout = await fetch(url + '/logout', {
    method: 'POST',
    headers: { Origin: config.origin },
  });
  assert.match(logout.headers.get('set-cookie'), /Expires=Thu, 01 Jan 1970/);
});
