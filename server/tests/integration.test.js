import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import sharp from 'sharp';
import { createApp } from '../src/app.js';
import { connectDatabase } from '../src/config/database.js';
import Content from '../src/models/Content.js';
import Inquiry from '../src/models/Inquiry.js';
import RateBucket from '../src/models/RateBucket.js';
import { seed } from '../seed.js';
test(
  'MongoDB content, enquiries, rate limits and GridFS upload persist',
  { skip: !process.env.TEST_MONGODB_URI },
  async (t) => {
    // A uniquely named disposable database avoids touching existing gym data.
    const uri = new URL(process.env.TEST_MONGODB_URI);
    uri.pathname = '/imagefitness_test_' + Date.now();
    const config = {
      mongoUri: uri.toString(),
      secret: 'integration-test-secret-over-32-characters',
      email: 'admin@example.com',
      password: 'integration-password-12345',
      production: false,
      origin: 'http://localhost:5173',
    };
    await connectDatabase(config.mongoUri);
    await Promise.all([Content.init(), Inquiry.init(), RateBucket.init()]);
    const app = createApp(config),
      server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    t.after(async () => {
      await new Promise((resolve) => server.close(resolve));
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    });
    const url = 'http://127.0.0.1:' + server.address().port;
    const request = (endpoint, method = 'GET', body, cookie) =>
      fetch(url + '/api' + endpoint, {
        method,
        headers: {
          ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
          Origin: config.origin,
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      });
    assert.equal((await request('/content', 'PUT', seed)).status, 401);
    const login = await request('/login', 'POST', {
      email: config.email,
      password: config.password,
    });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie').split(';')[0];
    assert.equal(
      (await request('/content', 'PUT', { ...seed, name: 'Persisted gym' }, cookie)).status,
      200,
    );
    assert.equal((await (await request('/content')).json()).name, 'Persisted gym');
    assert.equal(
      (
        await request('/inquiries', 'POST', {
          name: 'Test member',
          phone: '9999999999',
          message: 'Interested in training.',
        })
      ).status,
      201,
    );
    const enquiries = await (await request('/inquiries?page=1', 'GET', undefined, cookie)).json();
    assert.equal(enquiries.items[0].name, 'Test member');
    assert.equal(enquiries.total, 1);
    const png = await sharp({ create: { width: 16, height: 16, channels: 3, background: 'green' } })
      .png()
      .toBuffer();
    const form = new FormData();
    form.append('image', new Blob([png], { type: 'image/png' }), 'photo.png');
    const upload = await request('/upload', 'POST', form, cookie);
    assert.equal(upload.status, 201);
    const image = await upload.json();
    const download = await fetch(url + image.url);
    assert.equal(download.status, 200);
    assert.match(download.headers.get('content-type'), /image\/webp/);
    assert.equal(
      (await sharp(Buffer.from(await download.arrayBuffer())).metadata()).format,
      'webp',
    );
    const invalid = new FormData();
    invalid.append('image', new Blob(['not an image'], { type: 'image/png' }), 'fake.png');
    assert.equal((await request('/upload', 'POST', invalid, cookie)).status, 400);
    const tooLarge = new FormData();
    tooLarge.append(
      'image',
      new Blob([new Uint8Array(3 * 1024 * 1024 + 1)], { type: 'image/png' }),
      'large.png',
    );
    assert.equal((await request('/upload', 'POST', tooLarge, cookie)).status, 413);
    for (let i = 0; i < 5; i++)
      await request('/inquiries', 'POST', {
        name: 'Member',
        phone: '9999999999',
        message: 'Enquiry',
      });
    assert.equal(
      (
        await request('/inquiries', 'POST', {
          name: 'Member',
          phone: '9999999999',
          message: 'Enquiry',
        })
      ).status,
      429,
    );
    assert.equal((await request('/unknown')).status, 404);
  },
);
