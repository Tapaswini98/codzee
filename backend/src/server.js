import cors from 'cors';
import express from 'express';

import {
  createShortUrl,
  getUrlByCode,
  incrementClicks,
  listUrls,
} from './urlStore.js';

const app = express();
const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/urls', (req, res) => {
  const { url } = req.body;

  const isHttp = (u) => { try { return /^https?:$/.test(new URL(u).protocol); } catch { return false; } };
  if (typeof url !== 'string' || !isHttp(url)) {
    return res.status(400).json({ error: 'a valid http(s) url is required' });
  }
    return res.status(400).json({ error: 'url is required' });
  }

  const entry = createShortUrl(url);
  res.status(201).json({ ...entry, shortUrl: `${BASE_URL}/${entry.code}` });
});

app.get('/api/urls', (req, res) => {
  const urls = listUrls().map((entry) => ({
    ...entry,
    shortUrl: `${BASE_URL}/${entry.code}`,
  }));
  res.json(urls);
});

app.get('/:code', (req, res) => {
  const entry = getUrlByCode(req.params.code);

  if (!entry) {
    return res.status(404).json({ error: 'short url not found' });
  }

  incrementClicks(entry.code);
  res.redirect(entry.originalUrl);
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
