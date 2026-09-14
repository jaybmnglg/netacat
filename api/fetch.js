async function proxyFetch(url) {
  const target = new URL(url);
  if (!/^https?:$/.test(target.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8500);

  try {
    const response = await fetch(target.href, {
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
      },
      redirect: "follow",
      signal: controller.signal
    });

    const html = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      html
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      if (typeof res.status === "function") {
        return res.status(204).end();
      }
      res.statusCode = 204;
      return res.end();
    }

    let url = req.query?.url;
    if (!url && req.url) {
      try {
        const parsed = new URL(req.url, "http://localhost");
        url = parsed.searchParams.get("url");
      } catch {}
    }

    if (!url) {
      if (typeof res.status === "function") {
        return res.status(400).json({ ok: false, error: "Missing url parameter." });
      }
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.end(JSON.stringify({ ok: false, error: "Missing url parameter." }));
    }

    const payload = await proxyFetch(url);
    if (typeof res.status === "function") {
      return res.status(200).json(payload);
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify(payload));
  } catch (error) {
    const errorMsg = error.name === "AbortError" ? "Fetch request timed out (8.5s limit)." : (error.message || "Internal server error");
    if (typeof res.status === "function") {
      return res.status(500).json({ ok: false, error: errorMsg });
    }
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({ ok: false, error: errorMsg }));
  }
}

