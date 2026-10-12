import assert from 'node:assert/strict';
import { test } from 'node:test';

import request from 'supertest';

process.env.DB_PATH = ':memory:';
const { app } = await import('../app.js');

test('GET /api/health returns ok', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok' });
});

test('POST /api/urls then GET /:code redirects to the original url', async () => {
  const created = await request(app)
    .post('/api/urls')
    .send({ url: 'https://example.com/hello' });

  assert.equal(created.status, 201);
  assert.equal(created.body.originalUrl, 'https://example.com/hello');
  assert.equal(created.body.clicks, 0);

  const redirected = await request(app).get(`/${created.body.code}`).redirects(0);
  assert.equal(redirected.status, 302);
  assert.equal(redirected.headers.location, 'https://example.com/hello');
});

test('POST /api/urls rejects an invalid url', async () => {
  const res = await request(app).post('/api/urls').send({ url: 'javascript:alert(1)' });
  assert.equal(res.status, 400);
  assert.ok(res.body.error);
});

test('GET /:code returns 404 for an unknown code', async () => {
  const res = await request(app).get('/does-not-exist');
  assert.equal(res.status, 404);
});
