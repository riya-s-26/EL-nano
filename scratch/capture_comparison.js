const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8215;
const CDP_PORT = 9325;
const BASE_DIR = path.resolve(__dirname, '..');
const ARTIFACTS_DIR = 'C:\\Users\\riyas\\.gemini\\antigravity\\brain\\6d96b463-02d5-4dff-8c08-6d061cb29be8';

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(BASE_DIR, reqPath.replace(/^[/\\]+/, ''));

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2'
  };
  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);

  const testProfile = path.join(BASE_DIR, 'scratch', 'chrome_compare_profile');
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
  await send('DOM.enable');

  async function captureElement(url, selector, outName, width = 1366, height = 900) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 1200));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (function() {
          const el = document.querySelector('${selector}');
          if (!el) return null;
          el.scrollIntoView({ block: 'center' });
          const rect = el.getBoundingClientRect();
          return {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            scrollX: window.scrollX,
            scrollY: window.scrollY
          };
        })()
      `,
      returnByValue: true
    });

    const box = evalRes.result.value;
    if (!box) {
      console.error(`Selector ${selector} not found on ${url}`);
      return;
    }

    await new Promise(r => setTimeout(r, 400));

    // Capture screenshot of element
    const clip = {
      x: box.x,
      y: box.y,
      width: Math.min(box.width, width),
      height: Math.min(box.height, 2000),
      scale: 1
    };

    const shot = await send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 85,
      clip
    });

    fs.writeFileSync(path.join(ARTIFACTS_DIR, outName), Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${outName} (${box.width}x${box.height})`);
  }

  // Capture Home page hospitality/atmosphere section
  await captureElement(`http://127.0.0.1:${PORT}/index.html`, '.atmosphere', 'home_atmosphere_current.jpg');

  // Capture About Us page hospitality/atmosphere section
  await captureElement(`http://127.0.0.1:${PORT}/about.html`, '.about-atmosphere-sec', 'about_atmosphere_current.jpg');

  ws.close();
  chrome.kill();
  server.close();
  console.log('Done!');
  process.exit(0);
});

