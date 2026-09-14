import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2' };
export const server = http.createServer(async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end('Preview does not accept submissions.'); }
    try {
        const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        let file = path.resolve(root, '.' + pathname);
        if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
        if ((await stat(file)).isDirectory()) {
            if (!pathname.endsWith('/')) { res.writeHead(301, { Location: pathname + '/' }); return res.end(); }
            file = path.join(file, 'index.html');
        }
        const data = await readFile(file);
        res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
        res.end(req.method === 'HEAD' ? undefined : data);
    } catch { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(await readFile(path.join(root, '404.html'))); }
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log('Preview at http://127.0.0.1:' + server.address().port));
