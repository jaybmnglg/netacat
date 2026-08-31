import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const port = Number(process.env.PORT || 5177);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...headers
  });
  res.end(body);
}

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

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      return send(res, 204, "");
    }

    const requestUrl = new URL(req.url, `http://localhost:${port}`);

    if (requestUrl.pathname === "/api/fetch") {
      const target = requestUrl.searchParams.get("url");
      if (!target) {
        return send(res, 400, JSON.stringify({ error: "Missing url parameter." }), {
          "content-type": "application/json; charset=utf-8"
        });
      }

      const payload = await proxyFetch(target);
      return send(res, 200, JSON.stringify(payload), {
        "content-type": "application/json; charset=utf-8"
      });
    }

    let decodedPath;
    try {
      decodedPath = decodeURIComponent(requestUrl.pathname);
    } catch {
      return send(res, 400, "Bad Request: Malformed URI");
    }

    const requestedPath = decodedPath === "/" ? "/index.html" : decodedPath;
    const safePath = path.normalize(requestedPath).replace(/^([/\\])+/, "");
    const filePath = path.resolve(publicDir, safePath);

    const relative = path.relative(publicDir, filePath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      return send(res, 403, "Forbidden");
    }

    let stats;
    try {
      stats = await fs.stat(filePath);
    } catch (err) {
      if (err.code === "ENOENT") {
        return send(res, 404, "Not found");
      }
      throw err;
    }

    if (stats.isDirectory()) {
      const indexFile = path.join(filePath, "index.html");
      const body = await fs.readFile(indexFile);
      return send(res, 200, body, {
        "content-type": mimeTypes[".html"]
      });
    }

    const body = await fs.readFile(filePath);
    send(res, 200, body, {
      "content-type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream"
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      return send(res, 404, "Not found");
    }
    send(res, 500, JSON.stringify({ error: error.message }), {
      "content-type": "application/json; charset=utf-8"
    });
  }
});

server.listen(port, () => {
  console.log(`netacat running at http://localhost:${port}`);
});
