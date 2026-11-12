const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8224;
const CDP_PORT = 9334;
const BASE_DIR = path.resolve(__dirname, '..');
const ARTIFACTS_DIR = 'C:\\Users\\riyas\\.gemini\\antigravity\\brain\\6d96b463-02d5-4dff-8c08-6d061cb29be8';

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/about.html';
  const filePath = path.join(BASE_DIR, reqPath.replace(/^[/\\]+/, ''));
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404); res.end('Not found'); return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'
  };
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  const testProfile = path.join(BASE_DIR, 'scratch', 'chrome_compare_profile8');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${testProfile}`,
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  let list;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      list = await res.json();
      if (list && list.length > 0) break;
    } catch (e) {}
  }

  const wsUrl = (list.find(t => t.type === 'page') || list[0]).webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  let idCounter = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = idCounter++;
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about.html` });
  await new Promise(r => setTimeout(r, 1200));

  // Snap the masonry container directly
  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const el = document.querySelector('.atmo-editorial-masonry');
        if (!el) return null;
        el.scrollIntoView({ block: 'start' });
        const r = el.getBoundingClientRect();
        return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: r.height };
      })()
    `,
    returnByValue: true
  });
  const box = evalRes.result.value;

  const shot = await send('Page.captureScreenshot', {
    format: 'jpeg',
    quality: 90,
    clip: { x: box.x, y: box.y, width: box.width, height: box.height, scale: 1 }
  });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'about_masonry_verified.jpg'), Buffer.from(shot.data, 'base64'));
  console.log('Saved about_masonry_verified.jpg (' + box.width + 'x' + box.height + ')');

  // Also test in Spanish
  await send('Runtime.evaluate', {
    expression: `
      (function() {
        if (window.__switchLang) window.__switchLang('es');
        else {
          const btn = document.querySelector('[data-lang="es"], .lang-btn[data-lang="es"]');
          if (btn) btn.click();
        }
      })()
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const shotEs = await send('Page.captureScreenshot', {
    format: 'jpeg',
    quality: 90,
    clip: { x: box.x, y: box.y, width: box.width, height: box.height, scale: 1 }
  });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'about_masonry_verified_es.jpg'), Buffer.from(shotEs.data, 'base64'));
  console.log('Saved about_masonry_verified_es.jpg');

  ws.close();
  chrome.kill();
  server.close();
  process.exit(0);
});

