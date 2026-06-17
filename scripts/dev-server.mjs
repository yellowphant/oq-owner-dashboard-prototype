// 로컬 개발용 정적 서버 + sales-board API 프록시
// 실행: node scripts/dev-server.mjs  → http://127.0.0.1:3001
// python http.server와 달리 /api/overview 프록시를 처리해 실데이터 연결을 로컬에서 확인할 수 있다.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'); // 프로젝트 루트
const PORT = process.env.PORT || 3001;
const API_BASE = process.env.OQ_API_BASE || 'https://oqrun-prod-agent-002-xwamqlvirq-du.a.run.app';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml' };

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');

  // api/overview.js (Vercel 함수)와 동일한 프록시 동작
  if (u.pathname === '/api/overview') {
    const sid = (u.searchParams.get('store_id') || '').trim();
    if (!sid) { res.writeHead(400).end('{"error":"store_id_required"}'); return; }
    try {
      const up = await fetch(`${API_BASE}/v1/sales-board/${encodeURIComponent(sid)}/overview`, { headers: { accept: 'application/json' } });
      const body = await up.text();
      res.writeHead(up.status, { 'content-type': 'application/json; charset=utf-8' }).end(body);
    } catch (e) {
      res.writeHead(502).end(JSON.stringify({ error: 'upstream_failed', detail: String(e) }));
    }
    return;
  }

  const p = u.pathname === '/' ? '/index.html' : u.pathname;
  try {
    const data = await readFile(join(ROOT, p));
    res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }).end(data);
  } catch {
    res.writeHead(404).end('not found');
  }
});

server.listen(PORT, '127.0.0.1', () => console.log(`oq dev server on http://127.0.0.1:${PORT}`));
