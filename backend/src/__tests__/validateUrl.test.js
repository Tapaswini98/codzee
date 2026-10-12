import assert from 'node:assert/strict';
import { test } from 'node:test';

import { InvalidUrlError, assertValidUrl } from '../utils/validateUrl.js';

const BASE_URL = 'http://localhost:4000';

test('accepts a well-formed http(s) url', () => {
  assert.equal(
    assertValidUrl('https://example.com/path', BASE_URL),
    'https://example.com/path',
  );
});

test('rejects a missing url', () => {
  assert.throws(() => assertValidUrl(undefined, BASE_URL), InvalidUrlError);
  assert.throws(() => assertValidUrl('', BASE_URL), InvalidUrlError);
});

test('rejects a non-http(s) scheme', () => {
  assert.throws(() => assertValidUrl('javascript:alert(1)', BASE_URL), InvalidUrlError);
  assert.throws(() => assertValidUrl('data:text/html,hi', BASE_URL), InvalidUrlError);
});

test('rejects malformed input', () => {
  assert.throws(() => assertValidUrl('not a url', BASE_URL), InvalidUrlError);
});

test('rejects a url pointing back at this service', () => {
  assert.throws(
    () => assertValidUrl('http://localhost:4000/abc', BASE_URL),
    InvalidUrlError,
  );
});

test('rejects an overly long url', () => {
  const longUrl = `https://example.com/${'a'.repeat(2048)}`;
  assert.throws(() => assertValidUrl(longUrl, BASE_URL), InvalidUrlError);
});
