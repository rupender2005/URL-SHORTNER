import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "https://url-shortner-95kg.onrender.com";

  const shortenUrl = async (e) => {
    // Prevent page reload on form submission
    e.preventDefault();

    // Basic frontend validation
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setError("");
    setShortCode("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to shorten URL");
      }

      setShortCode(data.shortCode);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      // Always stop loading
      setIsLoading(false);
    }
  };

  const shortUrl = `${API_URL}/${shortCode}`;

  return (
    <div className="container">
      <h1>URL Shortener</h1>

      <form className="form" onSubmit={shortenUrl}>
        <input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Shortening..." : "Shorten"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {shortCode && !error && (
        <div className="result">
          <p>Short URL:</p>

          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
