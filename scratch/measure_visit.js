const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8231;
const CDP_PORT = 9341;
const BASE_DIR = path.resolve(__dirname, '..');

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
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${path.join(BASE_DIR, 'scratch', 'chrome_visit_test2')}`,
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  let list;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1200,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about.html` });
  await new Promise(r => setTimeout(r, 1500));

  // Scroll #visit into view and reveal all elements
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.about-visit-sec');
      el.scrollIntoView();
      document.querySelectorAll('[data-reveal]').forEach(r => {
        r.classList.add('revealed');
        r.style.opacity = '1';
        r.style.transform = 'none';
      });
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  const clip = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.about-visit-sec');
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height, scale: 1 };
    })()`,
    returnByValue: true
  });

  console.log('Clip:', clip.result.value);

  const ss = await send('Page.captureScreenshot', { clip: clip.result.value });
  fs.writeFileSync(path.join(BASE_DIR, 'scratch', 'current_visit_rendered.jpg'), Buffer.from(ss.data, 'base64'));
  console.log('Saved scratch/current_visit_rendered.jpg');

  ws.close();
  chrome.kill();
  server.close();
  process.exit(0);
});
