import { useEffect, useState } from 'react';

import './App.css';
import { fetchUrls, shortenUrl } from './api';

function App() {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUrls().then(setUrls).catch(() => setError('Could not load urls'));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const created = await shortenUrl(url);
      setUrls((prev) => [created, ...prev]);
      setUrl('');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app">
      <h1>URL Shortener</h1>

      <form onSubmit={handleSubmit} className="shorten-form">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/some/long/path"
        />
        <button type="submit">Shorten</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="url-list">
        {urls.map((entry) => (
          <li key={entry.code}>
            <a href={entry.shortUrl}>{entry.shortUrl}</a>
            <span className="original-url">{entry.originalUrl}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
