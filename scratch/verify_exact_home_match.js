const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8226;
const CDP_PORT = 9336;
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
  const testProfile = path.join(BASE_DIR, 'scratch', 'chrome_exact_match_profile');
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

  async function snap(url, selector, filename, width = 1366, height = 900) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 1200));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (function() {
          const el = document.querySelector('${selector}');
          if (!el) return null;
          el.scrollIntoView({ block: 'start' });
          const r = el.getBoundingClientRect();
          return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: r.height };
        })()
      `,
      returnByValue: true
    });
    const box = evalRes.result.value;
    if (!box) {
      console.error('Selector not found: ' + selector);
      return;
    }

    const shot = await send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 90,
      clip: { x: box.x, y: box.y, width: box.width, height: box.height, scale: 1 }
    });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, filename), Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${filename} (${box.width}x${box.height})`);
  }

  // Snap About Us Hospitality section at Desktop 1366px
  await snap(`http://127.0.0.1:${PORT}/about.html`, '.about-atmosphere-sec', 'about_hospitality_exact_desktop.jpg', 1366);
  await snap(`http://127.0.0.1:${PORT}/about.html`, '.atmosphere-grid', 'about_grid_exact_desktop.jpg', 1366);

  // Snap Home page Hospitality section for comparison
  await snap(`http://127.0.0.1:${PORT}/index.html`, '.atmosphere-grid', 'home_grid_exact_desktop.jpg', 1366);

  // Snap at Tablet 1024px
  await snap(`http://127.0.0.1:${PORT}/about.html`, '.atmosphere-grid', 'about_grid_exact_tablet.jpg', 1024);

  // Snap at Mobile 375px
  await snap(`http://127.0.0.1:${PORT}/about.html`, '.atmosphere-grid', 'about_grid_exact_mobile.jpg', 375, 800);

  // Measure card rects on About Us page
  const rects = await send('Runtime.evaluate', {
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
            img: img ? img.getAttribute('src') : null,
            gridColumn: cs.gridColumn,
            aspectRatio: cs.aspectRatio,
            rect: { x: r.x, y: r.y, width: r.width, height: r.height }
          };
        });
      })()
    `,
    returnByValue: true
  });
  console.log('About Us Rects:', JSON.stringify(rects.result.value, null, 2));

  // Switch to Spanish and snap
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

  const evalEs = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const grid = document.querySelector('.atmosphere-grid');
        if (!grid) return null;
        grid.scrollIntoView({ block: 'start' });
        const r = grid.getBoundingClientRect();
        return {
          box: { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: r.height },
          titles: Array.from(grid.querySelectorAll('h3')).map(h => h.innerText),
          descs: Array.from(grid.querySelectorAll('p')).map(p => p.innerText)
        };
      })()
    `,
    returnByValue: true
  });
  console.log('ES Titles & Descs:', JSON.stringify(evalEs.result.value, null, 2));

  const shotEs = await send('Page.captureScreenshot', {
    format: 'jpeg',
    quality: 90,
    clip: { x: evalEs.result.value.box.x, y: evalEs.result.value.box.y, width: evalEs.result.value.box.width, height: evalEs.result.value.box.height, scale: 1 }
  });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'about_grid_exact_es.jpg'), Buffer.from(shotEs.data, 'base64'));
  console.log('Saved about_grid_exact_es.jpg');

  ws.close();
  chrome.kill();
  server.close();
  process.exit(0);
});

