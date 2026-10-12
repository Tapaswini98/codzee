import { nanoid } from 'nanoid';

import { db } from './db.js';

const insertStmt = db.prepare(
  'INSERT INTO urls (code, original_url, created_at, clicks) VALUES (?, ?, ?, 0)',
);
const getStmt = db.prepare('SELECT * FROM urls WHERE code = ?');
const listStmt = db.prepare('SELECT * FROM urls ORDER BY created_at DESC');
const incrementClicksStmt = db.prepare(
  'UPDATE urls SET clicks = clicks + 1 WHERE code = ?',
);

function toEntry(row) {
  if (!row) return undefined;
  return {
    code: row.code,
    originalUrl: row.original_url,
    createdAt: row.created_at,
    clicks: row.clicks,
  };
}

export function createShortUrl(originalUrl) {
  const code = nanoid(7);
  const createdAt = new Date().toISOString();
  insertStmt.run(code, originalUrl, createdAt);
  return toEntry(getStmt.get(code));
}

export function getUrlByCode(code) {
  return toEntry(getStmt.get(code));
}

export function listUrls() {
  return listStmt.all().map(toEntry);
}

export function incrementClicks(code) {
  incrementClicksStmt.run(code);
}
