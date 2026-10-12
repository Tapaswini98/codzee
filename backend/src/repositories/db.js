import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', '..', 'data');

const dbPath = process.env.DB_PATH || path.join(dataDir, 'url-shortener.sqlite');
if (!process.env.DB_PATH) {
  fs.mkdirSync(dataDir, { recursive: true });
}
export const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    code TEXT PRIMARY KEY,
    original_url TEXT NOT NULL,
    created_at TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0
  )
`);
