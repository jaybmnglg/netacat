async function proxyFetch(url) {
  const target = new URL(url);
  if (!/^https?:$/.test(target.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  const response = await fetch(target, {
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
    },
    redirect: "follow"
  });

  const html = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    finalUrl: response.url,
    html
  };
}

export default async function handler(req, res) {
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
    const errorBody = JSON.stringify({ ok: false, error: "Missing url parameter." });
    if (typeof res.status === "function") {
      return res.status(400).send(errorBody);
    }
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(errorBody);
  }

  try {
    const payload = await proxyFetch(url);
    const body = JSON.stringify(payload);
    if (typeof res.status === "function") {
      return res.status(200).send(body);
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(body);
  } catch (error) {
    const errorBody = JSON.stringify({ ok: false, error: error.message });
    if (typeof res.status === "function") {
      return res.status(500).send(errorBody);
    }
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(errorBody);
  }
}
