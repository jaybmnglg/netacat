async function proxyFetch(url) {
  const target = new URL(url);
  if (!/^https?:$/.test(target.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

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

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  if (typeof res.status === "function") {
    res.status(statusCode);
    if (typeof res.json === "function") {
      return res.json(data);
    }
    return res.send(body);
  }
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.end(body);
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
      return sendJson(res, 400, { ok: false, error: "Missing url parameter." });
    }

    const payload = await proxyFetch(url);
    return sendJson(res, 200, payload);
  } catch (error) {
    const errorMsg = error.name === "AbortError" ? "Fetch request timed out (10s limit)." : (error.message || "Internal server error");
    return sendJson(res, 500, { ok: false, error: errorMsg });
  }
}
