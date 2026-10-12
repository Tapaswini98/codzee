const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function shortenUrl(url) {
  const res = await fetch(`${API_BASE}/api/urls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to shorten url');
  }

  return res.json();
}

export async function fetchUrls() {
  const res = await fetch(`${API_BASE}/api/urls`);
  if (!res.ok) {
    throw new Error('Failed to load urls');
  }
  return res.json();
}
