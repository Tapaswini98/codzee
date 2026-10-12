import * as urlRepository from '../repositories/urlRepository.js';
import { assertValidUrl } from '../utils/validateUrl.js';

export function shortenUrl(rawUrl, baseUrl) {
  const validUrl = assertValidUrl(rawUrl, baseUrl);
  return urlRepository.createShortUrl(validUrl);
}

export function getUrlByCode(code) {
  return urlRepository.getUrlByCode(code);
}

export function listUrls() {
  return urlRepository.listUrls();
}

export function registerClick(code) {
  urlRepository.incrementClicks(code);
}
