import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const shortenUrl = async (e) => {
    // Prevents default page reload on form submission
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
      const response = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl: url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to shorten URL");
      }

      setShortCode(data.shortCode);
      // Optional: setUrl("") to clear input after success
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      // Always stop the loading spinner, even if it fails
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>

      {/* Replaced generic div with a semantic form element */}
      <form className="form" onSubmit={shortenUrl}>
        <input
          type="url" // Triggers appropriate mobile keyboard and basic HTML5 validation
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
          <a
            href={`http://localhost:5000/${shortCode}`}
            target="_blank"
            rel="noopener noreferrer" // Security best practice
          >
            http://localhost:5000/{shortCode}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
