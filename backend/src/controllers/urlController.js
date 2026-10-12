import { BASE_URL } from '../config.js';
import * as urlService from '../services/urlService.js';
import { InvalidUrlError } from '../utils/validateUrl.js';

function withShortUrl(entry) {
  return { ...entry, shortUrl: `${BASE_URL}/${entry.code}` };
}

export function create(req, res) {
  try {
    const entry = urlService.shortenUrl(req.body.url, BASE_URL);
    res.status(201).json(withShortUrl(entry));
  } catch (err) {
    if (err instanceof InvalidUrlError) {
      return res.status(400).json({ error: err.message });
    }
    throw err;
  }
}

export function list(req, res) {
  res.json(urlService.listUrls().map(withShortUrl));
}

export function redirect(req, res) {
  const entry = urlService.getUrlByCode(req.params.code);

  if (!entry) {
    return res.status(404).json({ error: 'short url not found' });
  }

  urlService.registerClick(entry.code);
  res.redirect(entry.originalUrl);
}
