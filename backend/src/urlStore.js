import { nanoid } from 'nanoid';

const urlsByCode = new Map();

export function createShortUrl(originalUrl) {
  const code = nanoid(7);
  const entry = { code, originalUrl, createdAt: new Date().toISOString() };
  urlsByCode.set(code, entry);
  return entry;
}

export function getUrlByCode(code) {
  return urlsByCode.get(code);
}

export function listUrls() {
  return Array.from(urlsByCode.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
}
