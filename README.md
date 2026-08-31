![netacat logo](public/netacat.png)

# netacat

> A lightweight, zero-dependency local web app for scraping, shuffling, and grinding through ITExamAnswers quizzes with a clean UI.

I got tired of studying CCNA questions on cluttered web pages with fixed question ordering and layout quirks. **netacat** is a quick tool built to proxy ITExamAnswers pages, extract the quiz questions/explanations, and let you practice them in shuffled order.

## Features

- **Instant Shuffling**: Practice questions in random order to test real knowledge, not muscle memory.
- **Direct URL Import**: In-built Node proxy fetches pages directly bypassing browser CORS limitations.
- **Paste Fallback**: If Cloudflare or a page blocks fetching, just copy-paste the raw HTML/text.
- **Explanations & Review**: Auto-merges answers and explanations from linked answer pages into an interactive review mode.
- **Dark Mode**: Built-in dark/light toggle for late-night cramming.
- **Zero External NPM Dependencies**: Pure Node.js `http` module + vanilla ES modules on the frontend.

## Quickstart

Requirements: Node.js (v18+)

```bash
# Clone the repository
git clone https://github.com/your-username/netacat.git
cd netacat

# Run the app (no npm install needed!)
npm start
```

Open your browser to:

```text
http://localhost:5177
```

### Custom Port

If port `5177` is already in use on your system:

**PowerShell (Windows):**
```powershell
$env:PORT='5179'; npm start
```

**Bash / Zsh (Linux/macOS):**
```bash
PORT=5179 npm start
```

## How to Use

1. **Import a Quiz**: Paste an ITExamAnswers URL into the top bar and click **Import**.
   - Example URL: `https://itexamanswers.net/ccna-2-v7-modules-1-4-switching-concepts-vlans-and-intervlan-routing-test-online.html`
2. **Practice**: Answer questions one by one with live score tracking.
3. **Shuffle / Reset**: Click **Shuffle** anytime to re-order the questions.
4. **Review Mode**: Click **Review** to reveal answer keys and detailed explanations.
5. **Paste Import (Advanced)**: If a page blocks direct fetching, expand **Paste HTML**, drop in the page source, and click **Import Pasted Content**.

## How it Works

`netacat` runs a minimal local server (`server.js`) that serves static files from `public/` and acts as a lightweight HTTP proxy (`/api/proxy?url=...`). The client-side parser (`app.js`) detects `wpProQuiz` JSON data structures embedded in the HTML, parses question blocks, and fetches matching explanation pages automatically.

## License

MIT — feel free to fork, hack on it, or adapt it for your own exam prep!
