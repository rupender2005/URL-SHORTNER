import { useEffect, useState } from "react";

const API_URL = "https://url-shortner-95kg.onrender.com";
const RECENT_LINKS_KEY = "url-shortener-recent-links";
const MAX_RECENT_LINKS = 5;

function App() {
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState("");
  const [recentLinks, setRecentLinks] = useState([]);

  useEffect(() => {
    try {
      const savedLinks = localStorage.getItem(RECENT_LINKS_KEY);
      if (savedLinks) {
        setRecentLinks(JSON.parse(savedLinks));
      }
    } catch {
      setRecentLinks([]);
    }
  }, []);

  const saveRecentLink = (originalUrl, code) => {
    const newLink = {
      originalUrl,
      shortCode: code,
      shortUrl: `${API_URL}/${code}`,
    };

    const updatedLinks = [
      newLink,
      ...recentLinks.filter((item) => item.shortCode !== code),
    ].slice(0, MAX_RECENT_LINKS);

    setRecentLinks(updatedLinks);

    try {
      localStorage.setItem(RECENT_LINKS_KEY, JSON.stringify(updatedLinks));
    } catch {
      // Keep the in-memory history even when browser storage is unavailable.
    }
  };

  const shortenUrl = async (e) => {
    e.preventDefault();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Please enter a URL to shorten.");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setError("Please enter a valid URL, including https://");
      return;
    }

    setError("");
    setShortCode("");
    setCopiedUrl("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: trimmedUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to shorten URL");
      }

      setUrl(trimmedUrl);
      setShortCode(data.shortCode);
      saveRecentLink(trimmedUrl, data.shortCode);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedUrl(value);
      window.setTimeout(() => setCopiedUrl(""), 1800);
    } catch {
      setError("Could not copy the link. Please copy it manually.");
    }
  };

  const shortUrl = `${API_URL}/${shortCode}`;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <h2>URL Shortener</h2>
        </div>
        <span className="topbar-label">
          <a
            href="https://github.com/rupender2005/URL-SHORTNER"
            target="_blank"
          >
            Github Link
          </a>
        </span>
      </header>

      <main className="page-content">
        <section className="shortener-section">
          <p className="eyebrow">QUICK LINK TOOL</p>
          <h1>Shorten a long URL</h1>
          <p className="intro">
            Paste a URL below and generate a short link you can share easily.
          </p>

          <form className="shorten-form" onSubmit={shortenUrl}>
            <label className="sr-only" htmlFor="url-input">
              Long URL
            </label>
            <input
              id="url-input"
              type="url"
              placeholder="https://example.com/your-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              required
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Shortening..." : "Shorten URL"}
            </button>
          </form>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          {shortCode && !error && (
            <section className="result-section" aria-live="polite">
              <div>
                <p className="result-label">Short URL</p>
                <a
                  className="short-url"
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortUrl}
                </a>
              </div>

              <button
                className="copy-button"
                type="button"
                onClick={() => copyToClipboard(shortUrl)}
              >
                {copiedUrl === shortUrl ? "Copied" : "Copy"}
              </button>
            </section>
          )}
        </section>

        {recentLinks.length > 0 && (
          <section className="recent-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">LOCAL HISTORY</p>
                <h2>Recent links</h2>
              </div>
              <span className="link-count">{recentLinks.length}/5</span>
            </div>

            <div className="recent-list">
              {recentLinks.map((link) => (
                <article className="recent-item" key={link.shortCode}>
                  <div className="recent-info">
                    <a
                      className="recent-short-url"
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.shortUrl}
                    </a>
                    <span className="original-url" title={link.originalUrl}>
                      {link.originalUrl}
                    </span>
                  </div>

                  <button
                    className="recent-copy-button"
                    type="button"
                    onClick={() => copyToClipboard(link.shortUrl)}
                  >
                    {copiedUrl === link.shortUrl ? "Copied" : "Copy"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
