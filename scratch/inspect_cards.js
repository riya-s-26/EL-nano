const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8217;
const CDP_PORT = 9327;
const BASE_DIR = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
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
  const testProfile = path.join(BASE_DIR, 'scratch', 'chrome_compare_profile3');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${testProfile}`, '--disable-gpu', '--no-sandbox', 'about:blank'
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
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 900, deviceScaleFactor: 1, mobile: false });

  // Check Home page
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
  await new Promise(r => setTimeout(r, 1200));

  const homeData = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const cards = Array.from(document.querySelectorAll('.atmosphere-grid .atmo-card'));
        return cards.map((c, i) => {
          const r = c.getBoundingClientRect();
          const img = c.querySelector('img');
          const cs = window.getComputedStyle(c);
          return {
            index: i + 1,
            title: c.querySelector('h3')?.innerText,
            imgSrc: img ? img.getAttribute('src') : null,
            gridColumn: cs.gridColumn,
            aspectRatio: cs.aspectRatio,
            rect: { x: r.x, y: r.y, width: r.width, height: r.height }
          };
        });
      })()
    `,
    returnByValue: true
  });
  console.log('HOME CARDS:', JSON.stringify(homeData.result.value, null, 2));

  // Check About Us page
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about.html` });
  await new Promise(r => setTimeout(r, 1200));

  const aboutData = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const sec = document.querySelector('.about-atmosphere-sec');
        const cards = sec ? Array.from(sec.querySelectorAll('article')) : [];
        return cards.map((c, i) => {
          const r = c.getBoundingClientRect();
          const img = c.querySelector('img');
          const cs = window.getComputedStyle(c);
          return {
            index: i + 1,
            className: c.className,
            title: c.querySelector('h3')?.innerText,
            imgSrc: img ? img.getAttribute('src') : null,
            rect: { x: r.x, y: r.y, width: r.width, height: r.height }
          };
        });
      })()
    `,
    returnByValue: true
  });
  console.log('ABOUT CARDS:', JSON.stringify(aboutData.result.value, null, 2));

  ws.close();
  chrome.kill();
  server.close();
  process.exit(0);
});

