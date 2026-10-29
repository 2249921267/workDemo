import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../site/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.md':'text/plain; charset=utf-8'};
http.createServer(async (req,res) => {
  try {
    let name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    // Mirror the public GitHub Pages base path in local QA too.
    if (name.startsWith('/workDemo/')) name = name.slice('/workDemo'.length);
    if (name.endsWith('/')) name += 'index.html';
    const target = path.resolve(root, '.' + name);
    if (!target.startsWith(root)) throw new Error('path');
    const bytes = await fs.readFile(target);
    res.writeHead(200, {'Content-Type':mime[path.extname(target)] || 'application/octet-stream','Cache-Control':'no-store'}).end(bytes);
  } catch { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}).end('Page not found'); }
}).listen(port,'127.0.0.1',()=>process.stdout.write(`Portfolio preview: http://127.0.0.1:${port}/workDemo/\n`));
