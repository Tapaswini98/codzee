import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';

import {
  createShortUrl,
  getUrlByCode,
  incrementClicks,
  listUrls,
} from './urlStore.js';
import { InvalidUrlError, assertValidUrl } from './validateUrl.js';

const app = express();
const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const shortenRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too many urls shortened, please try again later' },
});

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/urls', shortenRateLimit, (req, res) => {
  try {
    const validUrl = assertValidUrl(req.body.url, BASE_URL);
    const entry = createShortUrl(validUrl);
    res.status(201).json({ ...entry, shortUrl: `${BASE_URL}/${entry.code}` });
  } catch (err) {
    if (err instanceof InvalidUrlError) {
      return res.status(400).json({ error: err.message });
    }
    throw err;
  }
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
