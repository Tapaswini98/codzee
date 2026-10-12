const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const MAX_URL_LENGTH = 2048;

export class InvalidUrlError extends Error {}

export function assertValidUrl(rawUrl, baseUrl) {
  if (typeof rawUrl !== 'string' || rawUrl.trim().length === 0) {
    throw new InvalidUrlError('url is required');
  }

  if (rawUrl.length > MAX_URL_LENGTH) {
    throw new InvalidUrlError(`url must be ${MAX_URL_LENGTH} characters or fewer`);
  }

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new InvalidUrlError('url must be a valid absolute URL');
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new InvalidUrlError('url must use http or https');
  }

  if (baseUrl && parsed.origin === new URL(baseUrl).origin) {
    throw new InvalidUrlError('cannot shorten a url that points back to this service');
  }

  return parsed.toString();
}
